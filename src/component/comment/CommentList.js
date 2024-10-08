import React, { useEffect, useState } from 'react';
import Comment from './Comment';
import { getComments, createComment } from '../../api/commentApi';
import CommentForm from './CommentForm';

const CommentList = ({ performanceId }) => {
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
        // 댓글 목록을 서버에서 가져오는 함수
        const fetchComments = async () => {
            try {
                const data = await getComments(performanceId, page);
                setComments(data || []);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            }
        };

        fetchComments();
    }, [performanceId, page]);

    // 새로운 댓글이 생성되면 전체 댓글을 다시 불러오는 함수
    const handleCommentCreated = async () => {
        try {
            const data = await getComments(performanceId, 0);  // 첫 페이지에서 다시 가져오기
            setComments(data || []);  // 전체 댓글 갱신
        } catch (error) {
            console.error('Failed to fetch comments after creation:', error);
        }
    };

    if (!comments || comments.length === 0) {
        return (
            <div>
                <CommentForm performanceId={performanceId} onCommentCreated={handleCommentCreated} /> {/* 댓글 생성 폼 */}
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
                <Comment key={comment.commentId} comment={comment} />
            ))}

            {/* 다음 페이지 버튼 */}
            <button onClick={() => setPage(page + 1)}>Next Page</button>
        </div>
    );
};

export default CommentList;


//여러개의 댓글을 리스트형식으로 랜더링하는 역할
//performanceId에 해당하는 모든 댓글 데이터를 가져와서, 각 댓글을 Comment.js를 사용해 렌더링한다.