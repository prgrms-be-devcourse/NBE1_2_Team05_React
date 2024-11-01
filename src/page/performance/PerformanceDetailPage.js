// 공연 상세 정보 페이지
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDetailData, confirmPerformance } from '../../api/performanceApi'; // API 요청 함수
import CommentList from '../../component/comment/CommentList'
// PerformanceDetailPage.js
import { enterQueue } from '../../api/performanceApi'; // enterQueue 함수 import

import {
    Container,
    Typography,
    Paper,
    Grid,
    Button,
    Popover,
    List,
    ListItem,
    ListItemText,
    Divider,
    Box,
    Link,
    Dialog,
    DialogContent
} from '@mui/material';
import KakaoMap from "../../component/performance/KakaoMap";
import {getMemberInfo} from "../../api/userApi";
import {getFirstComeCoupon} from "../../api/couponApi";

export default function PerformanceDetailPage() {
    const { performanceId } = useParams(); // URL에서 performanceId 가져오기
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [performanceData, setPerformanceData] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedAttendees, setSelectedAttendees] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false); // Dialog 상태 관리
    const [selectedImage, setSelectedImage] = useState('');
    const [couponExpiration, setCouponExpiration] = useState(false);


    const [formData, setFormData] = useState({
        status: ''
    });

    useEffect(() => {
        const getPerformanceDetails = async () => {
            try {
                console.log(performanceId);
                const data = await fetchDetailData(performanceId); // ID로 데이터 요청
                console.log(data)
                setPerformanceData(data);

                if (data.firstComeCoupons && data.firstComeCoupons.every(coupon => coupon.expireTime !== null)) {
                    setCouponExpiration(true);
                } else {
                    setCouponExpiration(false);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getPerformanceDetails();
    }, [performanceId]); // performanceId가 변경될 때마다 데이터 요청

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!performanceData) return <div>No data available</div>;

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectAttendees = (number) => {
        setSelectedAttendees(number);
        handleClose();
    };

    const handleImageClick = () => {
        const imageUrl = performanceData?.imageUrl || '/logo192.png'; // performanceData가 존재하면 imageUrl, 없으면 기본 이미지 사용
        setSelectedImage(imageUrl); // 클릭한 이미지 URL 설정
        setOpenDialog(true); // Dialog 열기
    };

    const handleCloseDialog = () => {
        setOpenDialog(false); // Dialog 닫기
    };

    // 공연 확정짓기 핸들러
    const handleConfirmPerformance = async () => {
        try {
            // formData 업데이트
            const updatedData = {
                status: 'CONFIRMED', // 상태를 CONFIRMED로 변경
            };

            await confirmPerformance(performanceId, updatedData); // API 호출
            // 공연 상세 정보 다시 조회
            const data = await fetchDetailData(performanceId);
            setPerformanceData(data); // 상태 업데이트
        } catch (err) {
            setError(err.message); // 에러 처리
            console.error('Error confirming performance:', err);
        }
    };

    const handleTicketPurchase = async () => {
        console.log("performanceId " + performanceId)
        try {
            const response = await enterQueue(performanceId); // performanceId를 전달
            console.log(response); // 응답 확인

            if (response && response.isSuccess) {
                console.log(`대기열에 추가되었습니다. 현재 대기 순위: ${response.result.rank}`);
                navigate(`/payment`, {
                    state: {
                        performanceId: performanceData.performanceId,
                        imageUrl: performanceData.imageUrl || "https://via.placeholder.com/300x200",
                        title: performanceData.title,
                        time: `${performanceData.startDateTime} ~ ${performanceData.endDateTime}`,
                        performancePrice: performanceData.price,
                        remainingTickets: performanceData.remainingTickets,
                    }
                });
            } else {
                console.log("티켓 구매 요청 실패:", response);
            }
        } catch (error) {
            console.error("티켓 구매 오류:", error);
        }
    };


    //선착순 쿠폰 발급 핸들러
    const handleFirstComeCoupon = async () => {
        try {
            const data = await getFirstComeCoupon(performanceId);

            if (data.code === "COUPON400") {
                alert(`${data.message}`);
                setCouponExpiration(true);
            } else if (data.code === "COUPON401") {
                alert(`${data.message}`);
            } else {
                const expireDate = new Date(data.expireTime);
                const formattedExpireTime = `${expireDate.getFullYear()}년 ${expireDate.getMonth() + 1}월 ${expireDate.getDate()}일`;
                alert(`${data.message} 유효기간은 ${formattedExpireTime}까지 입니다.`);
            }

            // 쿠폰 데이터 최신화
            setPerformanceData(prevData => ({
                ...prevData,
                firstComeCoupons: prevData.firstComeCoupons.map(coupon =>
                    coupon.couponId === data.couponId
                        ? { ...coupon, expireTime: data.expireTime }
                        : coupon
                )
            }));
        } catch (err) {
            alert(`에러: ${err.message}`);
        }
    };

    const open = Boolean(anchorEl);
    const id = open ? 'attendees-popover' : undefined;

    return (
        <Container maxWidth="900px">
            <Paper elevation={3} sx={{ p: 3, my: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Typography variant="h5" gutterBottom>
                        {performanceData.title}
                    </Typography>
                    {performanceData.status === 'NOT_CONFIRMED' && performanceData.isUpdatable && (
                        <Button variant="contained" color="primary" onClick={handleConfirmPerformance}>
                            공연 확정짓기
                        </Button>
                    )}
                </Box>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>공연소개</Typography>
                        <Typography paragraph marginTop={'20px'}>
                            {performanceData.description}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Typography variant="h6" gutterBottom>멀티미디어</Typography>
                        <Link href="https://www.youtube.com" target="_blank" rel="noopener">
                            <Paper
                                sx={{
                                    height: 150,
                                    width: 150,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mb: 2,
                                    cursor: 'pointer',
                                    position: 'relative',
                                    backgroundImage: 'url("/youtube_icon.png")', // 유튜브 아이콘 URL
                                    backgroundSize: 'contain', // 아이콘 크기 조정
                                    backgroundPosition: 'center', // 아이콘 중앙 정렬
                                    backgroundRepeat: 'no-repeat', // 아이콘 반복 방지
                                    boxShadow: 'none', // 그림자 제거
                                    bgcolor: 'transparent' // 배경 색상 투명
                                }}
                            >
                            </Paper>
                        </Link>
                    </Grid>
                    <Grid item md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <img
                            src={performanceData?.imageUrl || "/logo192.png"}
                            alt="Performance Image"
                            style={{ width: '100%', height: '100%', cursor: 'pointer' }} // 커서 포인터 추가
                            onClick={handleImageClick} // 클릭 핸들러 추가
                        />
                    </Grid>
                </Grid>

                {/* Dialog 컴포넌트 추가 */}
                <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
                        <img
                            src={selectedImage}
                            alt="Enlarged"
                            style={{ width: '100%', height: 'auto' }} // 이미지 크기 조정
                        />
                    </DialogContent>
                </Dialog>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Typography sx={{marginRight:'100px', marginBottom:'20px', color: 'grey.500'}}>{performanceData.remainingTickets} / {performanceData.maxAudience} </Typography>
                    <Box>
                        <Popover
                            id={id}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                        >
                            <List>
                                {[...Array(performanceData.maxAudience)].map((_, index) => (
                                    <ListItem button key={index + 1} onClick={() => handleSelectAttendees(index + 1)}>
                                        <ListItemText primary={`${index + 1}명`} />
                                    </ListItem>
                                ))}
                            </List>
                        </Popover>
                        {/* 공연 티켓 구매 클릭 시 티켓 결재 창으로 링크하는 플로우 구현해야함 */}
                        <Button variant="outlined" onClick={handleTicketPurchase}>공연 티켓 구매</Button>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle1">공연 일시</Typography>
                        <Typography>{performanceData.startDateTime} ~ {performanceData.endDateTime}</Typography>
                    </Grid>
                    <Grid item xs={15} sm={5}>
                        <Typography variant="subtitle1">장소</Typography>
                        <Typography>{performanceData.address}</Typography>
                        <KakaoMap address={performanceData.address} /> {/* KakaoMap 컴포넌트 사용 */}

                    </Grid>
                    <Grid item xs={5} sm={2}>
                        <Typography variant="subtitle1">가격</Typography>
                        <Typography>{performanceData.price}원</Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />
                {performanceData.firstComeCoupons && (
                    <Grid container alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle1">선착순 10% 할인 쿠폰 (3명 한정)</Typography>
                        </Grid>
                        <Grid item>
                            {couponExpiration ? (
                                <Button variant="outlined" disabled>
                                    선착순 쿠폰 마감
                                </Button>
                            ) : (
                                <Button variant="outlined" onClick={handleFirstComeCoupon}>
                                    선착순 쿠폰 받기
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                )}
                <Divider sx={{ my: 3 }} />

                <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1">공연 리뷰</Typography>
                </Grid>
                {/* 댓글 컴포넌트 추가 */}
                <CommentList performanceId={performanceId} />
            </Paper>
        </Container>
    );
}