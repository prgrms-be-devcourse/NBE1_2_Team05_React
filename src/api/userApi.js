import axios from "axios";

const API_BASE_URL = 'http://localhost:8080/api/v1/members';  // 서버 주소와 Base URL을 함께 정의

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
    } catch (error){
        if(error.response){
            if(error.response.status === 409){
                // 닉네임 중복 시
                return {isDuplicate: true};
            }else if (error.response.status === 400) {
                // 닉네임 형식 오류
                return {isInvalidFormat: true};
            }
        }
        throw error;
    }

    // 일반 사용자 회원가입
    export const basicUserRegister = async (email,password,name) => {
        try{
            const response = await axios.post(`${API_BASE_URL}/register` , {
                email,
                password,
                name
            });

            if(response.data.isSuccess){
                return {registerCheck: true};
            }else{
                if(response.data.code === "SOCIAL409"){

                }
            }





        }catch (error){
            if(error.response){
                if(error.response.status)
            }
        }
    }




}
