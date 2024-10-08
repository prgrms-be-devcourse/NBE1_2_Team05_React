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

// 댓글 생성 API
export const createComment = async (performanceId, content, parentId = null) => {
    try {
        const response = await axios.post(`${API_URL}/${performanceId}`, {
            content,
            parentId,
        });
        return response.data;
    } catch (error) {
        console.error('Error creating comment', error);
        throw error;
    }
};

// 댓글 수정 API
export const updateComment = async (commentId, content) => {
    try {
        const response = await axios.patch(`${API_URL}/${commentId}`, {
            content
        });
        return response.data;
    } catch (error) {
        console.error('Error updating comment', error);
        throw error;
    }
};


// 댓글 삭제 API
export const deleteComment = async (commentId) => {
    try {
        const response = await axios.delete(`${API_URL}/${commentId}`);
        return response.data;  // 서버 응답: 삭제된 댓글의 performanceId
    } catch (error) {
        console.error('Error deleting comment', error);
        throw error;
    }
};
