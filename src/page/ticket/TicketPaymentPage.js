// 티켓 결제 페이지
// author : ycjung

import React, {useEffect, useState} from 'react';
import {
    Box,
    Container,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {WidgetCheckoutPage} from "../../component/ticket/payment/WidgetCheckout";
import {PerformanceImage} from "../../component/performance/PerformanceImage";
import {PerformanceInfo} from "../../component/performance/PerformanceInfo";
import {getAllCouponsByMemberEmail} from "../../api/couponApi";

function PeopleCounter({ numPeople, handleDecrease, handleIncrease, handleInputChange }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <Typography variant="body1" sx={{ marginRight: 2 }}>
                인원:
            </Typography>
            <IconButton onClick={handleDecrease} aria-label="감소">
                <RemoveIcon />
            </IconButton>
            <TextField
                value={numPeople}
                onChange={handleInputChange}
                size="small"
                inputProps={{ style: { textAlign: 'center' }, min: 1 }}
                sx={{ width: 50, marginX: 1 }}
            />
            <IconButton onClick={handleIncrease} aria-label="증가">
                <AddIcon />
            </IconButton>
        </Box>
    );
}

// 쿠폰 데이터를 가져오는 함수
const fetchCoupons = async () => {
    try {
        const couponData = await getAllCouponsByMemberEmail();
        return couponData.data;  // 쿠폰 데이터를 반환

        // const exampleCoupons = [
        //     { couponId: 1, name: '10% 할인 쿠폰', percent: 10 },
        //     { couponId: 2, name: '20% 할인 쿠폰', percent: 20 }
        // ];
        //
        // return exampleCoupons;
    } catch (error) {
        console.error('Failed to fetch coupons:', error);
        throw error;  // 에러를 호출한 쪽에서 처리하도록 던짐
    }
};

// 쿠폰 선택 컴포넌트
function CouponSelector({ selectedCoupon, setSelectedCoupon }) {
    const [coupons, setCoupons] = useState([]);

    // 쿠폰 데이터를 가져오는 useEffect
    useEffect(() => {
        const loadCoupons = async () => {
            try {
                const couponData = await fetchCoupons();
                if (couponData.length === 0) {
                    // 쿠폰 데이터가 없을 때 '쿠폰 없음'을 기본으로 추가
                    const defaultCoupon = { couponId: -1, name: '쿠폰 없음', percent: 0 };
                    setCoupons([defaultCoupon]);
                    setSelectedCoupon(defaultCoupon.couponId); // 기본적으로 '쿠폰 없음' 선택
                } else {
                    setCoupons(couponData);
                    setSelectedCoupon(couponData[0].couponId); // 첫 번째 쿠폰을 기본 선택
                }
            } catch (error) {
                console.error('Failed to fetch coupons:', error);
                const defaultCoupon = { couponId: -1, name: '쿠폰 없음', percent: 0 };
                setCoupons([defaultCoupon]);
                setSelectedCoupon(defaultCoupon.couponId); // 에러 시 '쿠폰 없음' 선택
            }
        };

        loadCoupons();
    }, [setSelectedCoupon]);

    // 쿠폰 선택 변경 핸들러
    const handleCouponChange = (event) => {
        setSelectedCoupon(event.target.value);
    };

    return (
        <FormControl fullWidth sx={{ marginTop: 2 }} variant="outlined">
            <InputLabel id="coupon-select-label">보유한 할인 쿠폰 선택</InputLabel>
            <Select
                labelId="coupon-select-label"
                id="coupon-select"
                value={selectedCoupon}
                onChange={handleCouponChange}
                label="보유한 할인 쿠폰 선택"  // Select에 label 속성 추가
            >
                {coupons.map((coupon) => (
                    <MenuItem key={coupon.couponId} value={coupon.couponId}>
                        {coupon.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}


// 결제 정보 컴포넌트
function PaymentInfo({ numPeople, performancePrice }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <WidgetCheckoutPage />
        </Box>
    );
}

export default function TicketPaymentPage({
                                              imageUrl = "https://via.placeholder.com/300x200",
                                              title = "공연 제목",
                                              time = "0000년도 00월 00일 00시 00분",
                                              performancePrice = 50000,
                                              remainingTickets = 10,
                                          }) {
    const [numPeople, setNumPeople] = useState(1); // 기본 인원 수 1명
    const [selectedCoupon, setSelectedCoupon] = useState(''); // 선택된 쿠폰 상태

    // 인원 수 증가 함수
    const handleIncrease = () => {
        setNumPeople(numPeople + 1);
    };

    // 인원 수 감소 함수
    const handleDecrease = () => {
        if (numPeople > 1) {
            setNumPeople(numPeople - 1);
        }
    };

    // 인원 수 직접 입력 함수
    const handleInputChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0) {
            setNumPeople(value);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ marginTop: 4 }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
                <Grid container spacing={3}>
                    {/* 왼쪽 배치 */}
                    <Grid item xs={12} md={5}>
                        <PerformanceImage imageUrl={imageUrl} />

                        <PerformanceInfo
                            title={title}
                            time={time}
                            remainingTickets={remainingTickets}
                        />

                        <PeopleCounter
                            numPeople={numPeople}
                            handleDecrease={handleDecrease}
                            handleIncrease={handleIncrease}
                            handleInputChange={handleInputChange}
                        />

                        {/* 쿠폰 선택 컴포넌트 */}
                        <CouponSelector selectedCoupon={selectedCoupon} setSelectedCoupon={setSelectedCoupon} />

                        {/* 총 결제 금액 = 공연 금액 * 인원 수 계산 */}
                        <Typography variant="h6" gutterBottom>
                            총 결제 금액: {numPeople * performancePrice}원
                        </Typography>
                    </Grid>

                    {/* 구분선 */}
                    <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Divider orientation="vertical" flexItem />
                    </Grid>

                    {/* 오른쪽: 결제 정보 섹션 */}
                    <Grid item xs={12} md={6}>
                        <PaymentInfo numPeople={numPeople} performancePrice={performancePrice} />
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}
