// ChatRoom.js
import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { getMessages, sendMessage } from "../../api/chatApi";
import { FiX } from 'react-icons/fi';
import dayjs from 'dayjs';
import { useAuth } from "../../context/AuthContext"; // AuthContext import

const DEFAULT_USER_IMAGE = "https://via.placeholder.com/30";

const ChatRoom = ({ chatRoomId, performanceTitle, performanceImageUrl, closeRoom }) => {
    const { userName } = useAuth(); // 현재 로그인한 사용자 이름 가져오기
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 400, height: 500, x: 100, y: 100 });

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const roomMessages = await getMessages(chatRoomId);
                setMessages(roomMessages);
            } catch (error) {
                console.error('Error fetching messages', error);
            }
        };
        fetchMessages();
    }, [chatRoomId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            await sendMessage(chatRoomId, newMessage);
            setMessages([...messages, { senderName: userName, messageContent: newMessage, sentAt: new Date() }]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message', error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 엔터 시 페이지 새로고침 방지
            handleSendMessage();
        }
    };

    const toggleFullScreen = () => {
        if (isFullScreen) {
            setIsFullScreen(false);
            setWindowSize({ width: 400, height: 500, x: 100, y: 100 });
        } else {
            setIsFullScreen(true);
            setWindowSize({ width: window.innerWidth, height: window.innerHeight, x: 0, y: 0 });
        }
    };

    return (
        <Rnd
            size={isFullScreen ? { width: '100vw', height: '100vh' } : { width: windowSize.width, height: windowSize.height }}
            position={isFullScreen ? { x: 0, y: 0 } : { x: windowSize.x, y: windowSize.y }}
            onDragStop={(e, d) => setWindowSize({ ...windowSize, x: d.x, y: d.y })}
            onResizeStop={(e, direction, ref, delta, position) => {
                setWindowSize({
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                    ...position,
                });
            }}
            minWidth={300}
            minHeight={400}
            bounds="window"
            style={{
                border: '1px solid black',
                padding: '20px',
                backgroundColor: 'white',
                color: 'black',
                zIndex: 1001,
                position: 'fixed',
                borderRadius: '8px',
            }}
        >
            {/* 상단 공연 정보 표시 */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid #ddd',
                paddingBottom: '10px',
                marginBottom: '10px',
            }}>
                <img
                    src={performanceImageUrl}
                    alt={performanceTitle}
                    style={{ width: '50px', height: '50px', borderRadius: '8px', marginRight: '10px' }}
                />
                <h3 style={{ margin: 0 }}>{performanceTitle}</h3>
                <button
                    onClick={closeRoom}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                        color: 'grey',
                        marginLeft: 'auto',
                    }}
                >
                    <FiX />
                </button>
            </div>

            {/* 채팅 메시지 목록 */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                maxHeight: `${windowSize.height - 150}px`,
                padding: '10px',
                border: '1px solid #ddd',
                marginBottom: '10px',
            }}>
                {messages.map((message, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        justifyContent: message.senderName === userName ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-end',
                        marginBottom: '10px',
                    }}>
                        {/* 왼쪽 채팅에서 사용자 이미지 */}
                        {message.senderName !== userName && (
                            <img
                                src={DEFAULT_USER_IMAGE}
                                alt={message.senderName}
                                style={{
                                    width: '30px',
                                    height: '30px',
                                    borderRadius: '50%',
                                    marginRight: '10px',
                                }}
                            />
                        )}
                        <div style={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: message.senderName === userName ? 'flex-end' : 'flex-start' }}>
                            {/* 상대방인 경우에만 닉네임 표시 */}
                            {message.senderName !== userName && (
                                <div style={{
                                    fontSize: '12px',
                                    color: '#666',
                                    marginBottom: '2px',
                                    textAlign: 'left'
                                }}>
                                    {message.senderName}
                                </div>
                            )}
                            <div style={{
                                display: 'flex',
                                flexDirection: message.senderName === userName ? 'row-reverse' : 'row',
                                alignItems: 'flex-end',
                            }}>
                                {/* 메시지 콘텐츠 */}
                                <div style={{
                                    padding: '10px',
                                    borderRadius: '10px',
                                    backgroundColor: message.senderName === userName ? '#DCF8C6' : '#FFF',
                                    border: '1px solid #ddd',
                                    maxWidth: '100%',
                                    wordWrap: 'break-word'
                                }}>
                                    {message.messageContent}
                                </div>
                                {/* 메시지 전송 시간 */}
                                <div style={{
                                    fontSize: '10px',
                                    color: '#666',
                                    marginLeft: message.senderName === userName ? '0' : '5px',
                                    marginRight: message.senderName === userName ? '5px' : '0',
                                    alignSelf: 'flex-end'
                                }}>
                                    {dayjs(message.sentAt).format('HH:mm')}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 메시지 입력 필드 */}
            <div style={{ display: 'flex', marginTop: '10px' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}  // 엔터 키로 메시지 전송
                    style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    placeholder="메시지 입력"
                />
            </div>
        </Rnd>
    );
};

export default ChatRoom;
