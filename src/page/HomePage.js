import React, { useEffect, useState } from 'react';
import PerformanceCard from '../component/performance/PerformanceCard';
import { CircularProgress } from '@mui/material';
import {
    fetchData,
    fetchFavoritePerformances,
    fetchPopularPerformances, // 인기 공연 데이터를 가져오는 API 함수
} from '../api/performanceApi';
import './HomePage.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { useDraggable } from '../hook/useDraggable';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            Social Culture {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const HomePage = () => {
    const [performances, setPerformances] = useState([]);
    const [favoritePerformances, setFavoritePerformances] = useState([]);
    const [popularPerformances, setPopularPerformances] = useState([]); // 인기 공연 상태 추가
    const [loadingPerformances, setLoadingPerformances] = useState(true);
    const [loadingFavorites, setLoadingFavorites] = useState(true);
    const [loadingPopular, setLoadingPopular] = useState(true); // 인기 공연 로딩 상태 추가
    const [error, setError] = useState(null);
    const { userName, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    // 드래그 훅 사용
    const recommendScroll = useDraggable();
    const popularScroll = useDraggable();
    const allPerformancesScroll = useDraggable();

    // 전체 공연 데이터 로드
    const loadPerformances = async () => {
        setLoadingPerformances(true);
        try {
            const { performances: fetchedPerformances } = await fetchData(1, null, '');
            if (fetchedPerformances && Array.isArray(fetchedPerformances)) {
                const processedPerformances = fetchedPerformances.map((item) => ({
                    performanceId: item.performanceId,
                    memberName: item.memberName,
                    imageUrl: item.imageUrl,
                    title: item.title,
                    startDateTime: item.dateStartTime,
                    endDateTime: item.dateEndTime,
                    price: item.price,
                    address: item.address,
                    remainingTicket: item.remainingTicket,
                }));
                setPerformances(processedPerformances);
            } else {
                setPerformances([]);
                setError('No performances found or data is invalid');
            }
        } catch (err) {
            setError('Error fetching performances: ' + err.message);
        } finally {
            setLoadingPerformances(false);
        }
    };

    // 선호 공연 데이터 로드 (로그인된 사용자일 때만)
    const loadFavoritePerformances = async () => {
        setLoadingFavorites(true);
        try {
            const { performances: fetchedFavorites } = await fetchFavoritePerformances();
            if (fetchedFavorites && Array.isArray(fetchedFavorites)) {
                const processedFavorites = fetchedFavorites.map((item) => ({
                    performanceId: item.performanceId,
                    memberName: item.memberName,
                    imageUrl: item.imageUrl,
                    title: item.title,
                    startDateTime: item.dateStartTime,
                    endDateTime: item.dateEndTime,
                    price: item.price,
                    address: item.address,
                    remainingTicket: item.remainingTicket,
                }));
                setFavoritePerformances(processedFavorites);
            } else {
                setFavoritePerformances([]);
                setError('No favorite performances found or data is invalid');
            }
        } catch (err) {
            setError('Error fetching favorite performances: ' + err.message);
        } finally {
            setLoadingFavorites(false);
        }
    };

    // 인기 공연 데이터 로드
    const loadPopularPerformances = async () => {
        setLoadingPopular(true);
        try {
            const { performances: fetchedPopular } = await fetchPopularPerformances();
            if (fetchedPopular && Array.isArray(fetchedPopular)) {
                const processedPopular = fetchedPopular.map((item) => ({
                    performanceId: item.performanceId,
                    memberName: item.memberName,
                    imageUrl: item.imageUrl,
                    title: item.title,
                    startDateTime: item.dateStartTime,
                    endDateTime: item.dateEndTime,
                    price: item.price,
                    address: item.address,
                    remainingTicket: item.remainingTicket,
                }));
                setPopularPerformances(processedPopular);
            } else {
                setPopularPerformances([]);
                setError('No popular performances found or data is invalid');
            }
        } catch (err) {
            setError('Error fetching popular performances: ' + err.message);
        } finally {
            setLoadingPopular(false);
        }
    };

    useEffect(() => {
        loadPerformances();
        loadPopularPerformances(); // 인기 공연 데이터 로드 호출
        if (isLoggedIn) {
            loadFavoritePerformances();
        }
    }, [isLoggedIn]);

    if (loadingPerformances || loadingPopular || (isLoggedIn && loadingFavorites)) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="custom-page">
            {/* 추천 공연 섹션 (로그인된 사용자에게만 표시) */}
            {isLoggedIn && favoritePerformances.length > 0 && (
                <div className="section" style={{ marginTop: '40px' }}>
                    <h2>{userName}님을 위해 준비했어요😉</h2>
                    <div className="scrollable-row-container">
                        <div
                            className="scrollable-row"
                            ref={recommendScroll.ref}
                            onMouseDown={recommendScroll.onMouseDown}
                            onMouseMove={recommendScroll.onMouseMove}
                            onMouseUp={recommendScroll.onMouseUp}
                            onMouseLeave={recommendScroll.onMouseLeave}
                            onClick={recommendScroll.onClick}
                            onDragStart={(e) => e.preventDefault()}
                            style={{ cursor: recommendScroll.isDragging ? 'grabbing' : 'grab' }}
                        >
                            {favoritePerformances.map((performance) => (
                                <PerformanceCard
                                    key={performance.performanceId}
                                    {...performance}
                                    onClick={recommendScroll.onClick}
                                    isDragging={recommendScroll.isDragging}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 인기 공연 섹션 */}
            <div className="section">
                <h2>실시간 인기 공연🏆</h2>
                <div className="scrollable-row-container">
                    <div
                        className="scrollable-row"
                        ref={popularScroll.ref}
                        onMouseDown={popularScroll.onMouseDown}
                        onMouseMove={popularScroll.onMouseMove}
                        onMouseUp={popularScroll.onMouseUp}
                        onMouseLeave={popularScroll.onMouseLeave}
                        onClick={popularScroll.onClick}
                        onDragStart={(e) => e.preventDefault()}
                        style={{ cursor: popularScroll.isDragging ? 'grabbing' : 'grab' }}
                    >
                        {popularPerformances.map((performance, index) => (
                            <div
                                className="performance-with-ranking"
                                key={performance.performanceId}
                            >
                                <span className="ranking">{index + 1}</span>
                                <PerformanceCard
                                    {...performance}
                                    onClick={popularScroll.onClick}
                                    isDragging={popularScroll.isDragging}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 모든 공연 섹션 */}
            <div className="section">
                <div className="section-header">
                    <h2>모든 공연 🎉</h2>
                    <div className="view-all-button" onClick={() => navigate('/all')}>
                        전체보기&nbsp;&nbsp;&nbsp;〉
                    </div>
                </div>
                <div className="scrollable-row-container">
                    <div
                        className="scrollable-row"
                        ref={allPerformancesScroll.ref}
                        onMouseDown={allPerformancesScroll.onMouseDown}
                        onMouseMove={allPerformancesScroll.onMouseMove}
                        onMouseUp={allPerformancesScroll.onMouseUp}
                        onMouseLeave={allPerformancesScroll.onMouseLeave}
                        onClick={allPerformancesScroll.onClick}
                        onDragStart={(e) => e.preventDefault()}
                        style={{ cursor: allPerformancesScroll.isDragging ? 'grabbing' : 'grab' }}
                    >
                        {performances.map((performance) => (
                            <PerformanceCard
                                key={performance.performanceId}
                                {...performance}
                                onClick={allPerformancesScroll.onClick}
                                isDragging={allPerformancesScroll.isDragging}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </div>
    );
};

export default HomePage;
