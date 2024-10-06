import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SomunIcon from "../../assets/image/somun_icon.png";
import NaverLoginButton from "./NaverLoginButton";
import KakaoLoginButton from "./KakaoLoginButton";
import { validateEmailAndCheckDuplicate } from "../../api/userApi";
import {checkName} from "../../api/userApi";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="#">
                Social Culture
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [name, setName] = useState('');  // 닉네임 변수명 수정
    const [nameError, setNameError] = useState('');  // 닉네임 에러 메시지 변수명 수정

    const validateEmailFormat = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateName = (name) => {  // validateName 함수 수정
        const nameRegex = /^(?=.{3,10}$)(?!.*[ㄱ-ㅎㅏ-ㅣ])[a-zA-Z0-9가-힣]*$/;
        return nameRegex.test(name);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\d~!@#$%^&*()+|=]{8,16}$/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let isValid = true;

        const data = new FormData(event.currentTarget);
        const enteredEmail = data.get('email');
        const enteredPassword = data.get('password');
        const enteredName = data.get('name');  // 닉네임 변수명 수정

        // 이메일 검증
        if (!validateEmailFormat(enteredEmail)) {
            setEmailError("이메일 형식이 잘못되었습니다.");
            isValid = false;
        } else {
            try {
                const result = await validateEmailAndCheckDuplicate(enteredEmail);

                if (result.isInvalidFormat) {
                    setEmailError("이메일 형식이 잘못되었습니다.");
                } else if (result.isDuplicate) {
                    setEmailError("이미 사용 중인 이메일입니다.");
                } else {
                    setEmailError("");
                }
            } catch (error) {
                setEmailError("이메일 중복 확인에 실패했습니다. 다시 시도해주세요.")
            }
        }

        // 닉네임 검증
        if (!validateName(enteredName)) {  // validateName 호출
            setNameError("닉네임은 3자 이상 10자 이하의 한글, 영문, 숫자만 가능합니다.");
            isValid = false;
        } else {
            try {
                const result = await checkName(enteredName);

                if (result.isInvalidFormat) {
                    setNameError("닉네임 형식이 잘못되었습니다.");
                } else if (result.isDuplicate) {
                    setNameError("닉네임이 중복되었습니다.");
                } else {
                    setNameError("");
                }
            } catch (error){
                setNameError("닉네임 중복 확인에 실패했습니다. 다시 시도해주세요.")
            }
        }

        // 비밀번호 검증
        if (!validatePassword(enteredPassword)) {
            setPasswordError("비밀번호는 최소8~최대16자 영문자, 숫자, 특수문자 1개씩을 포함해야 합니다.");
            isValid = false;
        } else {
            setPasswordError("");
        }

        // 모든 유효성 검사를 통과하면 회원가입 로직을 실행
        if (isValid) {
            console.log({
                email: enteredEmail,
                password: enteredPassword,
                name: enteredName  // 닉네임 변수명 수정
            });
        }
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
                    <img src={SomunIcon} alt="소문 로고" style={{width: '40%', height: '40%', marginBottom: '10px'}}/>

                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="이메일"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    error={!!emailError}
                                    helperText={emailError}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="비밀번호"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    error={!!passwordError}
                                    helperText={passwordError}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="given-name"
                                    name="name"  // name으로 수정
                                    required
                                    fullWidth
                                    id="name"  // id도 name으로 수정
                                    label="닉네임"
                                    value={name}  // state 변수도 name으로 변경
                                    onChange={(e) => setName(e.target.value)}  // setName 호출
                                    error={!!nameError}
                                    helperText={nameError}  // nameError 표시
                                />
                            </Grid>
                        </Grid>
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
                                회원 가입
                            </Button>
                            <NaverLoginButton buttonText="네이버로 시작하기"/>
                            <KakaoLoginButton buttonText="카카오로 시작하기"/>
                        </Box>
                        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                            <Grid item>
                                <Link href="/signin" variant="body2">
                                    이미 계정이 있으신가요? 로그인
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{mt: 5}}/>
            </Container>
        </ThemeProvider>
    );
}
