import React, { useState, useEffect } from 'react';
import axios from "../../api/axiosInterceptor";
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'; // 로딩 애니메이션
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SomunIcon from '../../assets/image/somun_icon.png';
import { useAuth } from "../../context/AuthContext";
import { getMemberInfo } from '../../api/userApi'; // 사용자 정보를 가져오는 함수

const theme = createTheme();

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

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function MemberRoleChangePage() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isEmailSubmitted, setIsEmailSubmitted] = useState(false); // 이메일 제출 여부 확인
    const [verificationCode, setVerificationCode] = useState(''); // 인증코드 상태
    const [timeLeft, setTimeLeft] = useState(300); // 타이머: 300초 (5분)
    const [isRolePadmin, setIsRolePadmin] = useState(false); // 공연관리자 권한 확인
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');
    const [loading, setLoading] = useState(false); // 로딩 상태
    const { login } = useAuth();
    const navigate = useNavigate();

    const validateEmailFormat = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    // 사용자 권한 확인
    useEffect(() => {
        const fetchMemberInfo = async () => {
            try {
                const memberInfo = await getMemberInfo();
                if (memberInfo.role === "공연 관리자") {
                    setIsRolePadmin(true); // 이미 공연관리자 권한이 있으면 상태를 업데이트
                }
            } catch (error) {
                console.error("사용자 정보를 가져오는 중 오류 발생", error);
            }
        };

        fetchMemberInfo();
    }, []);

    // 이메일 제출 후 타이머 시작
    useEffect(() => {
        if (isEmailSubmitted && timeLeft > 0) {
            const timerId = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timerId);
        }
    }, [isEmailSubmitted, timeLeft]);

    // 타이머 포맷팅 (분:초)
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        let isValid = true;
        setEmailError('');

        if (!validateEmailFormat(email)) {
            setEmailError("유효하지 않은 이메일 형식입니다.");
            isValid = false;
        }

        if (!isValid) {
            setSnackbarSeverity('error');
            setSnackbarMessage("입력한 정보를 다시 확인해주세요.");
            setOpenSnackbar(true);
            return;
        }

        // 로딩 시작
        setLoading(true);

        // 이메일 제출 상태로 변경
        setIsEmailSubmitted(true);

        try {
            const emailData = { email: email };
            await axios.post('http://localhost:8080/api/v1/emails/code', emailData);

            setSnackbarSeverity('success');
            setSnackbarMessage("인증코드가 발송되었습니다. 인증코드를 입력해주세요.");
            setOpenSnackbar(true);
        } catch (error) {
            if (error.response && error.response.status === 409) {
                // 409 에러 처리 - 이미 인증에 사용된 이메일인 경우
                setSnackbarSeverity('error');
                setSnackbarMessage("이미 인증에 사용된 이메일입니다.");
                setIsEmailSubmitted(false);  // 이메일 필드 다시 활성화
            } else {
                setSnackbarSeverity('error');
                setSnackbarMessage("이메일 발송 중 오류가 발생했습니다. 다시 시도해주세요.");
            }
            setOpenSnackbar(true);
        } finally {
            // 로딩 종료
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        try {
            setLoading(true); // 인증 중 로딩 시작
            const verifyData = { code: verificationCode };
            await axios.post('http://localhost:8080/api/v1/emails/verify', verifyData);

            setSnackbarSeverity('success');
            setSnackbarMessage("이메일 인증에 성공했습니다.");
            setOpenSnackbar(true);

            setTimeout(() => {
                navigate(-1);
            }, 1000);
        } catch (error) {
            setSnackbarSeverity('error');
            setSnackbarMessage("인증코드가 잘못되었습니다.");
            setOpenSnackbar(true);
        } finally {
            setLoading(false); // 로딩 종료
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
                    <img
                        src={SomunIcon}
                        alt="소문 로고"
                        style={{ width: '40%', height: '40%', marginBottom: '10px', cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                    />

                    {/* 공연관리자 권한이 있으면 안내 메시지 */}
                    {isRolePadmin ? (
                        <>
                            <Typography variant="h6" gutterBottom sx={{ mt: 4, textAlign: 'center' }}>
                                현재 공연관리자 권한입니다.
                            </Typography>
                            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                                공연 관리자 권한으로 수정이 안되셨다면 관리자에게<br/>
                                문의바랍니다.
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{ mt: 10, mb: 0 ,width: '200px'}}
                                onClick={() => navigate(-1)} // 이전 페이지로 이동
                            >
                                뒤로가기
                            </Button>
                        </>
                    ) : (
                        // 공연관리자 권한이 없는 경우 인증 절차 진행
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="인증받을 이메일을 입력해주세요"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={!!emailError}
                                helperText={emailError}
                                disabled={isEmailSubmitted} // 이메일 제출 후 비활성화
                            />

                            {isEmailSubmitted && (
                                <>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="verificationCode"
                                        label="인증코드를 입력해주세요"
                                        name="verificationCode"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                    />
                                    <Typography variant="body2" color="text.secondary" align="right">
                                        남은 시간: {formatTime(timeLeft)}
                                    </Typography>
                                </>
                            )}

                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 2,
                                    width: '100%'
                                }}
                            >
                                {isEmailSubmitted ? (
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 0 }}
                                        onClick={handleVerify}
                                    >
                                        인증하기
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 0 }}
                                    >
                                        인증코드 받기
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
                {/* 로딩 중일 때 표시되는 백드롭과 로딩 애니메이션 */}
                <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
}
