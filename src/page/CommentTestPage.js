import React from 'react';
import { useParams } from 'react-router-dom';
import CommentList from '../component/comment/CommentList';

const CommentsPage = () => {
    // URL에서 performanceId를 추출
    const { performanceId } = useParams();

    return (
        <div>
            <h1>Comments for Performance {performanceId}</h1>
            {/* performanceId를 CommentList에 전달 */}
            <CommentList performanceId={performanceId} />
        </div>
    );
};

export default CommentsPage;
