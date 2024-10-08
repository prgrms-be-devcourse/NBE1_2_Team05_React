import React from 'react';
import ReplyList from './ReplyList';

const Comment = ({ comment }) => {
    return (
        <div className="comment">
            <p><strong>{comment.memberName}</strong></p>
            <p>{comment.content}</p>
            <p>{new Date(comment.createdAt).toLocaleString()}</p>

            {comment.replies && comment.replies.length > 0 && (
                <ReplyList replies={comment.replies} />
            )}
        </div>
    );
};

export default Comment;
//댓글 하나씩 조회