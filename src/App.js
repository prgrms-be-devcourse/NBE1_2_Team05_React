import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import HomePage from './page/HomePage';
import SigninPage from './page/member/SigninPage';
import SignupPage from './page/member/SignupPage';
import PerformanceRegisterPage from './page/performance/PerformanceRegisterPage';
import UserProfilePage from './page/member/MemberProfilePage';
import { useAuth } from './hook/useAuth';
import NicknamePage from "./page/member/NicknamePage";
import MemberCategoryPage from "./page/member/MemberCategoryPage";
import Header from "./component/Header";
import {AuthProvider} from "./context/AuthContext";
import MemberProfilePage from "./page/member/MemberProfilePage";
import TicketPaymentPage from "./page/ticket/TicketPaymentPage";

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
                <Route path="/payment" element={<TicketPaymentPage/>}/>
                <Route path="/member/profile" element={<MemberProfilePage/>}/>

                {/* 로그인 여부에 따라 페이지 접근 제한 */}
                <Route
                    path="/performance/register"
                    element={isLoggedIn ? <PerformanceRegisterPage /> : <Navigate to ="/signin" />}
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
