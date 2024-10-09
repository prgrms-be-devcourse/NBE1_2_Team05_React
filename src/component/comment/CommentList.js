import React, { useEffect, useState } from 'react';
import Comment from './Comment';
import { getComments, createComment } from '../../api/commentApi';
import CommentForm from './CommentForm';


const CommentList = ({ performanceId }) => {
    const [comments, setComments] = useState([]);  // 전체 댓글 리스트
    const [page, setPage] = useState(0);  // 현재 페이지
    const [hasMore, setHasMore] = useState(true);  // 다음 페이지가 있는지 여부

    // 댓글 목록을 서버에서 가져오는 함수
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await getComments(performanceId, page, 10);  // 한 번에 10개씩 가져오기
                if (data.length < 10) {
                    setHasMore(false);  // 댓글이 10개 미만이면 더 가져올 댓글이 없다고 판단
                }
                setComments((prevComments) => [...prevComments, ...data]);  // 댓글 목록을 누적하여 저장
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            }
        };

        fetchComments();
    }, [performanceId, page]);

    // 새로운 댓글이 생성되면 전체 댓글을 다시 불러오는 함수
    const handleCommentCreated = async () => {
        try {
            const data = await getComments(performanceId, 0, 10);  // 첫 페이지에서 다시 가져오기
            setComments(data || []);  // 전체 댓글 갱신
            setPage(0);  // 페이지를 초기화
            setHasMore(data.length === 10);  // 댓글이 10개라면 더 가져올 가능성이 있음
        } catch (error) {
            console.error('Failed to fetch comments after creation:', error);
        }
    };

    // 다음 페이지의 댓글을 불러오는 함수
    const loadNextPage = () => {
        setPage((prevPage) => prevPage + 1);  // 페이지를 하나 증가시켜 다음 페이지 요청
    };

    if (!comments.length) {
        return (
            <div>
                <CommentForm performanceId={performanceId} onCommentCreated={handleCommentCreated} />
                <div>No comments available.</div>
            </div>
        );
    }

    return (
        <div>
            {/* 댓글 생성 폼 */}
            <CommentForm performanceId={performanceId} onCommentCreated={handleCommentCreated} />

            {/* 댓글 리스트 */}
            {comments.map(comment => (
                <Comment
                    key={comment.commentId}
                    comment={comment}
                />
            ))}

            {/* 다음 페이지 버튼 */}
            {hasMore && (
                <button onClick={loadNextPage}>더보기</button>
            )}
        </div>
    );
};

export default CommentList;


//여러개의 댓글을 리스트형식으로 랜더링하는 역할
//performanceId에 해당하는 모든 댓글 데이터를 가져와서, 각 댓글을 Comment.js를 사용해 렌더링한다.