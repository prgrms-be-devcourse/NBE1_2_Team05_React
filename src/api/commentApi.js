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
        return response.data.data;  // Assuming your response structure contains a 'data' field
    } catch (error) {
        console.error('Error fetching comments', error);
        throw error;
    }
};
