// 데이터를 localStorage에 저장하는 함수
export const setLocalStorage = (key, value) => {
    if (typeof window !== "undefined") {
        if (typeof value === 'string') {
            localStorage.setItem(key, value); // 문자열로 저장
        } else {
            localStorage.setItem(key, JSON.stringify(value)); // 객체를 JSON 문자열로 저장
        }
    }
};

// localStorage에서 데이터를 가져오는 함수
export function getLocalStorage(key) {
    const value = localStorage.getItem(key);
    return value ? value : null; // JSON.parse 제거
}

// localStorage에서 데이터를 삭제하는 함수
export const removeLocalStorage = (key) => {
    if (typeof window !== "undefined") {
        localStorage.removeItem(key);
    }
};
