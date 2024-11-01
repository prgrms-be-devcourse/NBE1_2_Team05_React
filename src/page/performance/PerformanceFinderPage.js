import React, { useState, useEffect, useRef } from 'react';
import { Pagination, CircularProgress, Button } from '@mui/material'; // CircularProgress 추가
import { Box } from '@mui/system';
import KakaoMapFinder from "../../component/performance/KakaoMapFinder";
import PerformanceCard from '../../component/performance/PerformanceCard';
import { fetchPerformancesAroundPoint } from '../../api/performanceApi'; // API 함수 임포트
import { useDraggable } from '../../hook/useDraggable';

const PerformanceFinderPage = () => {
    const [coordinates, setCoordinates] = useState([]); // 클릭한 좌표를 저장할 상태
    const [performances, setPerformances] = useState([]); // 공연 정보를 저장할 상태
    const [loadingFavorites, setLoadingFavorites] = useState(false);
    const [errorFavorites, setErrorFavorites] = useState(null);
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;
    const [totalItems, setTotalItems] = useState(0);
    const scroll = useDraggable();
    const initialRef = useRef(true);

    const handleCoordinatesChange = (newCoords) => {
        console.log('hihihi', newCoords)
        setCoordinates(() => [newCoords]);
    };

    const handleChange = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        const fetchInitialPerformances = async () => {
            console.log('debug1');
            console.log(initialRef);
            console.log(coordinates.length);
            if (coordinates.length > 0 && initialRef.current == true) {
                console.log('debug2');
                const response = await handleSubmit(); // 좌표가 있을 경우에만 데이터 요청
                if (response != -1) {
                    initialRef.current = false;
                }
            }
        };
        
        fetchInitialPerformances();
    }, [coordinates]);

    // 페이지가 변경될 때마다 handleSubmit 호출
    useEffect(() => {
        handleSubmit();
    }, [page]); // 좌표도 의존성에 추가

    const handleSubmit = async () => {
        setLoadingFavorites(true);
        // 좌표 전송 처리 (예: API 요청)
        if (coordinates.length === 0) {
            console.error('좌표가 없습니다.');
            return -1;
        }

        const { lat, lng } = coordinates[0];

        try {
            const { totalElements, performances } = await fetchPerformancesAroundPoint(page, lat, lng);
            console.log(performances);

            if (Array.isArray(performances)) {
                const processedPerformances = performances.map((item) => ({
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
                setTotalItems(totalElements);

            } else {
                setPerformances([]);
                setErrorFavorites('추천 공연을 찾을 수 없습니다.');
            }
            return 0;
        } catch (err) {
            setErrorFavorites('추천 공연을 불러오는 데 실패했습니다: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoadingFavorites(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '1300px', alignItems: 'center' }}>
                <h1 style={{ flex: 1, textAlign: 'center' }}>공연 정보 및 지도</h1>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                        근처 공연 보기
                </Button>
            </div>
            <KakaoMapFinder onCoordinatesChange={handleCoordinatesChange} performances={performances} />
            <div className="section" style={{ marginTop: '40px' }}>
                <div className="scrollable-row-container">
                    {loadingFavorites ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            <CircularProgress />
                        </div>
                    ) : errorFavorites ? (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            {errorFavorites}
                        </div>
                    ) : performances.length > 0 ? (
                        <div
                            className="scrollable-row"
                            ref={scroll.ref}
                            onMouseDown={scroll.onMouseDown}
                            onMouseMove={scroll.onMouseMove}
                            onMouseUp={scroll.onMouseUp}
                            onMouseLeave={scroll.onMouseLeave}
                            onClick={scroll.onClick}
                            onDragStart={(e) => e.preventDefault()}
                            style={{ cursor: scroll.isDragging ? 'grabbing' : 'grab' }}
                        >
                            {performances.map((performance) => (
                                <PerformanceCard
                                    key={performance.performanceId}
                                    {...performance}
                                    onClick={scroll.onClick}
                                    isDragging={scroll.isDragging}
                                />
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            "추천 공연이 없습니다."
                        </div>
                    )}
                </div>
            </div>
            {/* 페이지네이션 */}
            <Box display="flex" justifyContent="center" my={2}>
                <Pagination
                    count={Math.ceil(totalItems / itemsPerPage)}
                    page={page}
                    onChange={handleChange}
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                />
            </Box>
        </div>
    );
};

export default PerformanceFinderPage;
