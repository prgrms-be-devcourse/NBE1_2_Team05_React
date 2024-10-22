import { useState, useRef } from 'react';

export const useDraggable = () => {
    const ref = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const onMouseDown = (e) => {
        const slider = ref.current;
        setIsMouseDown(true);
        setIsDragging(false); // 드래그 상태 초기화
        setStartX(e.pageX - slider.offsetLeft);
        setScrollLeft(slider.scrollLeft);
        slider.style.scrollBehavior = 'auto';
    };

    const onMouseMove = (e) => {
        if (!isMouseDown) return;
        e.preventDefault();
        const slider = ref.current;
        const x = e.pageX - slider.offsetLeft;
        const walk = x - startX;
        slider.scrollLeft = scrollLeft - walk;

        if (Math.abs(walk) > 5) {
            setIsDragging(true); // 드래그 중임을 표시
        }
    };

    const onMouseUpOrLeave = () => {
        const slider = ref.current;
        setIsMouseDown(false);
        setTimeout(() => setIsDragging(false), 0); // 다음 이벤트 루프에서 isDragging 초기화
        slider.style.scrollBehavior = 'smooth';
    };

    const onClick = (e) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation(); // 클릭 이벤트 전파 방지
        }
    };

    return {
        ref,
        onMouseDown,
        onMouseMove,
        onMouseUp: onMouseUpOrLeave,
        onMouseLeave: onMouseUpOrLeave,
        onClick,
        isDragging,
    };
};
