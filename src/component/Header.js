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

import { useAuth } from "../context/AuthContext";
import {Stack} from "@mui/material";

import somunLogo from '../assets/image/somun.png';

// 페이지 및 링크 관리 객체
const PAGE_LINKS = {
    CATEGORY_1: {name: '카테고리1', link: '/category1'},
    CATEGORY_2: {name: '카테고리2', link: '/category2'},
    CATEGORY_3: {name: '카테고리3', link: '/category3'},

    // 로그인
    SIGNIN: { name: '로그인', link: '/signin' },
    SIGNUP: { name: '회원가입', link: '/signup' },

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
        default:
            return state;
    }
}

function Header() {
    const { isLoggedIn, userName, logout, loading } = useAuth();
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
        // alert(`Navigating to: ${pageLink.name}`);  // 페이지 이름을 알림으로 띄움

        if (pageLink.name === PAGE_LINKS.LOGOUT.name) { // 현재 누른 버튼이 로그아웃이면,
            logout(); // 로그아웃 함수 호출
            navigate('/');
        } else {
           navigate(pageLink.link);  // 페이지 이동
        }
    };

    // 로딩 중일 때는 UI를 표시하지 않음
    if (loading) return null;

    return (
        <AppBar position="static" sx={ {backgroundColor: 'white'} }>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    {/*<AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />*/} {/*확장 로고 아이콘*/}
                    {/*<AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'black' }} />*/}
{/*                    <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2, alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
                        <img src={somunLogo} alt="소문 로고" style={{ width: '40px', height: '40px' }} />
                    </Box>*/}
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: {xs: 'none', md: 'flex'},
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            /*color: 'inherit',*/
                            color: 'black',
                            textDecoration: 'none',
                        }}
                    >
                        <img src={somunLogo} alt="소문 로고" style={{width: '100px', height: '60px', marginRight: '8px'}}/>
                    </Typography>

                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}> {/*축소 카테고리*/}
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon sx={{ color: 'black' }} />
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

                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: {xs: 'flex', md: 'none'},
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            /*color: 'inherit',*/
                            color: 'black',
                            textDecoration: 'none',
                        }}
                    >
                        <img src={somunLogo} alt="소문 로고" style={{width: '100px', height: '60px', marginRight: '8px'}}/>
                    </Typography>

                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}> {/* 확장 카테고리*/}
                        {pages.map((page) => (
                            <Button
                                key={page.name}
                                onClick={() => handlePageNavigation(page)}
                                /*sx={{ my: 2, color: 'white', display: 'block' }}*/
                                sx={{
                                    my: 2,
                                    /*color: 'white',*/
                                    color: 'black',
                                    display: 'block',
                                    '&:hover': {
                                        color: '#00008B',
                                        backgroundColor: '#E0E0E0' // 마우스 호버 시 배경을 조금 더 진하게
                                    }, // 마우스 포인터가 들어갈 때 글자 색 변경
                                }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    {!isLoggedIn ? (
                        <Stack spacing={2} direction="row" alignItems="center"> {/* alignItems로 수직 정렬을 맞춤 */}
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Button
                                    variant="text"
                                    sx={{color: 'black', '&:hover': { backgroundColor: '#E0E0E0', color: '#00008B' }}}
                                    onClick={() => handlePageNavigation(PAGE_LINKS.SIGNIN)}
                                >
                                    로그인
                                </Button>
                                <Typography variant="body1" sx={{ mx: 1, color: 'black', userSelect: 'none' }}>
                                    |
                                </Typography>  {/* 구분자 */}
                                <Button
                                    variant="text"
                                    sx={{color: 'black', '&:hover': { backgroundColor: '#E0E0E0', color: '#00008B' }}}
                                    onClick={() => handlePageNavigation(PAGE_LINKS.SIGNUP)}
                                >
                                    회원가입
                                </Button>
                            </Box>
                        </Stack>
                    ) : (
                        <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}> {/*로그인 후*/}
                            <Typography sx={{ mr: 2, color: 'black' }}>
                                {userName} 님 반갑습니다. {/* 사용자 이름을 출력 */}
                            </Typography>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg"/>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{mt: '45px'}}
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
                                        <Typography sx={{textAlign: 'center'}}>{setting.name}</Typography>
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
