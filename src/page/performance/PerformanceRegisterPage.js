import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate import 추가
import { 
  Typography, 
  Container, 
  Grid, 
  TextField, 
  Button, 
  Paper, 
  IconButton,
  InputAdornment,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import dayjs from 'dayjs';
import { registerPerformanceData } from '../../api/performanceApi'; // API 함수 임포트

const UploadBox = styled(Paper)(({ theme }) => ({
  height: '200px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const DatePickerField = ({ label, value, onChange }) => (
    <DatePicker
      label={label}
      value={value}
      onChange={onChange}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <CalendarTodayIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
  
  const TextFieldWithLabel = ({ label, ...props }) => (
    <TextField
      fullWidth
      label={label}
      variant="outlined"
      margin="normal"
      {...props}
    />
  );

const PerformanceRegisterPage = () => {
    const [formData, setFormData] = useState({
        dateStartTime: dayjs(),
        dateEndTime: dayjs(),
        title: '',
        location: '',
        address: '',
        description: '',
        maxAudience: '',
        organizer: '',
      });
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar 상태
    const navigate = useNavigate(); // useNavigate 훅 사용
  
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Form submitted', formData);

        try {
            await registerPerformanceData(formData); // 공연 등록 함수 호출
            setSnackbarOpen(true); // 알림 켜기
            setTimeout(() => {
                navigate('/'); // 메인 페이지로 이동
            }, 2000); // 2초 후에 이동
        } catch (err) {
            setError(err.message); // 에러 처리
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          setImage(URL.createObjectURL(file)); // 미리보기 URL 생성
        }
    };

    const triggerFileInput = () => {
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
          fileInput.click(); // 파일 선택 창 열기
        } else {
          console.error('File input not found');
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false); // Snackbar 닫기
    };
  
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            공연 게시글 생성
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <TextFieldWithLabel 
                    label="공연 제목" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DatePickerField
                      label="시작 날짜"
                      value={formData.startDate}
                      onChange={(newValue) => setFormData({ ...formData, startDate: newValue })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePickerField
                      label="종료 날짜"
                      value={formData.endDate}
                      onChange={(newValue) => setFormData({ ...formData, endDate: newValue })}
                    />
                  </Grid>
                </Grid>
                <TextFieldWithLabel 
                label="공연 장소" 
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
                <Button variant="text" color="primary" sx={{ mt: 1 }}>
                  우편번호 찾기
                </Button>
                <TextFieldWithLabel 
                label="세부 주소" 
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                <TextFieldWithLabel 
                label="공연 소개" 
                multiline 
                rows={4} 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextFieldWithLabel 
                        label="제한 인원" 
                        type="number"
                        value={formData.maxAudience}
                        onChange={(e) => setFormData({ ...formData, maxAudience: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextFieldWithLabel 
                        label="주최자" 
                        value={formData.organizer}
                        onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="h6" gutterBottom>
                  포스터 추가
                </Typography>
                <UploadBox onClick={triggerFileInput}>
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    이미지를 업로드하세요
                  </Typography>
                  {image && <img src={image} alt="uploaded" style={{ marginTop: '10px', maxWidth: '100%', height: 'auto' }} />}
                </UploadBox>
                <input 
                    type="file" 
                    id="fileInput"
                    accept="image/*" 
                    onChange={handleImageChange} 
                    style={{ display: 'none' }} 
                />
                <Button fullWidth variant="contained" color="secondary" sx={{ mt: 2 }} onClick={triggerFileInput}>
                  추가 버튼
                </Button>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 4 }}
            >
              등록
            </Button>
          </form>
          <Snackbar
            open={snackbarOpen}
            onClose={handleSnackbarClose}
            message="공연이 등록되었습니다!"
            autoHideDuration={2000} // 2초 후 자동으로 숨김
          />
        </Container>
      </LocalizationProvider>
    );
  };
  
  export default PerformanceRegisterPage;