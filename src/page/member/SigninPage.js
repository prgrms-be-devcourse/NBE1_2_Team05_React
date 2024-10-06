import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import {useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext"; // useAuth 훅 포인트

// .image 폴더에 있는 소셜 로그인 아이콘 불러오기
import NaverIcon from '../../assets/image/btn_naver.svg';
import KakaoIcon from '../../assets/image/btn_kakao.svg';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Social Culture
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function SignIn() {
    const { login } = useAuth();  // useAuth 훅에서 login 함수 가져오기
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const loginData = {
            email: data.get('email'),
            password: data.get('password'),
        };

        // try {
        //     // 실제 백엔드 로그인 API 호출
        //     const response = await axios.post('https://your-backend-api.com/api/auth/login', loginData);
        //     const token = response.data.token;
        //
        //     // JWT 토큰을 localStorage에 저장
        //     localStorage.setItem('token', token);
        //
        //     // 로그인 성공 시 원하는 경로로 이동 (예: 메인 페이지)
        //     window.location.href = '/';
        // } catch (error) {
        //     console.error('로그인 실패:', error);
        //     alert('로그인에 실패했습니다. 다시 시도해주세요.');
        // }

        try {
            // 임시 로그인 처리
            const isSuccess = loginData.email === 'master@gmail.com' && loginData.password === '1234'; // 임시 성공 조건

            if (isSuccess) {
                // 로그인 성공 처리
                alert('로그인 성공!');
                localStorage.setItem('token', 'temporary_token'); // 임시로 토큰 저장

                login('temporary_token'); // useAuth 에서 가져온 login 함수 호출

                // 메인 페이지로 리디렉션
                navigate('/');

                // window.location.href = '/'; // 메인 페이지로 리디렉션
            } else {
                // 로그인 실패 처리
                alert('로그인 실패! 이메일 또는 비밀번호를 확인해주세요.');
            }
        } catch (error) {
            console.error('로그인 실패:', error);
            alert('로그인에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 네이버 로그인 핸들러
    const handleNaverLogin = () => {
        window.location.href = '#'; // 네이버 OAuth URL
    };

    // 카카오 로그인 핸들러
    const handleKakaoLogin = () => {
        window.location.href = '#'; // 카카오 OAuth URL
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        소문
                    </Typography>

                    {/* 소셜 로그인 아이콘 추가 */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 2 }}>
                        <img
                            src={NaverIcon}
                            alt="네이버 로그인"
                            style={{ cursor: 'pointer', marginRight: '10px', width: '40px', height: '40px' }}
                            onClick={handleNaverLogin}
                        />
                        <img
                            src={KakaoIcon}
                            alt="카카오 로그인"
                            style={{ cursor: 'pointer', width: '40px', height: '40px' }}
                            onClick={handleKakaoLogin}
                        />
                    </Box>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="로그인 상태 유지"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            로그인
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="/forgot-password" variant="body2">
                                    비밀번호를 잊으셨나요?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {"계정이 없으신가요? 회원가입"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}
