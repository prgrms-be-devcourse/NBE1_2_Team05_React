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
                setComments(data);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            }
        };

        fetchComments();
    }, [performanceId, page]);

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
//This component will be responsible for rendering a list of comments. ->전체 댓글리스트 조회