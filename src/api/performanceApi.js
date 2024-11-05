import axios from './axiosInterceptor';

const API_URL = 'http://localhost:8080/api/v1'; // 기본 API URL
const itemsPerPage = 16; // 페이지당 아이템 수
const performancesPerPage = 6; //페이지당 공연 수
const totalItems = 100; // 총 아이템 수 (예시로 100개)

// 기본 이미지 URL
const defaultImageUrl = 'http://121.88.130.215:8888/upload/pfmPoster/acf26351-277d-4c53-a9b2-3c1d253ef8e4.gif';

// 카테고리 데이터 조회
export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/members/categories`); // 카테고리 API 호출
        return response.data.result.map(item => ({
            categoryId: item.categoryId,
            nameKr: item.nameKr,
            nameEn: item.nameEn,
        }));
    } catch (err) {
        throw new Error(err.message);
    }
};

// 전체 데이터 조회
export const fetchData = async (pageNum = 1, category = null, search = '') => {
    try {
        const response = await axios.get(`${API_URL}/performances`, {
            params: {
                size: itemsPerPage,
                page: pageNum - 1,
                category: category,
                search: search, // 검색어 추가
            }
        });

        // imageUrl이 null일 경우 기본 이미지 설정
        const performances = response.data.result.performanceList.map(performance => ({
            ...performance,
            imageUrl: performance.imageUrl || defaultImageUrl,
        }));

        console.log(response.data.result);
        return {
            totalElements: response.data.result.totalElements,
            performances: performances || []
        };
    } catch (err) {
        throw new Error(err.message);
    }
};

// 상세 데이터 조회
export const fetchDetailData = async (performanceId = null) => {
    try {
        const response = await axios.get(`${API_URL}/performances/${performanceId}`);
        const item = response.data.result;
        return {
            memberName: item.memberName,
            performanceId: item.performanceId,
            title: item.title,
            startDateTime: item.dateStartTime,
            endDateTime: item.dateEndTime,
            description: item.description,
            maxAudience: item.maxAudience,
            address: item.address,
            location: item.location,
            imageUrl: item.imageUrl || defaultImageUrl,
            price: item.price,
            remainingTickets: item.remainingTickets,
            startDate: item.startDate,
            status: item.status,
            isUpdatable: item.isUpdatable,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            categories: item.categories,
            firstComeCoupons: item.firstComeCoupons,
        };
    } catch (err) {
        throw new Error(err.message);
    }
};

// 마이페이지 공연 조회
export const fetchMyPerformances = async (pageNum) => {
    try {
        const response = await axios.get(`${API_URL}/performances/admin/my`, {
            params: {
                page: pageNum - 1,
                size: performancesPerPage
            },
        });
        return {
            data: response.data.result || [],
            performancesPerPage : performancesPerPage || 0
        };
    } catch (err) {
        throw new Error(err.message);
    }
};

// 공연 데이터 추가
export const registerPerformanceData = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/performances`, formData, {
            headers: {
                // 'Content-Type' : 'application/json',
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (err) {
        console.error('Error registering performance data:', err);
        throw new Error(err.message);
    }
};

// 공연 데이터 확정짓기
export const confirmPerformance = async (performanceId, formData) => {
    try {
        const response = await axios.patch(`${API_URL}/performances/${performanceId}`, formData, {
            headers: {
                'Content-Type' : 'application/json',
            }
        });
        return response.data;
    } catch (err) {
        console.error('Error confirm performance data:', err);
        throw new Error(err.message);
    }
};

// 전체 카테고리 조회
export const fetchCategoryData = async () => {
    try {
        const response = await axios.get(`${API_URL}/performances/categories`);
        console.log(response.data.result);
        return response.data.result;
    } catch (err) {
        throw new Error(err.message);
    }
};


// 사용자 선호 카테고리 기반 추천 공연 조회
export const fetchFavoritePerformances = async () => {
    try {
        const response = await axios.get(`${API_URL}/performances/favorites`);
        return {
            totalElements: response.data.result.totalElements,
            performances: response.data.result.performanceList || [],
        };
    } catch (err) {
        throw new Error(err.message);
    }
};


// 실시간 인기 공연 조회
export const fetchPopularPerformances = async () => {
    try {
        const response = await axios.get(`${API_URL}/performances/rank`);
        return {
            totalElements: response.data.result.totalElements,
            performances: response.data.result.performanceList || [],
        };
    } catch (err) {
        throw err;  // 원래의 에러 객체를 그대로 던짐
    }
};

// 특정 지점 주변 공연 조회
export const fetchPerformancesAroundPoint = async (pageNum = 1, latitude, longitude) => {
    try {
        const response = await axios.get(`${API_URL}/performances/around-point`, {
            params: {
                latitude: latitude,
                longitude: longitude,
                page: pageNum - 1,
                size: performancesPerPage
            },
        });

        // imageUrl이 null일 경우 기본 이미지 설정
        const performances = response.data.result.performanceList.map(performance => ({
            ...performance,
            imageUrl: performance.imageUrl || defaultImageUrl,
        }));

        return {
            totalElements: response.data.result.totalElements,
            performances: performances || []
        };
    } catch (err) {
        throw err;  // 원래의 에러 객체를 그대로 던짐
    }
};


export const enterQueue = async (performanceId) => {
    try {
        const response = await axios.post(
            `${API_URL}/performances/queue/enter`,
            null, // Request body is empty
            {
                params: { performanceId }, // Pass performanceId as URL parameter
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (err) {
        console.error('Error entering queue:', err);
        throw new Error(err.message);
    }
};



