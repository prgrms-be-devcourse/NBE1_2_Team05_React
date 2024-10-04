import React from 'react';
import { Link } from 'react-router-dom';
import UserMenu from './member/MemberMenu';
import { useAuth } from '../hook/useAuth';

const Header = () => {
    const { isLoggedIn } = useAuth();

    return (
        <header>
            <nav>
                <Link to="/">소셜 문화 공간</Link>
                <Link to="/performances">공연</Link>
                {isLoggedIn ? (
                    <UserMenu />
                ) : (
                    <>
                        <Link to="/signin">로그인</Link>
                        <Link to="/signup">회원가입</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
