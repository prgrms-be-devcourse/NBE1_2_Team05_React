import axios from "axios";

const API_BASE_URL = 'http://localhost:8080/api/v1/coupons';  // 쿠폰 API의 Base URL

// 나의 쿠폰 리스트 조회
export const getAllCouponsByMemberEmail = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}`);
        // 서버에서 받아온 데이터는 response.data에 있음
        return response.data;  // 성공적으로 쿠폰 리스트를 받아온 경우
    } catch (error) {
        console.error("Failed to fetch coupons by member email:", error);
        throw error;  // 에러 처리
    }
};