// KakaoLoginButton.js
import React from 'react';
import KakaoIcon from '../../assets/image/kakao-svgrepo-com.svg';

const KakaoLoginButton = ({ buttonText = "카카오 로그인" }) => {
    const clientId = '1233e57ac8c8b3842d362cb6736f2166';
    const redirectUri = 'http://localhost:3000/kakao-callback'; // 클라이언트의 리다이렉트 URI
    const responseType = 'code';

    const handleKakaoLogin = () => {
        const kakaoOAuthURL = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}`;

        window.location.href = kakaoOAuthURL; // 카카오 OAuth URL로 리디렉션
    };

    return (
        <button
            type="button"
            onClick={handleKakaoLogin}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FEE500',
                color: '#3C1E1E',
                border: 'none',
                borderRadius: '4px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                width: '100%',
                maxWidth: '400px',
                background: 'linear-gradient(45deg, #FFD700 30%, #FEE500 90%)',
                boxShadow: '0px 1px rgba(255, 105, 135, .1)',
                transition: 'background 0.3s ease',
            }}
        >
            <img
                src={KakaoIcon}
                alt="KakaoTalk Icon"
                style={{ width: '20px', height: '21px', marginRight: '10px' }}
            />
            {buttonText}
        </button>
    );
};

export default KakaoLoginButton;
