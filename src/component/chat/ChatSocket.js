const BASE_WEBSOCKET_URL = "ws://localhost:8080/ws/chat";
const CHAT_LIST_WEBSOCKET_URL = `${BASE_WEBSOCKET_URL}/chat-list`;

let chatSocket = null;
let chatListSocket = null;

// 채팅방 소켓 연결 함수
export const connectChatSocket = (chatRoomId, onMessage) => {
    if (!chatSocket || chatSocket.readyState === WebSocket.CLOSED) {
        chatSocket = new WebSocket(`${BASE_WEBSOCKET_URL}?chatRoomId=${chatRoomId}`);

        chatSocket.onopen = () => console.log(`WebSocket connected to chat room ${chatRoomId}`);

        chatSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onMessage(data);
        };

        chatSocket.onclose = () => console.log(`WebSocket connection to chat room ${chatRoomId} closed.`);
    }
};

// 채팅 목록 소켓 연결 함수
export const connectChatListSocket = (onMessage) => {
    if (!chatListSocket || chatListSocket.readyState === WebSocket.CLOSED) {
        chatListSocket = new WebSocket(CHAT_LIST_WEBSOCKET_URL);

        chatListSocket.onopen = () => console.log("WebSocket connected to chat list.");

        chatListSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            onMessage(data);
        };

        chatListSocket.onclose = () => console.log("WebSocket connection to chat list closed.");
    }
};

// 채팅방 메시지 전송 함수
export const sendChatMessage = (messageData) => {
    if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
        chatSocket.send(JSON.stringify(messageData));
    }
};

// 채팅 목록 소켓 메시지 전송 함수 (필요 시 추가)
export const sendChatListMessage = (messageData) => {
    if (chatListSocket && chatListSocket.readyState === WebSocket.OPEN) {
        chatListSocket.send(JSON.stringify(messageData));
    }
};

// 채팅방 소켓 연결 해제
export const disconnectChatSocket = () => {
    if (chatSocket) {
        chatSocket.close();
        chatSocket = null;
    }
};

// 채팅 목록 소켓 연결 해제
export const disconnectChatListSocket = () => {
    if (chatListSocket) {
        chatListSocket.close();
        chatListSocket = null;
    }
};
