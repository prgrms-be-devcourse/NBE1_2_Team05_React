// ChatRoom.js
import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { getMessages, sendMessage } from "../../api/chatApi";
import { FiX } from 'react-icons/fi';

const ChatRoom = ({ chatRoomId, closeRoom }) => {
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
            setMessages([...messages, { content: newMessage, sender: 'me' }]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message', error);
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
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #ddd',
                paddingBottom: '10px',
            }}>
                <h3>Chat Room {chatRoomId}</h3>
                <div>
                    <button
                        onClick={toggleFullScreen}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '20px',
                            cursor: 'pointer',
                            color: 'grey',
                        }}
                    >
                        {isFullScreen ? '↙️' : '↔️'}
                    </button>
                    <button
                        onClick={closeRoom}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '20px',
                            cursor: 'pointer',
                            color: 'grey',
                            marginLeft: '10px',
                        }}
                    >
                        <FiX />
                    </button>
                </div>
            </div>

            {/* 채팅 메시지 목록 */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                maxHeight: `${windowSize.height - 150}px`,
                padding: '10px',
                border: '1px solid #ddd',
                marginTop: '10px',
            }}>
                {messages.map((message, index) => (
                    <div key={index} style={{ textAlign: message.sender === 'me' ? 'right' : 'left' }}>
                        <div style={{
                            display: 'inline-block',
                            padding: '10px',
                            marginBottom: '5px',
                            borderRadius: '10px',
                            backgroundColor: message.sender === 'me' ? '#DCF8C6' : '#FFF',
                            border: '1px solid #ddd'
                        }}>
                            {message.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* 메시지 입력 필드와 전송 버튼 */}
            <div style={{ display: 'flex', marginTop: '10px' }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
                <button
                    onClick={handleSendMessage}
                    style={{
                        marginLeft: '10px',
                        padding: '10px',
                        backgroundColor: '#007BFF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    전송
                </button>
            </div>
        </Rnd>
    );
};

export default ChatRoom;
