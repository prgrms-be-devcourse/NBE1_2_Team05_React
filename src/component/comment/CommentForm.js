import React, { useState } from 'react';
import { createComment } from '../../api/commentApi';
import './CommentForm.css';

const CommentForm = ({ performanceId, parentId = null, onCommentCreated }) => {
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            alert('댓글을 입력해주세요.');
            return;
        }

        try {
            // 댓글 생성 API 호출
            const newComment = await createComment(performanceId, content, parentId);
            setContent(''); // 댓글 작성 후 입력 필드 초기화
            if (onCommentCreated) {
                onCommentCreated(newComment); // 댓글 생성 후 부모 컴포넌트에 알림
            }
        } catch (error) {
            console.error('댓글 생성 실패:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="comment-form">
      <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력하세요..."
      />
            <button type="submit">댓글 작성</button>
        </form>
    );
};

export default CommentForm;
