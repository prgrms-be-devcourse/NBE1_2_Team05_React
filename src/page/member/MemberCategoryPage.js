import React, { useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import axios from '../../api/axiosInterceptor';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SomunIcon from '../../assets/image/somun_icon.png';
import { useNavigate,useLocation } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CssBaseline from '@mui/material/CssBaseline';  // CssBaseline 추가

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            Social Culture
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function MemberCategoryPage() {
    const [categories, setCategories] = useState([]);
    const [favoriteCategories, setFavoriteCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [isInitialFavoriteLoaded, setIsInitialFavoriteLoaded] = useState(false); // 사용자의 기존 선호 카테고리 로드 여부
    const [hasChanges, setHasChanges] = useState(false); // 카테고리 변경 여부
    const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar 상태
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar 메시지
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Snackbar 종류

    const navigate = useNavigate();
    const location = useLocation();

    // 카테고리 전체 목록 및 사용자 선호 카테고리 불러오기
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/members/categories');
                setCategories(response.data.result);
            } catch (error) {
                console.error('카테고리 목록을 불러오는 중 오류가 발생했습니다:', error);
            }
        };

        const fetchFavoriteCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/members/categories/favorites');
                const favorites = response.data.result;
                setFavoriteCategories(favorites);
                setSelectedCategories(favorites.map(cat => cat.categoryId));
                setIsInitialFavoriteLoaded(favorites.length > 0); // 사용자의 선호 카테고리가 있는지 확인
            } catch (error) {
                console.error('선호 카테고리를 불러오는 중 오류가 발생했습니다:', error);
            }
        };

        fetchCategories();
        fetchFavoriteCategories();
    }, []);

    // 카테고리 선택 핸들러
    const handleCategorySelect = (categoryId) => {
        let updatedCategories;
        if (selectedCategories.includes(categoryId)) {
            updatedCategories = selectedCategories.filter(id => id !== categoryId);
        } else if (selectedCategories.length < 3) {
            updatedCategories = [...selectedCategories, categoryId];
        } else {
            return;
        }

        setSelectedCategories(updatedCategories);
        // 기존 선호 카테고리와 비교하여 변경 사항 있는지 확인
        setHasChanges(!areArraysEqual(favoriteCategories.map(cat => cat.categoryId), updatedCategories));
    };

    // 배열 비교 함수 (순서와 상관없이 두 배열이 같은지 확인)
    const areArraysEqual = (arr1, arr2) => {
        if (arr1.length !== arr2.length) return false;
        const sortedArr1 = [...arr1].sort();
        const sortedArr2 = [...arr2].sort();
        return sortedArr1.every((value, index) => value === sortedArr2[index]);
    };

    // 카테고리 제출 핸들러
    const handleSubmit = async () => {
        try {
            // 선택된 카테고리 서버로 전송
            const url = isInitialFavoriteLoaded
                ? 'http://localhost:8080/api/v1/members/categories/favorites'  // 수정 요청
                : 'http://localhost:8080/api/v1/members/categories';  // 등록 요청

            const method = isInitialFavoriteLoaded ? 'put' : 'post'; // 요청 타입 결정

            await axios[method](url, { categories: selectedCategories });

            // 스낵바 메시지 설정 후 표시
            setSnackbarMessage(isInitialFavoriteLoaded ? '선호 카테고리 수정이 완료되었습니다.' : '선호 카테고리 등록이 완료되었습니다.');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            setTimeout(() => {
                // 이전 페이지가 로그인 페이지인지 확인하거나 명시적으로 홈으로 리다이렉트
                const previousPage = location.state?.from;
                if (previousPage && previousPage === '/signin') {
                    navigate('/'); // 로그인 페이지가 이전 페이지면 홈으로 이동
                } else {
                    navigate(-1);  // 그렇지 않으면 이전 페이지로 이동
                }
            }, 1000);
        } catch (error) {
            console.error('카테고리를 제출하는 중 오류가 발생했습니다:', error);
            setSnackbarMessage('오류가 발생했습니다. 다시 시도해주세요.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const isButtonDisabled = isInitialFavoriteLoaded
        ? !hasChanges // "카테고리 수정 완료" 상태에서는 변화가 없으면 비활성화
        : selectedCategories.length === 0; // 처음 선택할 때는 최소 하나가 선택되어야 함

    const buttonText = isInitialFavoriteLoaded
        ? '카테고리 수정 완료'
        : isButtonDisabled
            ? '카테고리를 골라주세요'
            : '카테고리 선택 완료';

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />  {/* CssBaseline 컴포넌트 사용 */}
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img
                        src={SomunIcon}
                        alt="소문 로고"
                        style={{ width: '40%', height: '40%', marginBottom: '10px', cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    />

                    <Typography
                        variant="body1"
                        style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', marginTop: '50px' }}
                    >
                        선호하는 카테고리를 선택해주세요(최대 3개)
                    </Typography>

                    {/* 카테고리 선택 버튼들 */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                        {categories.map((category) => {
                            const isSelected = selectedCategories.includes(category.categoryId);
                            return (
                                <Button
                                    key={category.categoryId}
                                    variant="contained"
                                    onClick={() => handleCategorySelect(category.categoryId)}
                                    sx={{
                                        backgroundColor: isSelected ? '#007bff' : '#f0f0f0',
                                        color: isSelected ? '#fff' : '#000',
                                        borderRadius: '20px',
                                        padding: '10px 20px',
                                        fontSize: '14px',
                                        textTransform: 'none',
                                    }}
                                >
                                    {category.nameKr}
                                </Button>
                            );
                        })}
                    </Box>

                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 10,
                            mb: 2,
                            width: '250px',
                            borderRadius: '30px',
                            padding: '10px 20px'
                        }}
                        onClick={handleSubmit}
                        disabled={isButtonDisabled}
                    >
                        {buttonText}
                    </Button>

                    {isInitialFavoriteLoaded ? (
                        <Typography
                            onClick={() => navigate('/mypage')}
                            sx={{
                                mt: 0,
                                cursor: 'pointer',
                                fontSize: '13px',
                                color: 'blue', // 파란색 글씨
                                fontWeight: 'bold',
                                '&:hover': {
                                    textDecoration: 'none', // 호버 시 밑줄 없애기
                                }
                            }}
                        >
                            마이페이지로 이동
                        </Typography>
                    ) : (
                        <Typography
                            onClick={() => navigate('/signin')}
                            sx={{
                                mt: 0,
                                cursor: 'pointer',
                                fontSize: '13px',
                                color: 'blue', // 파란색 글씨
                                fontWeight: 'bold',
                                '&:hover': {
                                    textDecoration: 'none', // 호버 시 밑줄 없애기
                                }
                            }}
                        >
                            다음에 선택하기
                        </Typography>
                    )}
                </Box>

                {/* Snackbar 컴포넌트 추가 */}
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}


