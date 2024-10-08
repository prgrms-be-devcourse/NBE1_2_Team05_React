import React, { useEffect, useState } from 'react';
import Comment from './Comment';
import { getComments } from '../../api/commentApi';

const CommentList = ({ performanceId }) => {
    const [comments, setComments] = useState([]);
    const [page, setPage] = useState(0);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await getComments(performanceId, page);
                setComments(data || []);  // response.data.result 값을 가져오므로 정상적으로 처리됨
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            }
        };

        fetchComments();
    }, [performanceId, page]);

    if (!comments || comments.length === 0) {
        return <div>No comments available.</div>;
    }

    return (
        <div>
            {comments.map(comment => (
                <Comment key={comment.commentId} comment={comment} />
            ))}
            <button onClick={() => setPage(page + 1)}>Next Page</button>
        </div>
    );
};

export default CommentList;
//여러개의 댓글을 리스트형식으로 랜더링하는 역할
//performanceId에 해당하는 모든 댓글 데이터를 가져와서, 각 댓글을 Comment.js를 사용해 렌더링한다.