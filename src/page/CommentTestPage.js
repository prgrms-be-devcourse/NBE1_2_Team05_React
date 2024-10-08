import React from 'react';
import CommentList from '../component/comment/CommentList';

const CommentsPage = () => {
    const performanceId = 1; // Example performance ID. You can make this dynamic.

    return (
        <div>
            <h1>Comments</h1>
            <CommentList performanceId={performanceId} />
        </div>
    );
};

export default CommentsPage;
