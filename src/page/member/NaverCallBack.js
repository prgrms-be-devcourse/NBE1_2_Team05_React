import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../api/axiosInterceptor';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useAuth } from "../../context/AuthContext";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const NaverCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');
    const [isRequestSent, setIsRequestSent] = useState(false);  // 중복 요청 방지 상태

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    useEffect(() => {
        // 쿼리 파라미터에서 인증 코드를 추출
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        // 요청을 한 번도 보내지 않았고, code와 state가 있을 경우에만 요청
        if (code && state && !isRequestSent) {
            const fetchTokens = async () => {
                try {
                    setIsRequestSent(true);  // 첫 번째 요청 이후 요청 방지 플래그 설정
                    const response = await axios.post(`http://localhost:8080/api/v1/members/oauth/NAVER`, {
                        code: code,
                        state: state
                    });

                    // 응답에서 리디렉션 여부를 확인
                    if (response.data === 'redirect nicknamePage') {
                        navigate('/nickname', { replace: true });
                    } else {
                        const { accessToken, refreshToken, userName, firstLogin } = response.data;

                        localStorage.setItem('access_token', accessToken);
                        localStorage.setItem('refresh_token', refreshToken);
                        localStorage.setItem('user_name', userName);

                        login(userName);

                        setSnackbarSeverity('success');
                        setSnackbarMessage('로그인에 성공했습니다.');
                        setOpenSnackbar(true);

                        if (firstLogin === true) {
                            await axios.patch(`http://localhost:8080/api/v1/members/first-login`);

                            setTimeout(() => {
                                navigate('/member/category', { state: { from: '/signin' } });
                            }, 1000);
                        }

                        else{
                            // 홈 화면으로 리디렉트
                            setTimeout(() => {
                                navigate('/', { replace: true });
                            }, 1000);
                        }
                    }
                } catch (error) {
                    if (error.response && error.response.status === 409) {
                        setSnackbarSeverity('error');
                        setSnackbarMessage('이미 사용중인 이메일입니다. 다른 소셜 이메일로 회원가입 시도해주세요');
                    } else {
                        setSnackbarSeverity('error');
                        setSnackbarMessage('네이버 로그인 중 오류가 발생했습니다.');
                    }

                    setOpenSnackbar(true);

                    setTimeout(() => {
                        navigate('/signin');
                    }, 2000);
                }
            };

            fetchTokens();
        }
    }, [location.search, navigate, isRequestSent]);

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>

            <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default NaverCallback;
