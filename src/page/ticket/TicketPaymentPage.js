import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom'; // useLocation 추가
import {
    Box,
    Container,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    FormControl,
    InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {WidgetCheckoutPage} from "../../component/ticket/payment/WidgetCheckout";
import {PerformanceImage} from "../../component/performance/PerformanceImage";
import {PerformanceInfo} from "../../component/performance/PerformanceInfo";
import {getAllCouponsByMemberEmail} from "../../api/couponApi";

// PeopleCounter 컴포넌트 수정
function PeopleCounter({ numPeople, handleDecrease, handleIncrease, handleInputChange }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 2, minWidth: 150 }}>
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
        return couponData;  // 쿠폰 데이터를 반환
    } catch (error) {
        console.error('Failed to fetch coupons:', error);
        throw error;  // 에러를 호출한 쪽에서 처리하도록 던짐
    }
};

// CouponSelector 컴포넌트 수정
function CouponSelector({ selectedCoupon, setSelectedCoupon, setSelectedCouponPercent }) {
    const [coupons, setCoupons] = useState([]);

    useEffect(() => {
        const loadCoupons = async () => {
            try {
                const couponData = await fetchCoupons();
                const noCouponOption = { couponId: -1, name: '선택 안함', percent: 0 };

                if (couponData.length === 0) {
                    setCoupons([noCouponOption]);
                    setSelectedCoupon(noCouponOption.couponId);
                    setSelectedCouponPercent(0);
                } else {
                    setCoupons([noCouponOption, ...couponData]);
                    setSelectedCoupon(noCouponOption.couponId);
                    setSelectedCouponPercent(0);
                }
            } catch (error) {
                console.error('Failed to fetch coupons:', error);
                const defaultCoupon = { couponId: -1, name: '쿠폰 없음', percent: 0 };
                setCoupons([defaultCoupon]);
                setSelectedCoupon(defaultCoupon.couponId);
                setSelectedCouponPercent(0);
            }
        };

        loadCoupons();
    }, [setSelectedCoupon, setSelectedCouponPercent]);

    const handleCouponChange = (event) => {
        const selectedCouponId = event.target.value;
        const coupon = coupons.find(coupon => coupon.couponId === selectedCouponId);
        setSelectedCoupon(selectedCouponId);
        setSelectedCouponPercent(coupon.percent);
    };

    return (
        <FormControl fullWidth variant="outlined" sx={{ minWidth: 150 }}>
            <InputLabel id="coupon-select-label">보유한 할인 쿠폰 선택</InputLabel>
            <Select
                labelId="coupon-select-label"
                id="coupon-select"
                value={selectedCoupon}
                onChange={handleCouponChange}
                label="보유한 할인 쿠폰 선택"
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

// PaymentInfo 컴포넌트에서 TableCell 수정
function PaymentInfo({ numPeople, performancePrice, totalPayment, selectedCoupon, setSelectedCoupon, setSelectedCouponPercent, handleDecrease, handleIncrease, handleInputChange }) {
    return (
        <TableContainer component={Paper} sx={{ marginTop: 4 }}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>공연 금액</TableCell>
                        <TableCell align="right" sx={{ width: '150px' }}>{performancePrice.toLocaleString()}원</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>인원 선택</TableCell>
                        <TableCell align="right" sx={{ width: '150px' }}>
                            <PeopleCounter
                                numPeople={numPeople}
                                handleDecrease={handleDecrease}
                                handleIncrease={handleIncrease}
                                handleInputChange={handleInputChange}
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>할인 쿠폰</TableCell>
                        <TableCell align="right" sx={{ width: '150px' }}>
                            <CouponSelector
                                selectedCoupon={selectedCoupon}
                                setSelectedCoupon={setSelectedCoupon}
                                setSelectedCouponPercent={setSelectedCouponPercent}
                            />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default function TicketPaymentPage() {
    const location = useLocation(); // location 훅 사용
    const {
        imageUrl = "https://via.placeholder.com/300x200",
        title = "공연 제목",
        time = "0000년도 00월 00일 00시 00분",
        performancePrice = 50000,
        remainingTickets = 10,
    } = location.state || {}; // 전달된 데이터를 location.state에서 받아옴

    const [numPeople, setNumPeople] = useState(1); // 기본 인원 수 1명
    const [selectedCoupon, setSelectedCoupon] = useState(''); // 선택된 쿠폰 상태
    const [selectedCouponPercent, setSelectedCouponPercent] = useState(0); // 선택된 쿠폰의 percent (할인율)

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

    // 총 결제 금액 계산 (할인 적용)
    const calculateTotalPrice = () => {
        const totalPrice = numPeople * performancePrice;
        const discount = (totalPrice * selectedCouponPercent) / 100;
        return totalPrice - discount;  // 할인된 총 금액 반환
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

                        {/* 테이블로 정리된 결제 정보 */}
                        <PaymentInfo
                            numPeople={numPeople}
                            performancePrice={performancePrice}
                            totalPayment={calculateTotalPrice()}
                            selectedCoupon={selectedCoupon}
                            setSelectedCoupon={setSelectedCoupon}
                            setSelectedCouponPercent={setSelectedCouponPercent}
                            handleDecrease={handleDecrease}
                            handleIncrease={handleIncrease}
                            handleInputChange={handleInputChange}
                        />
                    </Grid>

                    {/* 구분선 */}
                    <Grid item xs={12} md={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Divider orientation="vertical" flexItem />
                    </Grid>

                    {/* 오른쪽: 결제 정보 섹션 */}
                    <Grid item xs={12} md={6}>
                        <WidgetCheckoutPage totalPayment={calculateTotalPrice()} />
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}
