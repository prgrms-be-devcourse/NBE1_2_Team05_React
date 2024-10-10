import axios from "./axiosInterceptor";
// import axios from "axios";


const API_BASE_URL = 'http://localhost:8080/api/v1/members';

// 이메일 중복 체크
export const validateEmailAndCheckDuplicate = async (email) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/validation/email/${email}`);
        return {isDuplicate: false};
    } catch (error) {
        if(error.response){
            if (error.response.status === 409) {
                // 이메일 중복 시
                return {isDuplicate: true};
            }else if (error.response.status === 400) {
                // 이메일 형식 오류
                return {isInvalidFormat: true};
            }
        }
        throw error;
    }
};

// 닉네임 중복체크
export const checkName = async (name) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/validation/name/${name}`);
        return {isDuplicate: false};
    } catch (error) {
        if (error.response) {
            if (error.response.status === 409) {
                // 닉네임 중복 시
                return {isDuplicate: true};
            } else if (error.response.status === 400) {
                // 닉네임 형식 오류
                return {isInvalidFormat: true};
            }
        }
        throw error;
    }
}

    // 일반 사용자 회원가입
    export const basicUserRegister = async (email, password, name) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/register`, {
                email,
                password,
                name
            });

            // 성공적으로 200 응답이 왔을 때 처리
            if (response.data.isSuccess) {
                return { registerCheck: true };
            }
        } catch (error) {
            if (error.response) {
                const errorData = error.response.data;
                // 서버에서 보낸 code와 message 기반 처리
                if (errorData.code !== "COMMON200") {
                    return { registerCheck: false, message: errorData.message };
            } else {
                // 네트워크 문제 처리
                return { registerCheck: false, message: "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요." };
            }
        }
    };
}

export const socialUserRegister = async (name) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/oauth/register`, {
            name
        },{
            withCredentials: true  // 세션 쿠키를 포함하도록 설정
        });

        // 응답에서 accessToken과 refreshToken이 있는지 확인하고 저장
        if (response.data.accessToken && response.data.refreshToken) {
            localStorage.setItem('access_token', response.data.accessToken);
            localStorage.setItem('refresh_token', response.data.refreshToken);

            return { registerCheck: true, message: '회원가입이 성공적으로 완료되었습니다.' };
        } else {
            return { registerCheck: false, message: '토큰 발급에 실패했습니다.' };
        }
    } catch (error) {
        if (error.response) {
            const errorData = error.response.data;
            if (errorData.code !== "COMMON200") {
                return { registerCheck: false, message: errorData.message };
            } else {
                return { registerCheck: false, message: "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요." };
            }
        }
    }
}

// 사용자 정보 조회
export const getMemberInfo = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}`, {
            withCredentials: true  // 인증 쿠키를 포함하여 요청
        });

        // 응답이 성공적일 경우 사용자 정보 반환
        if (response.data.isSuccess) {
            return response.data.result;  // 서버에서 반환하는 사용자 정보
        }
    } catch (error) {
        // 에러 처리
        if (error.response) {
            return { error: error.response.data.message };
        }
        throw error;
    }
};