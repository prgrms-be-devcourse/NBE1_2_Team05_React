// 인증 관리를 전역으로 관리하는 컨텍스트
import { useState, useEffect, createContext, useContext } from 'react';

// Context 생성
const AuthContext = createContext();

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가

    useEffect(() => {
        // 애플리케이션 로드 시 localStorage에서 토큰을 확인
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true); // 토큰이 있으면 로그인 상태로 설정
        }
        setLoading(false); // 로딩 완료
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token); // 로그인 시 토큰 저장
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('token'); // 로그아웃 시 토큰 삭제
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// useAuth 훅 정의
export const useAuth = () => {
    return useContext(AuthContext);
};