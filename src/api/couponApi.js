import axios from "axios";
import AxiosInterceptor from "./axiosInterceptor";

const API_BASE_URL = 'http://localhost:8080/api/v1/coupons';  // 쿠폰 API의 Base URL

// 나의 쿠폰 리스트 조회
export const getAllCouponsByMemberEmail = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}`);

        return response.data.result.map(item => ({
            couponId: item.couponId,
            name: item.name,
            percent: item.percent,
        }));

    } catch (error) {
        console.error("Failed to fetch coupons by member email:", error);
        throw error;  // 에러 처리
    }
};

//선착순 쿠폰 발급
export const getFirstComeCoupon = async (performanceId) => {
    try {
        const response = await axios.patch(`${API_BASE_URL}`, {
            performanceId
        });

        // 성공적으로 200 응답이 왔을 때 처리
        if (response.data.isSuccess) {
            console.log(response.data);
            return {message: "선착순 쿠폰이 발급되었습니다.", expireTime: response.data.result.expireTime};
        }
    } catch (error) {
        if (error.response) {
            const errorData = error.response.data;
            return {message: errorData.message};
        }
    }
};