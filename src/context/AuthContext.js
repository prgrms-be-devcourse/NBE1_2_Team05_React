// 인증 관리를 전역으로 관리하는 컨텍스트
import { useState, useEffect, createContext, useContext } from 'react';

// Context 생성
const AuthContext = createContext();

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [userName, setUserName] = useState(''); // 사용자 이름 상태 추가

    useEffect(() => {
        // 애플리케이션 로드 시 localStorage에서 토큰을 확인
        const token = localStorage.getItem('token');
        const storedUserName = localStorage.getItem('userName'); // 사용자 이름도 저장

        if (token) {
            setIsLoggedIn(true); // 토큰이 있으면 로그인 상태로 설정
            setUserName(storedUserName || ''); // 저장된 사용자 이름을 설정
        }
        setLoading(false); // 로딩 완료
    }, []);

    const login = (token, name) => {
        localStorage.setItem('token', token); // 로그인 시 토큰 저장
        localStorage.setItem('userName', name); // 사용자 이름 저장

        setIsLoggedIn(true);
        setUserName(name); // 상태에 사용자 이름 설정
    };

    const logout = () => {
        localStorage.removeItem('token'); // 로그아웃 시 토큰 삭제
        localStorage.removeItem('userName'); // 사용자 이름 삭제

        setIsLoggedIn(false);
        setUserName(''); // 사용자 이름 상태 초기화
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userName, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// useAuth 훅 정의
export const useAuth = () => {
    return useContext(AuthContext);
};