import axios from 'axios';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from './localStorage';

axios.defaults.withCredentials = true;

let isLoggingOut = false;

// 요청 인터셉터
axios.interceptors.request.use(
    (config) => {
        const accessToken = getLocalStorage('access_token');
        if (accessToken) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const refreshToken = getLocalStorage('refresh_token');

        if (error.response && error.response.status === 401 &&
            error.response.data.message === "만료된 액세스 토큰입니다." &&
            refreshToken && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshResponse =
                    await axios.post('http://localhost:8080/api/v1/members/validate', { refreshToken });


                if (refreshResponse.status === 201 && refreshResponse.data.isSuccess) {
                    const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.result;

                    setLocalStorage('access_token', accessToken);
                    if (newRefreshToken) {
                        setLocalStorage('refresh_token', newRefreshToken);
                    }

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return axios(originalRequest);
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
