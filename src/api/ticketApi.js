import axios from './axiosInterceptor';

const ticketsPerPage = 3; // 페이지당 티켓 수

const API_URL = 'http://localhost:8080/api/v1/tickets';

// 마이페이지 티켓 조회
export const fetchTickets = async (pageNum) => {
    try {
        const response = await axios.get(`${API_URL}`, {
            params: {
                page: pageNum - 1, // API에서 0-based index 사용
                size: ticketsPerPage
            },
        });
        return {
            data: response.data || [],
            totalCount: response.data.totalCount || 0,
            ticketsPerPage: ticketsPerPage || 0
        }
    } catch (error) {
        throw new Error(error.message);
    }
};

//마이페이지 티켓 삭제
export const deleteTicket = async (ticketId) => {
    try {
        const response = await axios.delete(`${API_URL}/${ticketId}`); // ticketId를 URL에 포함
        return response.data; // 삭제된 결과 반환
    } catch (error) {
        throw new Error(error.message);
    }
};

// 티켓 발권 (구매)
export const buyTicket = async (ticketRequestDto) => {
    try {
        const response = await axios.post(API_URL, ticketRequestDto); // 티켓 구매 정보 전송
        return response.data; // 구매된 티켓 정보 반환
    } catch (error) {
        throw new Error(error.message);
    }
};
