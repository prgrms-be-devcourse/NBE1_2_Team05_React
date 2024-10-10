import React, { createContext, useContext, useEffect, useState } from 'react';

// AuthContext 생성
const AuthContext = createContext();

// AuthProvider 컴포넌트 생성
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');

    // 로그인 상태를 확인하여 초기 상태 설정
    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        const storedUserName = localStorage.getItem('user_name');


        // 토큰이 있으면 로그인 상태로 설정
        if (accessToken && refreshToken) {
            setIsLoggedIn(true);
            setUserName(storedUserName);
        }
    }, []);

    const login = (name) => {
        setIsLoggedIn(true);
        setUserName(name);
        localStorage.setItem('user_name', name);
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_name');
        setIsLoggedIn(false);
        setUserName('');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userName,login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// AuthContext 사용을 위한 커스텀 훅
export const useAuth = () => {
    return useContext(AuthContext);
};
