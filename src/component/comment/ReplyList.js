import React from 'react';
import Comment from './Comment';

const ReplyList = ({ replies }) => {
    return (
        <div className="replies">
            {replies.map(reply => (
                <Comment key={reply.commentId} comment={reply} />
            ))}
        </div>
    );
};

export default ReplyList;

