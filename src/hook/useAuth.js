// 로그인 상태 관리 커스텀 훅
import { useState } from 'react';

export const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리

    const login = () => {
        setIsLoggedIn(true);
    };

    const logout = () => {
        setIsLoggedIn(false);
    };

    return { isLoggedIn, login, logout };
};
