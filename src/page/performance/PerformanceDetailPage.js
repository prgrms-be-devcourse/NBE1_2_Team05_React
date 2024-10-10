// 공연 상세 정보 페이지
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDetailData } from '../../api/performanceApi'; // API 요청 함수
import CommentList from '../../component/comment/CommentList'
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Popover,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Link,
  Dialog,
  DialogContent
} from '@mui/material';

export default function PerformanceDetailPage() {
  const { performanceId } = useParams(); // URL에서 performanceId 가져오기
  const [performanceData, setPerformanceData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAttendees, setSelectedAttendees] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false); // Dialog 상태 관리
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const getPerformanceDetails = async () => {
      try {
        console.log(performanceId);
        const data = await fetchDetailData(performanceId); // ID로 데이터 요청
        console.log(data)
        setPerformanceData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getPerformanceDetails();
  }, [performanceId]); // performanceId가 변경될 때마다 데이터 요청

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!performanceData) return <div>No data available</div>;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectAttendees = (number) => {
    setSelectedAttendees(number);
    handleClose();
  };

  const handleImageClick = () => {
    setSelectedImage('/logo192.png'); // 클릭한 이미지 URL 설정
    setOpenDialog(true); // Dialog 열기
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Dialog 닫기
  };

  const open = Boolean(anchorEl);
  const id = open ? 'attendees-popover' : undefined;

  return (
    <Container maxWidth="900px">
      <Paper elevation={3} sx={{ p: 3, my: 3 }}>
        <Typography variant="h5" gutterBottom>
          {performanceData.title}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>공연소개</Typography>
            <Typography paragraph marginTop={'20px'}>
              {performanceData.description}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>멀티미디어</Typography>
            <Link href="https://www.youtube.com" target="_blank" rel="noopener">
                <Paper 
                sx={{ 
                    height: 150, 
                    width: 150,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 2,
                    cursor: 'pointer',
                    position: 'relative', 
                    backgroundImage: 'url("/youtube_icon.png")', // 유튜브 아이콘 URL
                    backgroundSize: 'contain', // 아이콘 크기 조정
                    backgroundPosition: 'center', // 아이콘 중앙 정렬
                    backgroundRepeat: 'no-repeat', // 아이콘 반복 방지
                    boxShadow: 'none', // 그림자 제거
                    bgcolor: 'transparent' // 배경 색상 투명
                  }}
                >
                </Paper>
            </Link>
          </Grid>
          <Grid item md={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <img 
                src="/logo192.png" 
                alt="Performance Image" 
                style={{ width: '100%', height: '100%', cursor: 'pointer' }} // 커서 포인터 추가
                onClick={handleImageClick} // 클릭 핸들러 추가
              />
          </Grid>
        </Grid>

        {/* Dialog 컴포넌트 추가 */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogContent sx={{ display: 'flex', justifyContent: 'center' }}>
            <img 
              src={selectedImage} 
              alt="Enlarged" 
              style={{ width: '100%', height: 'auto' }} // 이미지 크기 조정
            />
          </DialogContent>
        </Dialog>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <Typography sx={{marginRight:'100px', marginBottom:'20px', color: 'grey.500'}}>{performanceData.remainingTickets} / {performanceData.maxAudience} </Typography>
          <Box>
            <Button variant="contained" onClick={handleClick} sx={{ mr: 1 }}>
              인원 선택 ({selectedAttendees})
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <List>
                {[...Array(performanceData.maxAudience)].map((_, index) => (
                  <ListItem button key={index + 1} onClick={() => handleSelectAttendees(index + 1)}>
                    <ListItemText primary={`${index + 1}명`} />
                  </ListItem>
                ))}
              </List>
            </Popover>
            {/* 공연 티켓 구매 클릭 시 티켓 결재 창으로 링크하는 플로우 구현해야함 */}
            <Button variant="outlined">공연 티켓 구매</Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1">공연 일시</Typography>
            <Typography>{performanceData.startDateTime} ~ {performanceData.endDateTime}</Typography>
          </Grid>
          <Grid item xs={15} sm={5}>
            <Typography variant="subtitle1">장소</Typography>
            <Typography>{performanceData.address}</Typography>
          </Grid>
          <Grid item xs={5} sm={2}>
            <Typography variant="subtitle1">가격</Typography>
            <Typography>{performanceData.price}원</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1">공연 리뷰</Typography>
            <Typography>...</Typography>
        </Grid>
        {/* 댓글 컴포넌트 추가 */}
        <CommentList performanceId={performanceId} />
      </Paper>
    </Container>
  );
}