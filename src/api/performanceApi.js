import axios from './axiosInterceptor';

const API_URL = 'http://localhost:8080/api/v1'; // 기본 API URL
const itemsPerPage = 16; // 페이지당 아이템 수
const performancesPerPage = 6; //페이지당 공연 수
const totalItems = 100; // 총 아이템 수 (예시로 100개)

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
        return response.data.result.map(item => ({
            performanceId: item.performanceId,
            memberName: item.memberName,
            imageUrl: item.imageUrl,
            title: item.title,
            startDateTime: item.dateStartTime,
            endDateTime: item.dateEndTime
        }));
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
            imageUrl: item.imageUrl,
            price: item.price,
            remainingTickets: item.remainingTickets,
            startDate: item.startDate,
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            categories: item.categories,
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
            totalCount: response.data.totalCount || 0,
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
                'Content-Type' : 'application/json',
            }
        });
        return response.data;
    } catch (err) {
        console.error('Error registering performance data:', err);
        throw new Error(err.message);
    }
};