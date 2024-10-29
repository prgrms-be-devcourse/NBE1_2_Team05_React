import axios from './axiosInterceptor';

const CHAT_API_URL = 'http://localhost:8080/api/v1/chats';

// 새로운 채팅방 생성 API
export const createChatRoom = async (performanceId) => {
    try {
        const response = await axios.post(`${CHAT_API_URL}/room/${performanceId}`);
        return response.data;
    } catch (error) {
        console.error('Error creating chat room', error);
        throw error;
    }
};

// 채팅 메시지 전송 API
export const sendMessage = async (chatRoomId, messageContent) => {
    try {
        const response = await axios.post(`${CHAT_API_URL}/room/${chatRoomId}/message`, {
            content: messageContent,
        });
        return response.data;
    } catch (error) {
        console.error('Error sending message', error);
        throw error;
    }
};

// 특정 채팅방의 메시지 목록 조회 API
export const getMessages = async (chatRoomId) => {
    try {
        const response = await axios.get(`${CHAT_API_URL}/room/${chatRoomId}/messages`);
        return response.data.result;  // 결과는 응답에서 result 필드에 있을 것으로 가정
    } catch (error) {
        console.error('Error fetching messages', error);
        throw error;
    }
};

// 사용자가 참여한 채팅방 목록 조회 API
export const getChatRooms = async () => {
    try {
        const response = await axios.get(`${CHAT_API_URL}/room/my`);
        return response.data.result;  // 결과는 응답에서 result 필드에 있을 것으로 가정
    } catch (error) {
        console.error('Error fetching chat rooms', error);
        throw error;
    }
};
