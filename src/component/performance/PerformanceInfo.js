// 공연 정보 컴포넌트
// author : ycjung
import {Typography} from '@mui/material';

export function PerformanceInfo({ title, time, remainingTickets }) {
    return (
        <>
            <Typography variant="h5" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body1" gutterBottom>
                시간: {time}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                남은 티켓: {remainingTickets > 0 ? `${remainingTickets}장` : "매진"}
            </Typography>
        </>
    );
}