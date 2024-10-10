import axios from 'axios';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from './localStorage';

axios.defaults.withCredentials = true;

let isLoggingOut = false;

// 요청 인터셉터
axios.interceptors.request.use(
    (config) => {
        const accessToken = getLocalStorage('access_token');
        // /validate 요청에는 Authorization 헤더를 추가하지 않음
        if (accessToken && !config.url.includes('/validate')) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


// 응답 인터셉터
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const refreshToken = getLocalStorage('refresh_token');

        // 무한 루프 방지를 위해 /validate 요청을 제외
        if (originalRequest.url.includes('/validate')) {
            return Promise.reject(error); // /validate 경로에서 발생한 오류는 재시도하지 않음
        }

        console.log(error.response.data);

        if (error.response && error.response.status === 401 &&
            error.response.data?.error === "만료된 액세스 토큰입니다." &&
            refreshToken && !originalRequest._retry) {

            originalRequest._retry = true;

            try {
                const refreshResponse = await axios.post('http://localhost:8080/api/v1/members/validate', {
                    refreshToken: refreshToken
                });


                if (refreshResponse.status === 201 && refreshResponse.data) {
                    const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.result;

                    // 새로 발급된 토큰을 저장
                    setLocalStorage('access_token', accessToken);
                    if (newRefreshToken) {
                        setLocalStorage('refresh_token', newRefreshToken);
                    }

                    // 원래의 요청 헤더에 새 액세스 토큰을 설정하고 재요청
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return axios(originalRequest);
                } else {
                    throw new Error("리프레시 토큰 갱신에 실패했습니다.");
                }

            } catch (refreshError) {
                console.error("리프레시 토큰 갱신 실패:", refreshError);

                if (!isLoggingOut) {
                    isLoggingOut = true;
                    removeLocalStorage('access_token');
                    removeLocalStorage('refresh_token');
                    alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                    window.location.href = '/signin';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axios;
