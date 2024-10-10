import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../api/axiosInterceptor';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import {useAuth} from "../../context/AuthContext";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const NaverCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {login} = useAuth();

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    useEffect(() => {
        // 쿼리 파라미터에서 인증 코드를 추출
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (code && state) {
            const fetchTokens = async () => {
                try {
                    const response = await axios.post(`http://localhost:8080/api/v1/members/oauth/NAVER`, {
                        code: code,
                        state: state
                    });

                    // 응답에서 리디렉션 여부를 확인
                    if (response.data === 'redirect nicknamePage') {
                        // 닉네임 설정 화면으로 리디렉션
                        navigate('/nickname', { replace: true });
                    } else {
                        // 정상적으로 토큰을 받은 경우
                        const { accessToken, refreshToken, userName } = response.data;

                        localStorage.setItem('access_token', accessToken);
                        localStorage.setItem('refresh_token', refreshToken);
                        localStorage.setItem('user_name', userName);

                        login(userName);

                        setSnackbarSeverity('success');
                        setSnackbarMessage('로그인에 성공했습니다.');
                        setOpenSnackbar(true);

                        // 홈 화면으로 리디렉트
                        setTimeout(() => {
                            navigate('/', { replace: true });
                        }, 1000);
                    }


                } catch (error) {
                    console.error('네이버 로그인 중 오류가 발생했습니다:', error);
                    setSnackbarSeverity('error');
                    setSnackbarMessage('네이버 로그인 중 오류가 발생했습니다.');
                    setOpenSnackbar(true);

                    setTimeout(() => {
                        navigate('/signin');
                    }, 1000);
                }
            };

            fetchTokens();
        }
    }, [location.search, navigate]);

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
