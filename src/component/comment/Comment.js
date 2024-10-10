// src/components/comment/Comment.js

import React, { useState } from 'react';
import { updateComment, deleteComment } from '../../api/commentApi';
import './Comment.css';

// JWT에서 사용자 정보를 추출하는 함수
const getUserInfoFromToken = (token) => {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split('')
                .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
                .join('')
        );
        const parsedToken = JSON.parse(jsonPayload);
        console.log('Parsed token:', parsedToken); // 디버그용 출력
        return parsedToken;
    } catch (error) {
        console.error('토큰 파싱 실패:', error);
        return null;
    }
};

const Comment = ({ comment, depth = 0, onCommentUpdated, onCommentDeleted }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(comment.content);
    const [isDeleted, setIsDeleted] = useState(comment.commentStatus === 'DELETED');

    // 로컬 스토리지에서 access token을 가져와 JWT 디코딩
    const accessToken = localStorage.getItem('access_token');
    const userInfo = getUserInfoFromToken(accessToken);
    const userEmail = userInfo ? userInfo.email : null; // JWT에서 이메일 추출

    // 현재 로그인한 사용자가 댓글 작성자인지 확인
    const isAuthor = userEmail === comment.email; // JWT 이메일과 댓글 작성자 이메일 비교

    console.log('userEmail:', userEmail, 'comment.email:', comment.email, 'isAuthor:', isAuthor); // 디버그용 출력

    const handleUpdate = async () => {
        try {
            await updateComment(comment.commentId, content);
            setIsEditing(false);
            if (onCommentUpdated) {
                onCommentUpdated({ ...comment, content });
            }
        } catch (error) {
            console.error('댓글 수정 실패:', error);
            alert('댓글 수정에 실패했습니다.');
        }
    };

    const handleDelete = async () => {
        if (window.confirm('댓글을 삭제하시겠습니까?')) {
            try {
                const response = await deleteComment(comment.commentId);
                const { commentStatus } = response;
                if (commentStatus === 'DELETED') {
                    setIsDeleted(true);
                    if (onCommentDeleted) {
                        onCommentDeleted(comment.commentId);
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

                {!isDeleted && isAuthor && !isEditing && (
                    <>
                        <button onClick={() => setIsEditing(true)}>수정</button>
                        <button onClick={handleDelete}>삭제</button>
                    </>
                )}
            </div>

            {comment.replies && comment.replies.length > 0 && (
                comment.replies.map(reply => (
                    <Comment
                        key={reply.commentId}
                        comment={reply}
                        depth={depth + 1}
                        onCommentUpdated={onCommentUpdated}
                        onCommentDeleted={onCommentDeleted}
                    />
                ))
            )}
        </div>
    );
};

export default Comment;
