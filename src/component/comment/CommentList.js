import React, { useEffect, useState } from 'react';
import Comment from './Comment';
import { getComments, createComment } from '../../api/commentApi';
import CommentForm from './CommentForm';


const CommentList = ({ performanceId }) => {
    const [comments, setComments] = useState([]);  // 전체 댓글 리스트
    const [page, setPage] = useState(0);  // 현재 페이지
    const [hasMore, setHasMore] = useState(true);  // 다음 페이지가 있는지 여부
    const [loading, setLoading] = useState(false);  // 로딩 상태

    // 댓글 목록을 서버에서 가져오는 함수
    const fetchComments = async (pageNumber) => {
        if (loading) return;  // 로딩 중인 경우 중복 호출 방지
        setLoading(true);
        try {
            const data = await getComments(performanceId, pageNumber, 10);  // 한 번에 10개씩 가져오기
            if (data.length < 10) {
                setHasMore(false);  // 댓글이 10개 미만이면 더 가져올 댓글이 없다고 판단
            }
            if (pageNumber === 0) {
                setComments(data);  // 첫 번째 페이지일 경우 기존 댓글을 덮어쓰기
            } else {
                setComments((prevComments) => [...prevComments, ...data]);  // 그 이후에는 기존 댓글에 추가
            }
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments(page);  // 페이지가 변경될 때마다 댓글 로딩
    }, [page]);


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

//문제는 상태를 누적하는 방식과 useEffect의 중복 호출로 인한 것이었으며, 이를 해결하기 위해 첫 페이지에서는 댓글을 덮어쓰고 이후에는 누적하도록 수정하고, 중복 호출 방지 로직을 추가