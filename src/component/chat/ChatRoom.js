import React, { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { getMessages } from "../../api/chatApi";
import { connectChatSocket, disconnectChatSocket, sendChatMessage } from './ChatSocket'; // ChatSocket에서 함수들 임포트
import { FiX } from 'react-icons/fi';
import { useAuth } from "../../context/AuthContext"; // AuthContext import

const DEFAULT_USER_IMAGE = "https://via.placeholder.com/30";

const ChatRoom = ({ chatRoomId, performanceTitle, performanceImageUrl, closeRoom }) => {
    const { userName, userEmail } = useAuth(); // 현재 로그인한 사용자 이름과 이메일 가져오기
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 400, height: 500, x: 100, y: 100 });

    // 스크롤을 최신 메시지로 이동시키기 위한 참조
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // 채팅방의 기존 메시지를 가져옴
        const fetchMessages = async () => {
            try {
                const roomMessages = await getMessages(chatRoomId);
                setMessages(roomMessages);
            } catch (error) {
                console.error('Error fetching messages', error);
            }
        };
        fetchMessages();

        // WebSocket 연결
        connectChatSocket(chatRoomId, (receivedMessage) => {
            setMessages(prevMessages => [...prevMessages, receivedMessage]);
        });

        // 컴포넌트 언마운트 시 WebSocket 연결 해제
        return () => {
            disconnectChatSocket(); // 채팅방을 떠날 때만 해제
        };
    }, [chatRoomId]);

    useEffect(() => {
        // 메시지가 추가될 때마다 스크롤을 최신 메시지로 이동
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const messageData = {
            senderName: userName,
            message: newMessage
        };

        // WebSocket을 통해 메시지 전송
        sendChatMessage(messageData);
        // setMessages([...messages, { senderName: userName, messageContent: newMessage, formattedSentTime: new Date().toLocaleString() }]);
        setNewMessage(''); // 입력창 초기화
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

    const handleCloseRoom = () => {
        disconnectChatSocket(); // 채팅방을 나갈 때만 소켓 연결 해제
        closeRoom(); // 부모 컴포넌트로부터 받은 방 닫기 함수 호출
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
                backgroundColor: 'white',
                color: 'black',
                zIndex: 1001,
                position: 'fixed',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* 상단 공연 정보 표시 */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid #ddd',
                paddingBottom: '10px',
                paddingTop: '10px',
                paddingLeft: '10px',
                paddingRight: '10px',
            }}>
                <img
                    src={performanceImageUrl}
                    alt={performanceTitle}
                    style={{ width: '50px', height: '50px', borderRadius: '8px', marginRight: '10px' }}
                />
                <h3 style={{ margin: 0 }}>{performanceTitle}</h3>
                <button
                    onClick={handleCloseRoom} // 방 닫기 함수로 변경
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
                padding: '10px',
                borderBottom: '1px solid #ddd',
            }}>
                {messages.map((message, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        justifyContent: message.senderName === userName ? 'flex-end' : 'flex-start',
                        alignItems: 'flex-end',
                        marginBottom: '10px',
                    }}>
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
                                <div style={{
                                    fontSize: '10px',
                                    color: '#666',
                                    marginLeft: message.senderName === userName ? '0' : '5px',
                                    marginRight: message.senderName === userName ? '5px' : '0',
                                    alignSelf: 'flex-end'
                                }}>
                                    {message.formattedSentTime}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {/* 스크롤 위치 조정을 위한 더미 div */}
                <div ref={messagesEndRef} />
            </div>

            {/* 메시지 입력 필드 */}
            <div style={{
                display: 'flex',
                padding: '10px',
                borderTop: '1px solid #ddd',
            }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                        flex: 1,
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                    }}
                    placeholder="메시지 입력"
                />
            </div>
        </Rnd>
    );
};

export default ChatRoom;
