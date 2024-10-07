// 홈페이지 메인 화면
import { useEffect } from 'react';
import React, {useState} from 'react';
import PerformanceCard from '../component/performance/PerformanceCard';
import { Pagination } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';

const HomePage = () => {
    const [page, setPage] = useState(1);
    const itemsPerPage = 10; // 페이지당 아이템 수
    const totalItems = 100; // 총 아이템 수 (예시로 100개)

    const [data, setData] = useState([]); // 데이터를 저장할 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    useEffect(() => {
        // 데이터 가져오기
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/performances', {
                    params: {
                        size : 5,
                        page : 0
                    }
                }); // API URL
                //setData(response.data.result); // 데이터를 상태에 저장
                const extractedData = response.data.result.map(item => ({
                    memberName: item.memberName,     // 필요한 필드
                    imageUrl : item.imageUrl,
                    title: item.title,
                    startDate : item.dateStartTime,
                    endDate : item.dateEndTime
                }));
                setData(extractedData); // 데이터를 상태에 저장
                console.log(extractedData);
                
            } catch (err) {
                setError(err.message); // 에러 메시지 저장
            } finally {
                setLoading(false); // 로딩 완료
            }
        };

        fetchData();
    }, [page]); // 컴포넌트가 마운트될 때 한 번 실행

    // 로딩 상태 처리
    if (loading) {
        return <div>Loading...</div>;
    }

    // 에러 상태 처리
    if (error) {
        return <div>Error: {error}</div>;
    }

    // 데이터가 없을 경우 처리
    if (!data) {
        return <div>No data available</div>;
    }

    const handleChange = (event, value) => {
        setPage(value);
        // 여기서 선택된 페이지에 따라 데이터를 불러오는 로직 추가
    };

    // 공연 데이터를 불러와서 렌더링
    return (
        <div>
            <h1>공연 목록</h1>
            <div className="performance-list">
                {data.map((performance, index) => (
                    <PerformanceCard
                        key={index}
                        {...performance} />
                ))}
                

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
        </div>
    );
};

export default HomePage;
