import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import {useNavigate} from "react-router-dom";

import SiginPage from '../page/member/SignupPage';
import SigupPage from '../page/member/SignupPage';

// 페이지 및 링크 관리 객체
const PAGE_LINKS = {
    CATEGORY_1: {name: '카테고리1', link: '/category1'},
    CATEGORY_2: {name: '카테고리2', link: '/category2'},
    CATEGORY_3: {name: '카테고리3', link: '/category3'},

    // 로그인
    LOGIN: { name: '로그인', link: '/login' },
    SIGNUP: { name: '회원가입', link: '/signup' },
    CUSTOMER_SUPPORT: { name: '고객센터', link: '/customer-support' },

    // 비 로그인
    MY_PAGE: {name: '마이페이지', link: '/mypage'},
    MY_TICKETS: {name: '나의 티켓', link: '/mytickets'},
    MANAGER_APPLY: {name: '공연관리자 신청', link: '/managerapply'},
    LOGOUT: {name: '로그아웃', link: '/logout'},
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
        case 'RENDER_SIGNIN_PAGE':
            return { ...state, currentPage: 'signin' };
        case 'RENDER_SIGNUP_PAGE':
            return { ...state, currentPage: 'signup' };
        default:
            return state;
    }
}

function ResponsiveAppBar() {
    const [auth, setAuth] = React.useState(false);

    const [state, dispatch] = React.useReducer(reducer, {
        anchorElNav: null,
        anchorElUser: null,
        currentPage: null, // 현재 페이지 상태
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

    const navigate = useNavigate();

    const handlePageNavigation = (pageLink) => {
        alert(`Navigating to: ${pageLink.name}`);  // 페이지 이름을 알림으로 띄움
        navigate(pageLink.link);  // 페이지 이동
        handleCloseNavMenu();
        handleCloseUserMenu();
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> {/*확장 로고 아이콘*/}
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
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        소문
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}> {/*축소 카테고리*/}
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>

                        <Menu
                            id="menu-appbar"
                            anchorEl={state.anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(state.anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem
                                    key={page.name}
                                    onClick={() => handlePageNavigation(page)}  // handlePageNavigation 호출
                                >
                                    <Typography sx={{ textAlign: 'center' }}>{page.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> {/*축소 로고 아이콘*/}
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        소문
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}> {/* 확장 카테고리*/}
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                onClick={() => handlePageNavigation(page)}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    {!auth && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button color="inherit" onClick={() => handlePageNavigation(PAGE_LINKS.LOGIN)}>로그인</Button>
                            <Typography variant="body1" sx={{ mx: 1 }}>|</Typography>
                            <Button color="inherit" onClick={() => handlePageNavigation(PAGE_LINKS.SIGNUP)}>회원가입</Button>
                            <Typography variant="body1" sx={{ mx: 1 }}>|</Typography>
                            <Button color="inherit" onClick={() => handlePageNavigation(PAGE_LINKS.CUSTOMER_SUPPORT)}>고객센터</Button>
                        </Box>
                    )}

                    {auth &&
                        <Box sx={{ flexGrow: 0 }}> {/*로그인 후*/}
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
                    }

                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;
