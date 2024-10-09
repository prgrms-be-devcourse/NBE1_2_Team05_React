import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import HomePage from './page/HomePage';
import SigninPage from './page/member/SigninPage';
import SignupPage from './page/member/SignupPage';
import PerformanceDetailPage from './page/performance/PerformanceDetailPage';
import TicketPurchasePage from './page/ticket/TicketPurchasePage';
import UserProfilePage from './page/member/MemberProfilePage';
import { useAuth } from './hook/useAuth';
import NicknamePage from "./page/member/NicknamePage";
import MemberCategoryPage from "./page/member/MemberCategoryPage";
import Header from "./component/Header";
import {AuthProvider} from "./context/AuthContext";
import KakaoCallback from "./page/member/KakaoCallback";
import NaverCallBack from "./page/member/NaverCallBack";

function Layout() {
    const location = useLocation();
    const { isLoggedIn } = useAuth();

    // 헤더를 숨기고 싶은 경로들을 배열로 저장
    const noHeaderRoutes = ['/signin', '/signup', '/nickname', '/member/category'];

    return (
        <div>
            {/* 로그인 페이지와 회원가입 페이지를 제외한 모든 페이지에 헤더 렌더링 */}
            {!noHeaderRoutes.includes(location.pathname) && <Header />}

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signin" element={<SigninPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/nickname" element={<NicknamePage />} />
                <Route path="/member/category" element={<MemberCategoryPage />} />
                <Route path="/kakao-callback" element={<KakaoCallback />} />
                <Route path="/naver-callback" element={<NaverCallBack />} />


                {/* 로그인 여부에 따라 페이지 접근 제한 */}
                <Route
                    path="/performance/:id"
                    element={isLoggedIn ? <PerformanceDetailPage /> : <Navigate to="/signin" />}
                />
                <Route
                    path="/purchase/:ticketId"
                    element={isLoggedIn ? <TicketPurchasePage /> : <Navigate to="/signin" />}
                />
                <Route
                    path="/profile"
                    element={isLoggedIn ? <UserProfilePage /> : <Navigate to="/signin" />}
                />
            </Routes>
        </div>
    );
}

function App() {
    return (
        <Router>
            <AuthProvider>
                <Layout />
            </AuthProvider>
        </Router>
    );
}

export default App;
