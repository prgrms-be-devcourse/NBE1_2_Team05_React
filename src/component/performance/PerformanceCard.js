import React from 'react';
import './PerformanceCard.css'; // CSS 파일을 import합니다.
import { Link } from 'react-router-dom'; // Link 임포트
import { format, parseISO } from 'date-fns';
import { FiCalendar, FiMapPin } from 'react-icons/fi'; // 달력, 핀 아이콘 사용
import { GiTwoCoins } from 'react-icons/gi'; // 동전 모양 아이콘 사용

const PerformanceCard = ({ performanceId, imageUrl, title, startDateTime, endDateTime, price, address }) => {
    const defaultImageUrl = '/logo192.png'; // public 폴더에 있는 기본 이미지

    // 날짜 포맷팅 함수
    const formatDate = (dateString) => {
        const date = parseISO(dateString);
        return format(date, 'yy.MM.dd');
    };

    // 주소 포맷팅 함수 (시~구 혹은 10자리)
    const formatAddress = (addressString) => {
        const match = addressString.match(/^(.*?시\s.*?구)/);
        return match ? match[0] : addressString.slice(0, 10);
    };

    return (
        <div>
            <Link to={`/performance/${performanceId}`} style={{ textDecoration: 'none', color: 'inherit'}}>
                <div className="performance-card">
                        <div className="image-container">
                            <img src={imageUrl || defaultImageUrl} alt="Performance" className="performance-image" />
                        </div>
                    <h2 className="title">{title}</h2>

                    <div className="info-container">
                        <div className="date-container">
                            <FiCalendar className="calendar-icon" /> {/* 달력 아이콘 */}
                            <span className="date">{`${formatDate(startDateTime)} ~ ${formatDate(endDateTime)}`}</span>
                        </div>
                        <div className="address-container">
                            <FiMapPin className="address-icon" /> {/* 핀 아이콘 */}
                            <span className="address">{formatAddress(address)}</span>
                        </div>
                        <div className="price-container">
                            <GiTwoCoins className="price-icon" /> {/* 동전 모양 아이콘 */}
                            <span className="price">
                                {price > 0 ? `${price.toLocaleString()}원` : '무료'}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default PerformanceCard;
