// 홈페이지 메인 화면
import { useEffect } from 'react';
import React, {useState} from 'react';
import PerformanceCard from '../component/performance/PerformanceCard';
import { Pagination, TextField, Button } from '@mui/material';
import { Box } from '@mui/system';
import axios from 'axios';
import './HomePage.css';
import { Link } from 'react-router-dom'; // Link 임포트

const HomePage = () => {
    const [page, setPage] = useState(1);
    const itemsPerPage = 21; // 페이지당 아이템 수
    const totalItems = 100; // 총 아이템 수 (예시로 100개)

    const [data, setData] = useState([]); // 데이터를 저장할 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
    const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 카테고리 상태
    const [categories, setCategories] = useState([]); // 카테고리 리스트 상태

    // 카테고리 데이터 조회
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/members/categories'); // 카테고리 API 호출
            const extractedData = response.data.result.map(item => ({
                categoryId: item.categoryId,
                nameKr: item.nameKr,
                nameEn: item.nameEn,
            }));
            console.log(extractedData);
            setCategories([{ categoryId: null, nameKr: '전체' }, ...extractedData]); // 카테고리 리스트 상태에 저장

        } catch (err) {
            setError(err.message); // 에러 메시지 저장
        }
    };

    // 전체 데이터 조회
    const fetchData = async (pageNum = 1, category = null, search = '') => {
        setLoading(true);
        console.log(search);
        console.log(category);
        try {
            const response = await axios.get('http://localhost:8080/api/v1/performances', {
                params: {
                    size: itemsPerPage,
                    page: pageNum - 1,
                    category: category,
                    search: search, // 검색어 추가
                }
            });
            const extractedData = response.data.result.map(item => ({
                memberName: item.memberName,
                imageUrl: item.imageUrl,
                title: item.title,
                startDate: item.dateStartTime,
                endDate: item.dateEndTime
            }));
            console.log(extractedData);
            setData(extractedData); // 데이터를 상태에 저장
        } catch (err) {
            setError(err.message); // 에러 메시지 저장
        } finally {
            setLoading(false); // 로딩 완료
        }
    };

    // 컴포넌트가 마운트될 때 전체 데이터 조회
    useEffect(() => {
        fetchCategories(); // 카테고리 데이터 가져오기
        fetchData(page); // 초기 데이터 가져오기
    }, [page]); // 페이지가 변경될 때마다 호출

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
        setSearchTerm(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            fetchData(1, selectedCategory, searchTerm); // 엔터 키가 눌리면 검색어로 데이터 가져오기
        }
    };

    // 카테고리 버튼 클릭 시 데이터 가져오기
    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId); // 선택된 카테고리 상태 업데이트
        // "전체" 카테고리가 선택되면 모든 데이터를 가져옵니다.
        if (categoryId === null) {
            fetchData(1, null, searchTerm); // 전체 데이터 조회
        } else {
            fetchData(1, categoryId, searchTerm); // 선택된 카테고리와 현재 검색어로 데이터 가져오기
        }
    };

    // 공연 데이터를 불러와서 렌더링
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div style = {{marginLeft: '100px', marginRight: '100px'}}>
                <h1>공연 목록</h1>
                <TextField
                    label="검색어를 입력하세요"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyPress} // 엔터 키 이벤트 처리
                    fullWidth
                    style={{ marginBottom: '10px', width: '90%' }} // 입력 필드 아래 여백
                />

                <div className="category-performance-write">
                    <div className='category'>
                        {/* 동적으로 카테고리 버튼 생성 */}
                        {categories.map((category) => (
                            <Button
                                key={category.categoryId} // 고유한 키 사용
                                variant="contained"
                                color="primary"
                                style={{ marginRight: '10px' }}
                                onClick={() => handleCategoryClick(category.categoryId)} // 카테고리 클릭 시 함수 호출
                            >
                                {category.nameKr} {/* 카테고리 이름 */}
                            </Button>
                        ))}
                    </div>
                    <div className='performance-write' style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '90%' }}>
                        <Link to="/register-performance">
                            <Button variant="contained" color="secondary">
                                공연 추가
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="performance-list">
                    {data.map((performance, index) => (
                        <PerformanceCard
                            key={index}
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
