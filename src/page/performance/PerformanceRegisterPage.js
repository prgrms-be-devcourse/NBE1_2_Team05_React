import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate import 추가
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import {
    Typography,
    Container,
    Grid,
    TextField,
    Button,
    Paper,
    Box,
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
import { fetchCategories, registerPerformanceData } from '../../api/performanceApi'; // API 함수 임포트

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

// 다음 우편번호 API 스크립트 추가
const loadDaumPostcodeScript = () => {
    const script = document.createElement('script');
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);
};

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
        latitude: '',
        longitude: '',
        description: '',
        maxAudience: '',
        price: '',
        categories: []
    });
    const [categories, setCategories] = useState([]);
    const [favoriteCategories, setFavoriteCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [hasChanges, setHasChanges] = useState(false); // 카테고리 변경 여부
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); // 미리보기 URL 저장
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar 상태
    const navigate = useNavigate(); // useNavigate 훅 사용

    useEffect(() => {
        loadDaumPostcodeScript(); // Daum 우편번호 API 스크립트 로드
        const getCategories = async () => {
            try {
                const data = await fetchCategories(); // ID로 데이터 요청
                console.log(data)
                setCategories(data);
            } catch (err) {
                setError(err.message);
            }
        };

        getCategories();
    }, []); // performanceId가 변경될 때마다 데이터 요청

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Form submitted', formData);

        // FormData 객체 생성
        const formDataToSend = new FormData();

        // JSON 데이터를 FormData에 추가
        formDataToSend.append('performanceData', new Blob([JSON.stringify({
            title: formData.title,
            dateStartTime: formData.dateStartTime,
            dateEndTime: formData.dateEndTime,
            location: formData.location,
            address: formData.address,
            latitude: formData.latitude,
            longitude: formData.longitude,
            description: formData.description,
            maxAudience: formData.maxAudience,
            price: formData.price,
            categories: selectedCategories,
        })], { type: 'application/json' }));

        // 이미지 파일을 FormData에 추가
        if (image) {
            formDataToSend.append('imageFile', image);
        }

        try {
            await registerPerformanceData(formDataToSend); // 공연 등록 함수 호출
            setSnackbarOpen(true); // 알림 켜기
            setTimeout(() => {
                navigate('/'); // 메인 페이지로 이동
            }, 2000); // 2초 후에 이동
        } catch (err) {
            setError(err.message); // 에러 처리
        }
    };

    const getCoordinatesFromAddress = (address) => {
      return new Promise((resolve, reject) => {
        const kakao = window.kakao;
        const geocoder = new kakao.maps.services.Geocoder();
        
        geocoder.addressSearch(address, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                resolve(coords);
            } else {
                reject('주소 검색 실패: ' + status);
            }
        });
      });
    };

    // 우편번호 검색 핸들러 함수
    const handleAddressSearch = async () => {
        new window.daum.Postcode({
            oncomplete: async (data) => {
                let fullAddress = data.address;
                let extraAddress = '';

                if (data.addressType === 'R') {
                    if (data.bname !== '') {
                        extraAddress += data.bname;
                    }
                    if (data.buildingName !== '') {
                        extraAddress += (extraAddress !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    fullAddress += (extraAddress !== '' ? ' (' + extraAddress + ')' : '');


                }

                // 검색된 주소를 폼 데이터에 반영
                setFormData(prevFormData => ({
                    ...prevFormData,
                    address: fullAddress
                }));

                // 주소를 이용해 좌표 검색
                try {
                  const coords = await getCoordinatesFromAddress(fullAddress);
                  console.log('좌표:', coords);
                  console.log('위도 경도: ', coords.getLat(), coords.getLng())

                  // 상태에 좌표 저장
                  setFormData(prevFormData => ({
                      ...prevFormData,
                      latitude: coords.getLat(),
                      longitude: coords.getLng()
                  }));
                } catch (error) {
                    console.error(error);
                }
            }
        }).open();
    };


    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // setImage(URL.createObjectURL(file)); // 미리보기 URL 생성
            setImage(file); // 파일 객체 저장
            setPreviewUrl(URL.createObjectURL(file)); // 미리보기 URL 생성
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

    // 카테고리 선택 핸들러
    const handleCategorySelect = (categoryId) => {
        let updatedCategories;
        if (selectedCategories.includes(categoryId)) {
            updatedCategories = selectedCategories.filter(id => id !== categoryId);
        } else if (selectedCategories.length < 3) {
            updatedCategories = [...selectedCategories, categoryId];
        } else {
            return;
        }

        setSelectedCategories(updatedCategories);
        // 기존 선호 카테고리와 비교하여 변경 사항 있는지 확인
        setHasChanges(!areArraysEqual(favoriteCategories.map(cat => cat.categoryId), updatedCategories));
    };

    // 배열 비교 함수 (순서와 상관없이 두 배열이 같은지 확인)
    const areArraysEqual = (arr1, arr2) => {
        if (arr1.length !== arr2.length) return false;
        const sortedArr1 = [...arr1].sort();
        const sortedArr2 = [...arr2].sort();
        return sortedArr1.every((value, index) => value === sortedArr2[index]);
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
                                    <DateTimePicker
                                        label="시작 날짜"
                                        value={formData.dateStartTime}
                                        onChange={(newValue) => setFormData({ ...formData, dateStartTime: newValue })}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <DateTimePicker
                                        label="종료 날짜"
                                        value={formData.dateEndTime}
                                        onChange={(newValue) => setFormData({ ...formData, dateEndTime: newValue })}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </Grid>
                            </Grid>
                            <TextFieldWithLabel
                                label="공연 장소"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                            <Button variant="text" color="primary" sx={{ mt: 1 }} onClick={handleAddressSearch}>
                                주소 검색하기
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
                                        label=" 티켓 금액"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" gutterBottom>
                                포스터 추가
                            </Typography>
                            <UploadBox onClick={triggerFileInput}>
                                {!previewUrl && ( // previewUrl이 없을 때만 아이콘과 텍스트를 표시
                                    <>
                                        <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                                        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                                            이미지를 업로드하세요
                                        </Typography>
                                    </>
                                )}
                                {previewUrl && (
                                    <img
                                        src={previewUrl}
                                        alt="uploaded"
                                        style={{
                                            marginTop: '10px',
                                            maxWidth: '100%',
                                            maxHeight: '100%',
                                            objectFit: 'cover', // 박스 영역을 유지하며 이미지를 잘 맞추기 위해 사용
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    />
                                )}
                            </UploadBox>

                            <input
                                type="file"
                                id="fileInput"
                                accept=".jpg,.jpeg,.png,.gif,.bmp"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />

                            <Button fullWidth variant="contained" color="secondary" sx={{ mt: 2, mb: 5 }} onClick={triggerFileInput}>
                                추가 버튼
                            </Button>

                            {/* 카테고리 선택 버튼들 */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                                {categories.map((category) => {
                                    const isSelected = selectedCategories.includes(category.categoryId);
                                    return (
                                        <Button
                                            key={category.categoryId}
                                            variant="contained"
                                            onClick={() => handleCategorySelect(category.categoryId)}
                                            sx={{
                                                backgroundColor: isSelected ? '#007bff' : '#f0f0f0',
                                                color: isSelected ? '#fff' : '#000',
                                                borderRadius: '20px',
                                                padding: '10px 20px',
                                                fontSize: '14px',
                                                textTransform: 'none',
                                            }}
                                        >
                                            {category.nameKr}
                                        </Button>
                                    );
                                })}
                            </Box>


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