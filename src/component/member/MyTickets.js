import axios from 'axios';
import { useEffect, useState } from 'react';
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Typography from "@mui/material/Typography";

// 로그인 구현 후 삭제할 예정
axios.interceptors.request.use(
    (config) => {
        // Authorization 헤더에 하드코딩된 액세스 토큰 추가
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0MTFAZ21haWwuY29tIiwiYXV0aCI6IlJPTEVfUEFETUlOIiwiZW1haWwiOiJ0ZXN0MTFAZ21haWwuY29tIiwiZXhwIjoxNzI4MzYwODE5fQ.kZLei6X6q1wkmPRbOb5NNSAmk3uMd31cTBAtDUM29VY`;
        return config;
    },
    (error) => Promise.reject(error)
);

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1); // 현재 페이지 상태
    const [totalPages, setTotalPages] = useState(0); // 총 페이지 수
    const ticketsPerPage = 6; // 페이지당 티켓 수
    const navigate = useNavigate(); // useNavigate 훅 사용

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/tickets', {
                    params: {
                        page: page - 1, // API에서 0-based index 사용
                        size: ticketsPerPage,
                        option: 'ticketId', // 정렬 옵션
                        isAscending: false, // 내림차순
                    },
                });

                // 응답 데이터에서 result를 가져옴
                if (response.data.isSuccess) {
                    setTickets(response.data.result); // 서버에서 응답받은 데이터 설정
                    setTotalPages(Math.ceil(response.data.totalCount / ticketsPerPage)); // 총 페이지 수 계산
                }
            } catch (error) {
                console.error("티켓 목록을 불러오는 중 오류 발생", error);
            } finally {
                setLoading(false);
                // setTickets([
                //     {
                //         ticketId: 1,
                //         performanceTitle: "뮤지컬 '햄릿'",
                //         dateTime: "2024-10-08T19:00:00",
                //         quantity: 2,
                //         price: 75000,
                //         dateStartTime: "2024-10-08T19:00:00",
                //         dateEndTime: null,
                //     },
                //     {
                //         ticketId: 2,
                //         performanceTitle: "콘서트 '비틀즈'",
                //         dateTime: "2024-10-09T20:00:00",
                //         quantity: 1,
                //         price: 50000,
                //         dateStartTime: "2024-10-09T20:00:00",
                //         dateEndTime: null,
                //     },
                // ]);
            }
        };

        fetchTickets();
    }, [page]); // page가 변경될 때마다 데이터 요청

    if (loading) {
        return <p>로딩 중...</p>;
    }

    return (
        <>
            <ul>
                {tickets.map(ticket => (
                    <div key={ticket.ticketId}>
                        <div>
                            <strong>공연 제목:</strong> {ticket.performanceTitle}
                        </div>
                        <div>
                            <strong>예매 날짜:</strong> {new Date(ticket.dateTime).toLocaleString()}
                        </div>
                        <div>
                            <strong>수량:</strong> {ticket.quantity}
                        </div>
                        <div>
                            <strong>가격:</strong> {ticket.price.toLocaleString()} 원
                        </div>
                        <div>
                            <strong>시작 시간:</strong> {new Date(ticket.dateStartTime).toLocaleString()}
                        </div>
                        <div>
                            <strong>종료 시간:</strong> {ticket.dateEndTime ? new Date(ticket.dateEndTime).toLocaleString() : '정보 없음'}
                        </div>
                        <Stack direction="row" spacing={2}>
                            <Button>티켓 취소</Button>
                            <Button onClick={() => navigate(`/performances/${ticket.performanceTitle}`)}>공연 자세히 보기</Button>
                        </Stack>
                        <hr />
                    </div>
                ))}
            </ul>

            <Stack spacing={2} mt={2}>
                <Pagination
                    count={10} // 총 페이지 수
                    page={page} // 현재 페이지
                    onChange={(event, value) => setPage(value)} // 페이지 변경 시 상태 업데이트
                    renderItem={(item) => {
                        if (item.type === 'previous' || item.type === 'next') {
                            return (
                                <PaginationItem
                                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                                    {...item}
                                />
                            );
                        }

                        // 페이지 번호를 포함한 PaginationItem 반환
                        return (
                            <PaginationItem
                                {...item}
                                onClick={() => setPage(item.page)} // 페이지 번호 클릭 시 상태 업데이트
                            >
                                {item.page}
                            </PaginationItem>
                        );
                    }}
                />
                <Typography variant="body1" align="center">
                    현재 페이지: {page}
                </Typography>
            </Stack>
        </>
    );
};

export default MyTickets;