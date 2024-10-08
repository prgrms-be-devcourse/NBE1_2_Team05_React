// 공연 카드 컴포넌트
import React from 'react';
import './PerformanceCard.css'; // CSS 파일을 import합니다.
import { Link } from 'react-router-dom'; // Link 임포트

const PerformanceCard = ({ performanceId, memberName, imageUrl, title, startDateTime, endDateTime }) => {
    const defaultImageUrl = '/logo192.png'; // public 폴더에 있는 기본 이미지
    return (
        <div className="performance-card">

            <div className="parent-container">
                <div className="member-name">주최자 : {memberName}</div>
            </div>
            
            <Link to={`/performance/${performanceId}`} style={{ textDecoration: 'none' }}>
                <div className="image-container">
                    <img src={imageUrl || defaultImageUrl} alt="Performance" />
                </div>
            </Link>
            <h2 className="title">{title}</h2>
            <div className="date-container">
                <div className="date-container-detail">
                    <p className="date-label">시작 일시</p>
                    <p className="date">{startDateTime}</p>
                </div>
                <div className="date-container-detail">
                    <p className="date-label">끝 일시</p>
                    <p className="date">{endDateTime}</p>
                </div>
            </div>
        </div>
    );
};

export default PerformanceCard;