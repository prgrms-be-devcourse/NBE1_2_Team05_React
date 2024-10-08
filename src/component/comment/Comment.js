import React from 'react';
import './Comment.css'; // 별도의 CSS 파일에서 스타일링 적용

const Comment = ({ comment, depth = 0 }) => {
    return (
        <div className="comment-container" style={{ marginLeft: depth * 20 + 'px' }}>
            <div className="comment-content">
                <div className="comment-header">
                    {/* 기본 프로필 이미지 제거 */}
                    <div className="comment-details">
                        <span className="comment-author">{comment.memberName}</span>
                        <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                </div>
                <div className="comment-text">{comment.content}</div>
            </div>

            {/* 대댓글이 있으면 재귀적으로 Comment 컴포넌트 호출 */}
            {comment.replies && comment.replies.length > 0 && (
                comment.replies.map(reply => (
                    <Comment key={reply.commentId} comment={reply} depth={depth + 1} />
                ))
            )}
        </div>
    );
};

export default Comment;

//CommentList.js에서 랜더링한 댓글 목록을 하나씩 Comment.js에서 처리하여 댓글과 대댓글을 표시합니다.
//각 댓글과 해당 댓글의 대댓글을 재귀적으로 렌더링하는 컴포넌트.