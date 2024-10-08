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
import {deleteTicket, fetchTickets} from '../../api/ticketApi'; // API 호출 분리된 파일 import

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1); // 현재 페이지 상태
    const [totalPages, setTotalPages] = useState(10); // 총 페이지 수
    const navigate = useNavigate(); // useNavigate 훅 사용

    useEffect(() => {
        const loadTickets = async () => {
            try {
                const data = await fetchTickets(page); // API 호출
                console.log(data)
                if (data.data.isSuccess) {
                    setTickets(data.data.result); // 서버에서 응답받은 데이터 설정
                    // setTotalPages(Math.ceil(data.totalCount / 6)); // 총 페이지 수 계산
                }
            } catch (error) {
                console.error("티켓 목록을 불러오는 중 오류 발생", error);
            } finally {
                setLoading(false);
            }
        };

        loadTickets();
    }, [page]);

    if (loading) {
        return <p>로딩 중...</p>;
    }

    const handleDelete = async (ticketId) => {
        try {
            await deleteTicket(ticketId); // deleteTicket 호출
            alert('티켓이 성공적으로 삭제되었습니다.');
            // 삭제 후 티켓 목록 새로 고침
            const updatedData = await fetchTickets(page);
            if (updatedData.data.isSuccess) {
                setTickets(updatedData.data.result);
                // setTotalPages(Math.ceil(updatedData.totalCount / 6)); // 총 페이지 수 계산
            }
        } catch (error) {
            alert('티켓 삭제 중 오류 발생: ' + error.message);
        }
    };

    return (
        <>
            <ul>
                {tickets.length > 0 ? (
                    tickets.map(ticket => (
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
                                <Button onClick={() => handleDelete(ticket.ticketId)}>티켓 취소</Button> {/* onClick에 handleDelete 연결 */}
                                <Button onClick={() => navigate(`/performances/${ticket.performanceId}`)}>공연 자세히 보기</Button> {/* 공연 상세 페이지로 이동 */}
                            </Stack>
                            <hr />
                        </div>
                    ))
                ) : (
                    <p>구매한 티켓이 없습니다.</p>
                )}
            </ul>

            <Stack spacing={2} mt={2} alignItems="center">
                <Typography variant="body1" align="center">
                    현재 페이지: {page} / {totalPages}
                </Typography>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    renderItem={(item) => (
                        <PaginationItem
                            slots={{previous: ArrowBackIcon, next: ArrowForwardIcon}}
                            {...item}
                        />
                    )}
                />
            </Stack>
        </>
    );
};

export default MyTickets;