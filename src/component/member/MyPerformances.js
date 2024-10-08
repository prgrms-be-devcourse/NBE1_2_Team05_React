import React, {useEffect, useState} from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    CardActions,
    Button,
    Grid,
    Stack,
    Pagination,
    PaginationItem
} from '@mui/material';
import {ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';
import {fetchMyPerformances} from '../../api/performanceApi'; // API 모듈에서 함수 임포트

const MyPerformances = () => {
    const [performances, setPerformances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        const getPerformances = async () => {
            setLoading(true);
            try {
                const {data} = await fetchMyPerformances(page);
                setPerformances(data);
            } catch (error) {
                console.error("공연 목록을 불러오는 중 오류 발생", error);
                // 필요 시 사용자에게 오류 메시지 표시
            } finally {
                setLoading(false);
            }
        };

        getPerformances();
    }, [page]);

    if (loading) {
        return <p>로딩 중...</p>;
    }

    return (
        <>
            <Grid container spacing={2}>
                {performances.length > 0 ? (
                    performances.map(performance => (
                        <Grid item xs={12} sm={6} md={4} key={performance.performanceId}>
                            <Card sx={{maxWidth: 345}}>
                                <CardMedia
                                    sx={{height: 140}}
                                    image={performance.imageUrl || "https://via.placeholder.com/345x140?text=No+Image"}
                                    title={performance.title}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {performance.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>상태:</strong> {performance.status}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>시작 시간:</strong> {new Date(performance.dateStartTime).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>종료 시간:</strong> {new Date(performance.dateEndTime).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>주소:</strong> {performance.address}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>가격:</strong> {performance.price.toLocaleString()} 원
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        <strong>카테고리:</strong> {performance.categories.map(category => category.nameKr).join(', ')}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        onClick={() => navigate(`/performances/${performance.performanceId}`)}
                                    >
                                        자세히 보기
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <p>등록한 공연이 없습니다.</p>
                    </Grid>
                )}
            </Grid>
            <Stack spacing={2} mt={2} alignItems="center">
                <Typography variant="body1" align="center">
                    현재 페이지: {page} / {totalPages}
                </Typography>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    renderItem={(item) => (
                        <PaginationItem
                            slots={{previous: ArrowBackIcon, next: ArrowForwardIcon}}
                            {...item}
                        />
                    )}
                />
            </Stack>
        </>
    );
};

export default MyPerformances;