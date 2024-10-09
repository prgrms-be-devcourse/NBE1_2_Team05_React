import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";  // useAuth 사용
import { Stack } from "@mui/material";
import somunLogo from '../assets/image/somun.png';
import {Container} from "@mui/material";

// 페이지 및 링크 관리 객체
const PAGE_LINKS = {
    CATEGORY_1: { name: '카테고리1', link: '/category1' },
    CATEGORY_2: { name: '카테고리2', link: '/category2' },
    CATEGORY_3: { name: '카테고리3', link: '/category3' },
    SIGNIN: { name: '로그인', link: '/signin' },
    SIGNUP: { name: '회원가입', link: '/signup' },
    LOGOUT: { name: '로그아웃', link: '/' },
    MY_PAGE: { name: '마이페이지', link: '/mypage' },
    MY_TICKETS: { name: '나의 티켓', link: '/mytickets' },
    MANAGER_APPLY: { name: '공연관리자 신청', link: '/managerapply' },
};

const pages = [PAGE_LINKS.CATEGORY_1, PAGE_LINKS.CATEGORY_2, PAGE_LINKS.CATEGORY_3];
const settings = [PAGE_LINKS.MY_PAGE, PAGE_LINKS.MY_TICKETS, PAGE_LINKS.MANAGER_APPLY, PAGE_LINKS.LOGOUT];

function reducer(state, action) {
    switch (action.type) {
        case 'OPEN_NAV_MENU':
            return { ...state, anchorElNav: action.payload };
        case 'CLOSE_NAV_MENU':
            return { ...state, anchorElNav: null };
        case 'OPEN_USER_MENU':
            return { ...state, anchorElUser: action.payload };
        case 'CLOSE_USER_MENU':
            return { ...state, anchorElUser: null };
        default:
            return state;
    }
}

function Header() {
    const { isLoggedIn, logout } = useAuth();  // 로그인 상태 및 로그아웃 함수 사용
    const navigate = useNavigate();

    const [state, dispatch] = React.useReducer(reducer, {
        anchorElNav: null,
        anchorElUser: null,
    });

    const handleOpenNavMenu = (event) => {
        dispatch({ type: 'OPEN_NAV_MENU', payload: event.currentTarget });
    };

    const handleOpenUserMenu = (event) => {
        dispatch({ type: 'OPEN_USER_MENU', payload: event.currentTarget });
    };

    const handleCloseNavMenu = () => {
        dispatch({ type: 'CLOSE_NAV_MENU' });
    };

    const handleCloseUserMenu = () => {
        dispatch({ type: 'CLOSE_USER_MENU' });
    };

    const handlePageNavigation = (pageLink) => {
        handleCloseNavMenu();
        handleCloseUserMenu();

        if (pageLink.name === PAGE_LINKS.LOGOUT.name) {
            logout();  // 로그아웃 함수 호출
            navigate('/'); // 로그아웃 후 메인 페이지로 이동
        } else {
            navigate(pageLink.link);
        }
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'white' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/* 로고 */}
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'black',
                            textDecoration: 'none',
                        }}
                    >
                        <img src={somunLogo} alt="소문 로고" style={{ width: '100px', height: '60px', marginRight: '8px' }} />
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                onClick={() => handlePageNavigation(page)}
                                sx={{
                                    my: 2,
                                    color: 'black',
                                    display: 'block',
                                    '&:hover': {
                                        color: '#00008B',
                                        backgroundColor: '#E0E0E0'
                                    },
                                }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    {!isLoggedIn ? (
                        <Stack spacing={2} direction="row" alignItems="center">
                            <Button
                                sx={{ color: 'black', '&:hover': { backgroundColor: '#E0E0E0', color: '#00008B' } }}
                                onClick={() => handlePageNavigation(PAGE_LINKS.SIGNIN)}
                            >
                                로그인
                            </Button>
                            <Typography variant="body1" sx={{ mx: 1, color: 'black', userSelect: 'none' }}>
                                |
                            </Typography>
                            <Button
                                sx={{ color: 'black', '&:hover': { backgroundColor: '#E0E0E0', color: '#00008B' } }}
                                onClick={() => handlePageNavigation(PAGE_LINKS.SIGNUP)}
                            >
                                회원가입
                            </Button>
                        </Stack>
                    ) : (
                        <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="User Avatar" src="/static/images/avatar/2.jpg" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={state.anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(state.anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting.name} onClick={() => handlePageNavigation(setting)}>
                                        <Typography sx={{ textAlign: 'center' }}>{setting.name}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Header;
