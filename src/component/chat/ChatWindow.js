// ChatWindow.js
import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { getChatRooms } from "../../api/chatApi";
import { FiMaximize, FiMinimize, FiX, FiSearch } from 'react-icons/fi';
import Button from '@mui/material/Button';
import ReactDOM from 'react-dom';
import ChatRoom from "./ChatRoom";
import { connectChatListSocket, disconnectChatListSocket } from './ChatSocket';

// 탭 이름과 아이콘을 상수로 정의
const TABS = {
    REQUEST: { name: '합류', icon: '👥' },
    RESPONSE: { name: '모집', icon: '📢' },
};

const ChatWindow = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [previousSize, setPreviousSize] = useState({ width: 500, height: 600, x: 0, y: 100 });
    const [chatRooms, setChatRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState(TABS.REQUEST); // 초기 탭 설정
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

    const fetchChatRooms = async () => {
        try {
            setChatRooms([]); // 이전 목록 초기화
            const rooms = await getChatRooms(activeTab === TABS.RESPONSE); // RESPONSE 탭이면 isManager=true
            setChatRooms(rooms);
            setFilteredRooms(rooms);
        } catch (error) {
            console.error('Error fetching chat rooms', error);
        }
    };

    useEffect(() => {
        fetchChatRooms();
    }, [activeTab]);

    useEffect(() => {
        const handleSocketMessage = (updatedRoom) => {
            setChatRooms(prevRooms =>
                prevRooms.map(room =>
                    room.chatRoomId === updatedRoom.chatRoomId
                        ? { ...room, lastMessage: updatedRoom.lastMessage, timeAgo: updatedRoom.timeAgo, unreadCount: updatedRoom.unreadCount }
                        : room
                )
            );
        };

        connectChatListSocket(handleSocketMessage);

        return () => disconnectChatListSocket();
    }, [activeTab]);

    useEffect(() => {
        const results = chatRooms.filter(room =>
            room.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredRooms(results);
    }, [searchTerm, chatRooms]);

    const handleRoomSelect = (roomId) => {
        // 이미 열린 채팅방인지 확인
        const isRoomAlreadyOpen = openChatRooms.some(room => room.chatRoomId === roomId);

        // 이미 열려 있지 않은 경우에만 채팅방을 추가
        if (!isRoomAlreadyOpen) {
            const selectedRoom = chatRooms.find(room => room.chatRoomId === roomId);
            if (selectedRoom) {
                setOpenChatRooms([...openChatRooms, selectedRoom]);
            }
        }
    };

    const handleCloseChatRoom = (roomId) => {
        setOpenChatRooms(openChatRooms.filter(room => room.chatRoomId !== roomId));
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
                pointerEvents: 'none'
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
                    pointerEvents: 'auto',
                    overflow: 'hidden' // 내부 콘텐츠가 벗어나지 않도록 제한
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

                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    gap: '10px',
                    marginBottom: '10px'
                }}>
                    <Button
                        variant="outlined"
                        onClick={() => setActiveTab(TABS.REQUEST)}
                        color={activeTab === TABS.REQUEST ? "primary" : "default"}
                    >
                        {TABS.REQUEST.icon} {TABS.REQUEST.name}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => setActiveTab(TABS.RESPONSE)}
                        color={activeTab === TABS.RESPONSE ? "primary" : "default"}
                    >
                        {TABS.RESPONSE.icon} {TABS.RESPONSE.name}
                    </Button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        marginBottom: '20px', // 하단 마진 추가
                        paddingRight: '10px', // 스크롤바와 콘텐츠 사이의 여백 추가
                        scrollbarWidth: 'thin' // 스크롤바 두께 조정 (Firefox)
                    }}>
                        <div style={{ padding: '0 10px' }}> {/* 제목을 스크롤 영역 안으로 이동 */ }
                            <h3 style={{ margin: 0 }}>{activeTab.name} 채팅방 목록</h3>
                        </div>
                        <ul style={{
                            listStyleType: 'none',
                            padding: 0,
                            margin: 0,
                            overflowY: 'auto'
                        }}>
                            {filteredRooms.map((room) => (
                                <li
                                    key={room.chatRoomId}
                                    onClick={() => handleRoomSelect(room.chatRoomId)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        justifyContent: 'space-between',
                                        borderBottom: '1px solid #ddd',
                                        padding: '10px 0',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s',
                                        width: '100%' // 리스트 아이템 너비 설정
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
                                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '5px', alignSelf: 'flex-start' }}>
                                            {room.title}
                                        </div>
                                        <div style={{ color: '#666', alignSelf: 'flex-start' }}>
                                            {room.lastMessage}
                                        </div>
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
            {openChatRooms.map(({ chatRoomId, title, imageUrl }) =>
                ReactDOM.createPortal(
                    <ChatRoom
                        key={chatRoomId}
                        chatRoomId={chatRoomId}
                        performanceTitle={title}
                        performanceImageUrl={imageUrl}
                        closeRoom={() => handleCloseChatRoom(chatRoomId)}
                    />,
                    document.body
                )
            )}
        </div>
    );
};

export default ChatWindow;
