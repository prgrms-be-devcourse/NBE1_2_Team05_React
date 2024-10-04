import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import HomePage from './page/HomePage';
import SigninPage from './page/member/SigninPage';
import SignupPage from './page/member/SignupPage';
import PerformanceDetailPage from './page/performance/PerformanceDetailPage';
import TicketPurchasePage from './page/ticket/TicketPurchasePage';
import UserProfilePage from './page/member/MemberProfilePage';
import Header from './component/Header';
import { useAuth } from './hook/useAuth';

function Layout() {
    const location = useLocation();
    const { isLoggedIn } = useAuth();

    // 헤더를 숨기고 싶은 경로들을 배열로 저장
    const noHeaderRoutes = ['/signin', '/signup'];

    return (
        <div>
            {/* 로그인 페이지와 회원가입 페이지를 제외한 모든 페이지에 헤더 렌더링 */}
            {!noHeaderRoutes.includes(location.pathname) && <Header />}

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signin" element={<SigninPage />} />
                <Route path="/signup" element={<SignupPage />} />

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
            <Layout />
        </Router>
    );
}

export default App;
