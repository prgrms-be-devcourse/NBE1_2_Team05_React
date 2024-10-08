import axios from 'axios';
import { useEffect, useState } from 'react';
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { Grid } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import * as React from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// 로그인 구현 후 삭제할 예정
axios.interceptors.request.use(
    (config) => {
        // Authorization 헤더에 하드코딩된 액세스 토큰 추가
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0MTFAZ21haWwuY29tIiwiYXV0aCI6IlJPTEVfUEFETUlOIiwiZW1haWwiOiJ0ZXN0MTFAZ21haWwuY29tIiwiZXhwIjoxNzI4MzYwODE5fQ.kZLei6X6q1wkmPRbOb5NNSAmk3uMd31cTBAtDUM29VY`;
        return config;
    },
    (error) => Promise.reject(error)
);

const MyPerformances = () => {
    const [performances, setPerformances] = useState([]); // 초기값을 빈 배열로 설정
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1); // 현재 페이지 상태
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const performancesPerPage = 3; // 페이지당 공연 수
    const navigate = useNavigate(); // useNavigate 훅 사용

    useEffect(() => {
        const fetchPerformances = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/performances/admin/my', {
                    params: {
                        page: page - 1, // API에서 0-based index 사용
                        size: performancesPerPage,
                    },
                });
                console.log(response.data);
                if (response.data.isSuccess) {
                    setPerformances(response.data.result || []); // 응답 데이터가 없을 경우 빈 배열로 설정
                    setTotalPages(Math.ceil(response.data.totalCount / performancesPerPage)); // 총 페이지 수 계산
                }
            } catch (error) {
                console.error("공연 목록을 불러오는 중 오류 발생", error);
            } finally {
                setLoading(false);
                // setPerformances([
                //     {
                //         memberName: "홍길동",
                //         performanceId: 1,
                //         title: "뮤지컬 '햄릿'",
                //         dateStartTime: "2024-10-08T19:00:00",
                //         dateEndTime: "2024-10-08T21:00:00",
                //         address: "서울특별시 예술의전당",
                //         imageUrl: "http://example.com/image1.jpg",
                //         price: 75000,
                //         status: "예약 중",
                //         categories: [{name: "뮤지컬"}],
                //     },
                //     {
                //         memberName: "홍길동",
                //         performanceId: 2,
                //         title: "콘서트 '비틀즈'",
                //         dateStartTime: "2024-10-09T20:00:00",
                //         dateEndTime: "2024-10-09T22:00:00",
                //         address: "부산광역시 해운대",
                //         imageUrl: "http://example.com/image2.jpg",
                //         price: 50000,
                //         status: "예매 완료",
                //         categories: [{name: "콘서트"}],
                //     }, {
                //         memberName: "홍길동",
                //         performanceId: 3,
                //         title: "뮤지컬 '햄릿'",
                //         dateStartTime: "2024-10-08T19:00:00",
                //         dateEndTime: "2024-10-08T21:00:00",
                //         address: "서울특별시 예술의전당",
                //         imageUrl: "http://example.com/image1.jpg",
                //         price: 75000,
                //         status: "예약 중",
                //         categories: [{name: "뮤지컬"}],
                //     },
                //     {
                //         memberName: "홍길동",
                //         performanceId: 4,
                //         title: "콘서트 '비틀즈'",
                //         dateStartTime: "2024-10-09T20:00:00",
                //         dateEndTime: "2024-10-09T22:00:00",
                //         address: "부산광역시 해운대",
                //         imageUrl: "http://example.com/image2.jpg",
                //         price: 50000,
                //         status: "예매 완료",
                //         categories: [{name: "콘서트"}],
                //     }, {
                //         memberName: "홍길동",
                //         performanceId: 5,
                //         title: "뮤지컬 '햄릿'",
                //         dateStartTime: "2024-10-08T19:00:00",
                //         dateEndTime: "2024-10-08T21:00:00",
                //         address: "서울특별시 예술의전당",
                //         imageUrl: "http://example.com/image1.jpg",
                //         price: 75000,
                //         status: "예약 중",
                //         categories: [{name: "뮤지컬"}],
                //     },
                //     {
                //         memberName: "홍길동",
                //         performanceId: 6,
                //         title: "콘서트 '비틀즈'",
                //         dateStartTime: "2024-10-09T20:00:00",
                //         dateEndTime: "2024-10-09T22:00:00",
                //         address: "부산광역시 해운대",
                //         imageUrl: "http://example.com/image2.jpg",
                //         price: 50000,
                //         status: "예매 완료",
                //         categories: [{name: "콘서트"}],
                //     },
                // ]);
            }
        };

        fetchPerformances();
    }, [page]); // page가 변경될 때마다 데이터 요청

    if (loading) {
        return <p>로딩 중...</p>;
    }

    return (
        <>
            <Grid container spacing={2}> {/* Grid 컨테이너로 변경하고 spacing 추가 */}
                {performances && performances.length > 0 ? (
                    performances.map(performance => (
                        <Grid item xs={12} sm={6} md={4} key={performance.performanceId}> {/* 3개씩 나열하도록 설정 */}
                            <Card sx={{ maxWidth: 345 }}>
                                <CardMedia
                                    sx={{ height: 140 }}
                                    image={performance.imageUrl || "기본 이미지 URL"} // 기본 이미지 설정
                                    title={performance.title} // 제목을 prop으로 추가
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {performance.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        <strong>상태:</strong> {performance.status}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        <strong>시작 시간:</strong> {new Date(performance.dateStartTime).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        <strong>종료 시간:</strong> {new Date(performance.dateEndTime).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        <strong>주소:</strong> {performance.address}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        <strong>가격:</strong> {performance.price.toLocaleString()} 원
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        onClick={() => navigate(`/performances/${performance.performanceId}`)} // 상세 페이지로 이동
                                    >
                                        자세히 보기
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}> {/* 메시지를 위한 Grid item 추가 */}
                        <p>등록한 공연이 없습니다.</p>
                    </Grid>
                )}
            </Grid>
            <Stack spacing={2} mt={2}>
                <Pagination
                    count={10} // 총 페이지 수
                    page={page} // 현재 페이지
                    onChange={(event, value) => setPage(value)} // 페이지 변경 시 상태 업데이트
                    renderItem={(item) => {
                        if (item.type === 'previous' || item.type === 'next') {
                            return (
                                <PaginationItem
                                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                                    {...item}
                                />
                            );
                        }

                        // 페이지 번호를 포함한 PaginationItem 반환
                        return (
                            <PaginationItem
                                {...item}
                                onClick={() => setPage(item.page)} // 페이지 번호 클릭 시 상태 업데이트
                            >
                                {item.page}
                            </PaginationItem>
                        );
                    }}
                />
                <Typography variant="body1" align="center">
                    현재 페이지: {page}
                </Typography>
            </Stack>
        </>
    );
};

export default MyPerformances;