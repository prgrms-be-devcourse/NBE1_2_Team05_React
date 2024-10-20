import React, { useEffect, useState } from 'react';
import PerformanceCard from '../component/performance/PerformanceCard';
import { Pagination, TextField, Button, InputAdornment, CircularProgress } from '@mui/material'; // CircularProgress 추가
import { Box } from '@mui/system';
import { fetchCategories, fetchData } from '../api/performanceApi';
import { Search } from '@mui/icons-material'; // 돋보기 아이콘 추가
import './AllPerformancePage.css';
import { Link } from 'react-router-dom';
import { Add } from '@mui/icons-material'; // 공연 추가 버튼에 + 아이콘

const AllPerformancePage = () => {
    const [page, setPage] = useState(1);
    const itemsPerPage = 16;
    const [totalItems, setTotalItems] = useState(0);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [tmpSearchTerm, setTmpSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);

    const loadCategories = async () => {
        try {
            const categoriesData = await fetchCategories();
            setCategories([{ categoryId: null, nameKr: '전체' }, ...categoriesData]);
        } catch (err) {
            setError(err.message);
        }
    };

    const loadData = async () => {
        setLoading(true); // 로딩 시작
        try {
            const { totalElements, performances } = await fetchData(page, selectedCategory, searchTerm);

            if (performances && Array.isArray(performances)) {
                const performanceData = performances.map((item) => ({
                    performanceId: item.performanceId,
                    memberName: item.memberName,
                    imageUrl: item.imageUrl,
                    title: item.title,
                    startDateTime: item.dateStartTime,
                    endDateTime: item.dateEndTime,
                    price: item.price,
                    address: item.address,
                }));

                setTotalItems(totalElements);
                setData(performanceData);
            } else {
                setData([]);
                setError('Performances is not an array or is undefined');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false); // 로딩 끝
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadData();
    }, [page, selectedCategory, searchTerm]);

    // 로딩 중일 때 동그라미가 굴러가는 로딩 표시
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress /> {/* 동그라미 굴러가는 효과 */}
            </div>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!data) {
        return <div>No data available</div>;
    }

    const handleChange = (event, value) => {
        setPage(value);
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

    const handleCategoryClick = (categoryId) => {
        if (categoryId === 0 || selectedCategory === categoryId) {
            setSelectedCategory(null);
        } else {
            setSelectedCategory(categoryId);
        }
        setPage(1);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center' }}>
            {/* 검색창 부분 */}
            <div className="search-container">
                <TextField
                    label="공연을 검색해보세요"
                    variant="outlined"
                    value={tmpSearchTerm}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyPress}
                    className="search-input"
                    sx={{
                        width: '600px', // 고정된 너비
                        marginTop: '30px',
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '50px', // 둥근 테두리
                        },
                    }}
                    InputLabelProps={{
                        sx: {
                            marginLeft: '20px', // label에 왼쪽 마진을 추가
                        },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Search style={{ cursor: 'pointer' }} onClick={() => setSearchTerm(tmpSearchTerm)} />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>

            {/* 카테고리 버튼 */}
            <div className="category">
                {categories.map((category) => (
                    <Button
                        key={category.categoryId}
                        variant="contained"
                        color={selectedCategory === category.categoryId ? 'secondary' : 'primary'}
                        onClick={() => handleCategoryClick(category.categoryId)}
                    >
                        {category.nameKr}
                    </Button>
                ))}
            </div>

            {/* 공연 카드 리스트 */}
            <div className="performance-list">
                {data.map((performance) => (
                    <PerformanceCard
                        key={performance.performanceId}
                        {...performance}
                    />
                ))}
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

            {/* 공연 추가 버튼 */}
            <Link to="/performance/register">
                <div className="add-performance-btn">
                    <Add />
                </div>
            </Link>
        </div>
    );
};

export default AllPerformancePage;
