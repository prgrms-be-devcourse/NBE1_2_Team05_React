// // 로그인 상태 관리 커스텀 훅
// import {useEffect, useState} from 'react';
//
// export const useAuth = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
//
//     useEffect(() => {
//         const accessToken = localStorage.getItem('access_token');
//         const refreshToken = localStorage.getItem('refresh_token');
//
//         // 토큰이 있으면 로그인 상태로 설정
//         if (accessToken && refreshToken) {
//             setIsLoggedIn(true);
//         }
//     }, []);
//
//
//     const login = () => {
//         setIsLoggedIn(true);
//     };
//
//     const logout = () => {
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('refresh_token');
//         setIsLoggedIn(false);
//     };
//
//     return { isLoggedIn, login, logout };
// };
