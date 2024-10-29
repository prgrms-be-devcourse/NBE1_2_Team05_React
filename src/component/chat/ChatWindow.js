// ChatWindow.js
import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { getChatRooms } from "../../api/chatApi";
import { FiMaximize, FiMinimize, FiX, FiSearch } from 'react-icons/fi';
import Button from '@mui/material/Button';
import ReactDOM from 'react-dom';
import ChatRoom from "./ChatRoom";

const ChatWindow = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [previousSize, setPreviousSize] = useState({ width: 500, height: 600, x: 0, y: 100 });
    const [chatRooms, setChatRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [openChatRooms, setOpenChatRooms] = useState([]);

    useEffect(() => {
        setPreviousSize(prevSize => ({
            ...prevSize,
            x: window.innerWidth - 520,
        }));
    }, []);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const toggleFullScreen = () => {
        if (isFullScreen) {
            setIsFullScreen(false);
        } else {
            setPreviousSize({ width: previousSize.width, height: previousSize.height, x: previousSize.x, y: previousSize.y });
            setIsFullScreen(true);
        }
    };

    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                const rooms = await getChatRooms();
                setChatRooms(rooms);
                setFilteredRooms(rooms);
            } catch (error) {
                console.error('Error fetching chat rooms', error);
            }
        };
        fetchChatRooms();
    }, []);

    useEffect(() => {
        const results = chatRooms.filter(room =>
            room.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredRooms(results);
    }, [searchTerm, chatRooms]);

    const handleRoomSelect = (roomId) => {
        setOpenChatRooms([...openChatRooms, roomId]);
    };

    const handleCloseChatRoom = (roomId) => {
        setOpenChatRooms(openChatRooms.filter(id => id !== roomId));
    };

    const renderChatWindowModal = () => (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 1000,
                pointerEvents: 'none' // 외부 클릭 허용
            }}
        >
            <Rnd
                default={{
                    width: 500,
                    height: 600,
                    x: previousSize.x,
                    y: previousSize.y,
                }}
                size={isFullScreen ? { width: '100vw', height: '100vh' } : { width: previousSize.width, height: previousSize.height }}
                position={isFullScreen ? { x: 0, y: 0 } : { x: previousSize.x, y: previousSize.y }}
                minWidth={400}
                minHeight={500}
                bounds="window"
                style={{
                    border: '1px solid black',
                    padding: '20px',
                    backgroundColor: 'white',
                    color: 'black',
                    zIndex: 1001,
                    position: 'relative',
                    borderRadius: '8px',
                    pointerEvents: 'auto' // 모달 내부 클릭 허용
                }}
                onDragStop={(e, d) => setPreviousSize({ ...previousSize, x: d.x, y: d.y })}
                onResizeStop={(e, direction, ref, delta, position) => {
                    setPreviousSize({
                        width: ref.offsetWidth,
                        height: ref.offsetHeight,
                        ...position,
                    });
                }}
                disableDragging={isFullScreen}
            >
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                }}>
                    <button
                        onClick={toggleFullScreen}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '20px',
                            cursor: 'pointer',
                            color: 'grey',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        {isFullScreen ? <FiMinimize /> : <FiMaximize />}
                    </button>
                    <button
                        onClick={closeModal}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '20px',
                            cursor: 'pointer',
                            color: 'grey',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <FiX />
                    </button>
                </div>

                <h2 style={{ color: 'black', textAlign: 'center', margin: 0 }}>Chat</h2>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    padding: '8px',
                    marginBottom: '10px',
                }}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="채팅방 이름 검색"
                        style={{
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                        }}
                    />
                    <FiSearch style={{ color: '#666', fontSize: '20px', marginLeft: '5px' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        maxHeight: `${previousSize.height - 150}px`,
                        marginBottom: '10px'
                    }}>
                        <h3>채팅방 목록</h3>
                        <ul style={{ listStyleType: 'none', padding: 0 }}>
                            {filteredRooms.map((room) => (
                                <li
                                    key={room.chatRoomId}
                                    onClick={() => handleRoomSelect(room.chatRoomId)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        borderBottom: '1px solid #ddd',
                                        padding: '10px 0',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                                >
                                    <div style={{ flex: '0 0 60px', marginRight: '10px' }}>
                                        <img
                                            src={room.imageUrl}
                                            alt={room.title}
                                            style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div style={{ flexGrow: 1 }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{room.title}</div>
                                        <div style={{ color: '#666' }}>{room.lastMessage}</div>
                                    </div>
                                    <div style={{ flex: '0 0 80px', textAlign: 'right', marginRight: '30px' }}>
                                        <div>{room.timeAgo}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Rnd>
        </div>
    );

    return (
        <div>
            <Button
                sx={{ color: 'black', '&:hover': { backgroundColor: '#E0E0E0', color: '#00008B' } }}
                onClick={openModal}
            >
                나의 채팅
            </Button>
            {isOpen && ReactDOM.createPortal(renderChatWindowModal(), document.body)}
            {openChatRooms.map((roomId) =>
                ReactDOM.createPortal(
                    <ChatRoom
                        key={roomId}
                        chatRoomId={roomId}
                        closeRoom={() => handleCloseChatRoom(roomId)}
                    />,
                    document.body
                )
            )}
        </div>
    );
};

export default ChatWindow;
