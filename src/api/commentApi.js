import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/comments';

export const getComments = async (performanceId, page = 0, size = 10) => {
    try {
        const response = await axios.get(`${API_URL}/${performanceId}`, {
            params: {
                page,
                size,
            },
        });
        return response.data.result;  // 여기서 result 필드를 반환하도록 수정
    } catch (error) {
        console.error('Error fetching comments', error);
        throw error;
    }
};
