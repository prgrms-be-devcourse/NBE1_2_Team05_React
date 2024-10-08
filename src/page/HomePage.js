// 홈페이지 메인 화면
import React, {useEffect, useState} from 'react';
import PerformanceCard from '../component/performance/PerformanceCard';
import { Pagination, TextField, Button } from '@mui/material';
import { Box } from '@mui/system';
import { fetchCategories, fetchData } from '../api/performanceApi'; // API 함수 임포트
import './HomePage.css';
import { Link } from 'react-router-dom'; // Link 임포트

const HomePage = () => {
    const [page, setPage] = useState(1);
    const itemsPerPage = 16; // 페이지당 아이템 수
    const [totalItems, setTotalItems] = useState(0); // 총 아이템 수 (예시로 100개)

    const [data, setData] = useState([]); // 데이터를 저장할 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const [tmpSearchTerm, setTmpSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 카테고리 상태
    const [categories, setCategories] = useState([]); // 카테고리 리스트 상태

    // 카테고리 데이터 조회
    const loadCategories = async () => {
        try {
            const categoriesData = await fetchCategories();
            console.log(categoriesData)
            setCategories([{ categoryId: null, nameKr: '전체' }, ...categoriesData]);
        } catch (err) {
            setError(err.message);
        }
    };

    // 전체 데이터 조회
    const loadData = async () => {
        setLoading(true);
        try {
            const { totalElements, performances } = await fetchData(page, selectedCategory, searchTerm);
            console.log(totalElements);
            console.log(performances);

            if (performances && Array.isArray(performances)) {
                const performanceData = performances.map(item => ({
                    performanceId: item.performanceId,
                    memberName: item.memberName,
                    imageUrl: item.imageUrl,
                    title: item.title,
                    startDateTime: item.dateStartTime,
                    endDateTime: item.dateEndTime
                }));
    
                setTotalItems(totalElements);
                setData(performanceData);
            } else {
                setData([])
                setError('Performances is not an array or is undefined');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    // 컴포넌트가 마운트될 때 카테고리 데이터 조회
    useEffect(() => {
        loadCategories(); // 카테고리 데이터 가져오기
    }, []);

    // 페이지, 카테고리, 검색어 변경 시 데이터 로드
    useEffect(() => {
        loadData(); // 초기 데이터 가져오기
    }, [page, selectedCategory, searchTerm]); // 페이지가 변경될 때마다 호출

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

    const handleSearchChange = (event) => {
        setTmpSearchTerm(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            setSearchTerm(tmpSearchTerm);
            setPage(1);
        }
    };

    // 카테고리 버튼 클릭 시 데이터 가져오기
    const handleCategoryClick = (categoryId) => {
        console.log(selectedCategory);
        console.log(categoryId);
        if (categoryId == 0 || selectedCategory == categoryId) {
            setSelectedCategory(null); // 선택된 카테고리 상태 업데이트
        }
        else {
            setSelectedCategory(categoryId); // 선택된 카테고리 상태 업데이트
        }
        setPage(1);
    };

    // 공연 데이터를 불러와서 렌더링
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style = {{marginLeft: '100px', marginRight: '100px'}}>
                <h1>공연 목록</h1>
                <TextField
                    label="검색어를 입력하세요"
                    variant="outlined"
                    value={tmpSearchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyPress} // 엔터 키 이벤트 처리
                    fullWidth
                    style={{ marginBottom: '10px', width: '100%' }} // 입력 필드 아래 여백
                />

                <div className="category-performance-write">
                    <div className='category'>
                        {/* 동적으로 카테고리 버튼 생성 */}
                        {categories.map((category) => (
                            <Button
                                key={category.categoryId} // 고유한 키 사용
                                variant="contained"
                                color={selectedCategory === category.categoryId ? "secondary" : "primary"} // 선택된 카테고리 색상 변경
                                style={{ marginRight: '10px' }}
                                onClick={() => handleCategoryClick(category.categoryId)} // 카테고리 클릭 시 함수 호출
                            >
                                {category.nameKr} {/* 카테고리 이름 */}
                            </Button>
                        ))}
                    </div>
                    <div className='performance-write' style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                        <Link to="/performance/register">
                            <Button variant="contained" color="secondary">
                                공연 추가
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="performance-list">
                    {data.map((performance) => (
                        <PerformanceCard
                            key={performance.performanceId}
                            {...performance}
                            className="performance-card" // 클래스 추가
                            />
                    ))}
                </div>
                <div className="page">
                    <Box display="flex" justifyContent="center" my={2} style={{ marginTop: 'auto'}}>
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
        </div>
    );
};

export default HomePage;
