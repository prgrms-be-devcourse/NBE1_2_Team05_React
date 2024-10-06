import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import SomunIcon from '../../assets/image/somun_icon.png';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// .image 폴더에 있는 소셜 로그인 아이콘 불러오기
import KakaoLoginButton from './KakaoLoginButton';
import NaverLoginButton from "./NaverLoginButton";

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
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const loginData = {
            email: data.get('email'),
            password: data.get('password'),
        };

        // try {
        //     const isSuccess = loginData.email === 'master@gmail.com' && loginData.password === '1234'; // 임시 성공 조건
        //
        //     if (isSuccess) {
        //         alert('로그인 성공!');
        //         localStorage.setItem('token', 'temporary_token'); // 임시로 토큰 저장
        //         window.location.href = '/'; // 메인 페이지로 리디렉션
        //     } else {
        //         alert('로그인 실패! 이메일 또는 비밀번호를 확인해주세요.');
        //     }
        // } catch (error) {
        //     console.error('로그인 실패:', error);
        //     alert('로그인에 실패했습니다. 다시 시도해주세요.');
        // }
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
                    <img src={SomunIcon} alt="소문 로고" style={{width: '40%', height: '40%',marginBottom: '10px'}}/>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1, width: '100%'}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="이메일"
                            name="email"
                            autoComplete="email"
                            autoFocus
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
                        />

                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2, // 버튼들 사이의 간격을 동일하게 유지
                                width: '100%'
                            }}
                        >
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{mt: 3, mb: 0}}
                            >
                                로그인
                            </Button>
                            <NaverLoginButton/>
                            <KakaoLoginButton/>
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
                <Copyright sx={{mt: 8, mb: 4}}/>
            </Container>
        </ThemeProvider>
    );
}
