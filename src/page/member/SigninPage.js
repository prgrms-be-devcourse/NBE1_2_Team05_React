import React, { useState } from 'react';
import axios from "../../api/axiosInterceptor";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SomunIcon from '../../assets/image/somun_icon.png';
import NaverLoginButton from "./NaverLoginButton";
import KakaoLoginButton from "./KakaoLoginButton";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

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

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');

    const navigate = useNavigate();

    const validateEmailFormat = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\d~!@#$%^&*()+|=]{8,16}$/;
        return passwordRegex.test(password);
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let isValid = true;

        // 초기화
        setEmailError('');
        setPasswordError('');

        // 이메일 유효성 검사
        if (!validateEmailFormat(email)) {
            setEmailError("유효하지 않은 이메일 형식입니다.");
            isValid = false;
        }

        // 비밀번호 유효성 검사
        if (!validatePassword(password)) {
            setPasswordError("비밀번호는 최소8~최대16자 영문자, 숫자, 특수문자 1개씩을 포함해야 합니다.");
            isValid = false;
        }

        if (!isValid) {
            setSnackbarSeverity('error');
            setSnackbarMessage("입력한 정보를 다시 확인해주세요.");
            setOpenSnackbar(true);
            return;
        }

        // 서버로 로그인 요청
        try {
            // 서버에 로그인 요청 보내기
            const loginData = { email, password };
            // POST 요청으로 로그인 데이터 전송
            const response = await axios.post('http://localhost:8080/api/v1/members/authenticate', loginData);

            // 응답 데이터에서 액세스 토큰과 리프레시 토큰을 가져옴
            const { accessToken, refreshToken } = response.data;

            // 토큰을 localStorage에 저장
            await localStorage.setItem('access_token', accessToken);
            await localStorage.setItem('refresh_token', refreshToken);

            // 로그인 성공 메시지 표시
            setSnackbarSeverity('success');
            setSnackbarMessage("로그인에 성공했습니다.");
            setOpenSnackbar(true);

            // 로그인 후 리다이렉트 (예: 홈으로 이동)
            setTimeout(() => {
                navigate('/home');
            }, 1000);

        } catch (error) {
            setSnackbarSeverity('error');
            setSnackbarMessage("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
            setOpenSnackbar(true);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline/>
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
                        onClick={() => navigate('/singin')}
                    />

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="이메일"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!emailError}
                            helperText={emailError}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="비밀번호"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={!!passwordError}
                            helperText={passwordError}
                        />

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                                width: '100%'
                            }}
                        >
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 0 }}
                            >
                                로그인
                            </Button>
                            {/* 네이버와 카카오 로그인 버튼 */}
                            <NaverLoginButton type="button" buttonText="네이버 로그인" />
                            <KakaoLoginButton type="button" buttonText="카카오 로그인" />
                        </Box>
                        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {"계정이 없으신가요? 회원가입"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
                {/* Snackbar 컴포넌트 추가 */}
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
}
