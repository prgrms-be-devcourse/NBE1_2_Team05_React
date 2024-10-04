// 홈페이지 메인 화면
import React from 'react';
import PerformanceCard from '../component/performance/PerformanceCard';

const HomePage = () => {
    // 공연 데이터를 불러와서 렌더링
    return (
        <div>
            <h1>공연 목록</h1>
            <div className="performance-list">
                {/* PerformanceCard 컴포넌트로 공연 정보 렌더링 */}
            </div>
        </div>
    );
};

export default HomePage;
