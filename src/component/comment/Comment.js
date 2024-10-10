import React, { useState } from 'react';
import { updateComment, deleteComment } from '../../api/commentApi';
import './Comment.css';

const Comment = ({ comment, depth = 0, onCommentUpdated, onCommentDeleted }) => {
    const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부
    const [content, setContent] = useState(comment.content); // 수정할 댓글 내용
    const [isDeleted, setIsDeleted] = useState(comment.commentStatus === 'DELETED'); // 삭제 여부 상태

    // 댓글 수정 완료 처리 함수
    const handleUpdate = async () => {
        try {
            await updateComment(comment.commentId, content); // 서버에 수정 요청
            setIsEditing(false); // 수정 모드 종료
            if (onCommentUpdated) {
                onCommentUpdated({ ...comment, content }); // 수정된 댓글을 부모로 전달
            }
        } catch (error) {
            console.error('댓글 수정 실패:', error);
            alert('댓글 수정에 실패했습니다.');
        }
    };

    // 댓글 삭제 처리 함수
    const handleDelete = async () => {
        if (window.confirm('댓글을 삭제하시겠습니까?')) {
            try {
                const response = await deleteComment(comment.commentId); // 서버에 삭제 요청
                const { commentStatus } = response; // 서버에서 반환한 상태 사용
                if (commentStatus === 'DELETED') {
                    setIsDeleted(true); // 삭제된 상태로 즉시 설정
                    if (onCommentDeleted) {
                        onCommentDeleted(comment.commentId); // 삭제된 댓글을 부모로 전달
                    }
                }
            } catch (error) {
                console.error('댓글 삭제 실패:', error);
                alert('댓글 삭제에 실패했습니다.');
            }
        }
    };

    return (
        <div className="comment-container" style={{ marginLeft: depth * 20 + 'px' }}>
            <div className="comment-content">
                <div className="comment-header">
                    <div className="comment-details">
                        <span className="comment-author">{comment.memberName}</span>
                        <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                </div>

                {/* 삭제된 댓글일 경우 "댓글이 삭제되었습니다"로 표시 */}
                {isDeleted ? (
                    <div className="comment-text">댓글이 삭제되었습니다</div>
                ) : (
                    isEditing ? (
                        <div>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="comment-edit-textarea"
                            />
                            <button onClick={handleUpdate}>수정 완료</button>
                            <button onClick={() => setIsEditing(false)}>취소</button>
                        </div>
                    ) : (
                        <div className="comment-text">{content}</div>
                    )
                )}

                {/* 수정 및 삭제 버튼 (삭제되지 않았을 때만 표시) */}
                {!isDeleted && !isEditing && (
                    <>
                        <button onClick={() => setIsEditing(true)}>수정</button>
                        <button onClick={handleDelete}>삭제</button> {/* 삭제 버튼 */}
                    </>
                )}
            </div>

            {/* 대댓글이 있으면 재귀적으로 Comment 컴포넌트 호출 */}
            {comment.replies && comment.replies.length > 0 && (
                comment.replies.map(reply => (
                    <Comment
                        key={reply.commentId}
                        comment={reply}
                        depth={depth + 1}
                        onCommentUpdated={onCommentUpdated}
                        onCommentDeleted={onCommentDeleted} // 삭제 처리 콜백 추가
                    />
                ))
            )}
        </div>
    );
};

export default Comment;
