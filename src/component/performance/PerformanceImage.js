// 공연 이미지 컴포넌트
// author : ycjung
import {Box} from '@mui/material';

export function PerformanceImage({ imageUrl }) {
    return (
        <Box
            sx={{
                width: '100%',
                height: { xs: 400, md: 350 },
                backgroundColor: '#f0f0f0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 2,
                overflow: 'hidden',
            }}
        >
            <img
                src={imageUrl}
                alt="공연 이미지"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }}
            />
        </Box>
    );
}