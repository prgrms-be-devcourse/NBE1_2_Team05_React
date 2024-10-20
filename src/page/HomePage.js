import React, { useEffect, useState, useRef } from 'react';
import PerformanceCard from '../component/performance/PerformanceCard';
import { CircularProgress } from '@mui/material';
import { fetchData, fetchFavoritePerformances } from '../api/performanceApi';
import './HomePage.css';
import { useAuth } from "../context/AuthContext";
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [performances, setPerformances] = useState([]); // 전체 공연 데이터 상태
    const [favoritePerformances, setFavoritePerformances] = useState([]); // 선호 공연 데이터 상태
    const [loadingPerformances, setLoadingPerformances] = useState(true); // 전체 공연 로딩 상태
    const [loadingFavorites, setLoadingFavorites] = useState(true); // 선호 공연 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const { userName, isLoggedIn } = useAuth();  // 사용자 로그인 정보
    const navigate = useNavigate();

    // 각 스크롤 섹션을 위한 ref와 상태 관리
    const recommendRowRef = useRef(null);
    const [canScrollLeftRecommend, setCanScrollLeftRecommend] = useState(false);
    const [canScrollRightRecommend, setCanScrollRightRecommend] = useState(false);

    const popularRowRef = useRef(null);
    const [canScrollLeftPopular, setCanScrollLeftPopular] = useState(false);
    const [canScrollRightPopular, setCanScrollRightPopular] = useState(false);

    const allPerformancesRowRef = useRef(null);
    const [canScrollLeftAllPerformances, setCanScrollLeftAllPerformances] = useState(false);
    const [canScrollRightAllPerformances, setCanScrollRightAllPerformances] = useState(false);

    // 스크롤 상태 업데이트 함수
    const updateScrollState = (ref, setCanScrollLeft, setCanScrollRight) => {
        const element = ref.current;
        if (element) {
            setCanScrollLeft(element.scrollLeft > 0);
            setCanScrollRight(element.scrollLeft + element.clientWidth < element.scrollWidth);
        }
    };

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

    useEffect(() => {
        loadPerformances();
        if (isLoggedIn) {
            loadFavoritePerformances();
        }
    }, [isLoggedIn]);

    // 스크롤 상태 업데이트
    useEffect(() => {
        if (recommendRowRef.current) updateScrollState(recommendRowRef, setCanScrollLeftRecommend, setCanScrollRightRecommend);
        if (popularRowRef.current) updateScrollState(popularRowRef, setCanScrollLeftPopular, setCanScrollRightPopular);
        if (allPerformancesRowRef.current) updateScrollState(allPerformancesRowRef, setCanScrollLeftAllPerformances, setCanScrollRightAllPerformances);
    }, [performances]);

    // 로딩 중일 때 로딩 스피너 표시
    if (loadingPerformances || (isLoggedIn && loadingFavorites)) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    }

    // 에러가 있을 경우 에러 메시지 표시
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
                        {canScrollLeftRecommend && <ArrowBackIos className="scroll-arrow left" />}
                        <div className="scrollable-row" ref={recommendRowRef}>
                            {favoritePerformances.map((performance) => (
                                <PerformanceCard key={performance.performanceId} {...performance} />
                            ))}
                        </div>
                        {canScrollRightRecommend && <ArrowForwardIos className="scroll-arrow right" />}
                    </div>
                </div>
            )}

            {/* 인기 공연 섹션 */}
            <div className="section">
                <h2>실시간 인기 공연🏆</h2>
                <div className="scrollable-row-container">
                    {canScrollLeftPopular && <ArrowBackIos className="scroll-arrow left" />}
                    <div className="scrollable-row" ref={popularRowRef}>
                        {performances.map((performance, index) => (
                            <div className="performance-with-ranking" key={performance.performanceId}>
                                <span className="ranking">{index + 1}</span>
                                <PerformanceCard {...performance} />
                            </div>
                        ))}
                    </div>
                    {canScrollRightPopular && <ArrowForwardIos className="scroll-arrow right" />}
                </div>
            </div>

            {/* 모든 공연 섹션 */}
            <div className="section">
                <div className="section-header">
                    <h2>모든 공연 🎉</h2>
                    <div className="view-all-button" onClick={() => navigate("/all")}>
                        전체보기&nbsp;&nbsp;&nbsp;〉
                    </div>
                </div>
                <div className="scrollable-row-container">
                    {canScrollLeftAllPerformances && <ArrowBackIos className="scroll-arrow left" />}
                    <div className="scrollable-row" ref={allPerformancesRowRef}>
                        {performances.map((performance) => (
                            <PerformanceCard key={performance.performanceId} {...performance} />
                        ))}
                    </div>
                    {canScrollRightAllPerformances && <ArrowForwardIos className="scroll-arrow right" />}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
