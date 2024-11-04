import React from 'react';
import './PerformanceCard.css';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { FiCalendar, FiMapPin } from 'react-icons/fi';
import { GiTwoCoins } from 'react-icons/gi';

const PerformanceCard = ({
                             performanceId,
                             imageUrl = '',
                             title,
                             startDateTime,
                             endDateTime,
                             price,
                             address,
                             remainingTicket,
                             onClick,
                             isDragging,
                         }) => {
    const defaultImageUrl = '/logo192.png';
    console.log(performanceId, imageUrl, title, startDateTime, endDateTime, price, address, remainingTicket, onClick, isDragging)

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
            <Link
                to={isDragging ? '#' : `/performance/${performanceId}`} // 드래그 중이면 링크 비활성화
                onClick={(e) => {
                    if (isDragging) {
                        e.preventDefault();
                        e.stopPropagation(); // 이벤트 전파 방지
                    } else if (onClick) {
                        onClick(e);
                    }
                }}
                style={{ textDecoration: 'none', color: 'inherit' }}
            >
                <div className="performance-card">
                    <div className="image-container">
                        <img
                            src={imageUrl || defaultImageUrl}
                            alt="Performance"
                            className="performance-image"
                        />
                    </div>
                    <h2 className="title">{title}</h2>

                    <div className="info-container">
                        <div className="date-container">
                            <FiCalendar className="calendar-icon" />
                            <span className="date">{`${formatDate(
                                startDateTime
                            )} ~ ${formatDate(endDateTime)}`}</span>
                        </div>
                        <div className="address-container">
                            <FiMapPin className="address-icon" />
                            <span className="address">{formatAddress(address)}</span>
                        </div>
                        <div className="price-container">
                            <div>
                                <GiTwoCoins className="price-icon" />
                                <span className="price">
                                    {price > 0 ? `${price.toLocaleString()}원` : '무료'}
                                </span>
                            </div>
                            <div>
                                {/* remainingTicket에 따라 마감 상태를 블럭으로 표시 */}
                                {remainingTicket <= 10 && remainingTicket > 0 && (
                                    <div className="status-block warning">마감임박</div>
                                )}
                                {remainingTicket === 0 && price !== 0 && (
                                    <div className="status-block closed">마감</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default PerformanceCard;
