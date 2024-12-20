import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import AllPerformancePage from './page/AllPerformancePage';
import SigninPage from './page/member/SigninPage';
import SignupPage from './page/member/SignupPage';
import PerformanceRegisterPage from './page/performance/PerformanceRegisterPage';
import PerformanceDetailPage from './page/performance/PerformanceDetailPage';
import PerformanceFinderPage from './page/performance/PerformanceFinderPage';
import UserProfilePage from './page/member/MemberProfilePage';
import {useAuth} from "./context/AuthContext";
import NicknamePage from "./page/member/NicknamePage";
import MemberCategoryPage from "./page/member/MemberCategoryPage";
import Header from "./component/Header";
import {AuthProvider} from "./context/AuthContext";
import KakaoCallback from "./page/member/KakaoCallback";
import NaverCallBack from "./page/member/NaverCallBack";
import MemberProfilePage from "./page/member/MemberProfilePage";
import TicketPaymentPage from "./page/ticket/TicketPaymentPage";
import CommentTestPage from "./page/CommentTestPage";
import { useParams } from 'react-router-dom';
import MemberRoleChangePage from "./page/member/MemberRoleChangePage";
import {WidgetSuccessPage} from "./component/ticket/payment/WidgetSuccess";
import {FailPage} from "./component/ticket/payment/Fail";
import HomePage from "./page/HomePage";



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
                <Route path="/all" element={<AllPerformancePage />} />
                <Route path="/signin" element={<SigninPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/nickname" element={<NicknamePage />} />
                <Route path="/member/category" element={<MemberCategoryPage />} />
                <Route path="/payment" element={<TicketPaymentPage/>}/>
                <Route path="/member/profile" element={<MemberProfilePage/>}/>
                <Route path="/kakao-callback" element={<KakaoCallback />} />
                <Route path="/naver-callback" element={<NaverCallBack />} />
                <Route path="/member/role" element={<MemberRoleChangePage />} />
                <Route path="/" element={<HomePage />} />

                {/*결제 리다이랙트 페이지*/}
                <Route path="/widget/success" element={<WidgetSuccessPage />} />
                <Route path="/fail" element={<FailPage />} />

                <Route path="/performance/finder" element={<PerformanceFinderPage />} />

                {/* 로그인 여부에 따라 페이지 접근 제한 */}
                <Route path="/performance/:performanceId" element={<PerformanceDetailPage />} />
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

const CommentTestPageWrapper = () => {
    const { performanceId } = useParams();
    return <CommentTestPage performanceId={performanceId} />;
};

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
