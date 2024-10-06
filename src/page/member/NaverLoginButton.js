import React from 'react';
import NaverIcon from '../../assets/image/btn_naver.svg'; // 로컬 SVG 파일을 임포트

const NaverLoginButton = ({buttonText = "네이버 로그인"}) => {

    const clientId = 'e5JWZUN_qtfvPpP7LNst';
    const redirectUri = 'http://localhost:8080/api/v1/members/oauth/NAVER';
    const responseType = 'code';



    const handleNaverLogin = () => {
        // 네이버 OAuth URL로 리디렉션하는 코드
        const naverOAuthURL = 'https://nid.naver.com/oauth2.0/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}';


        window.location.href = naverOAuthURL; // 네이버 OAuth URL을 입력
    };

    return (
        <button
            type="button"
            onClick={handleNaverLogin}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#03C75A', // 네이버의 대표적인 녹색 색상
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 20px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold',
                width: '100%',

                maxWidth: '400px',
                background: 'linear-gradient(45deg, #02A94C 0%, #03C75A 0%)',  // 그라데이션 적용
                boxShadow: '0px 1px rgba(255, 105, 135, .3)', // 그라데이션 효과에 따른 그림자
                transition: 'background 0.3s ease',  // 배경 변경 시 애니메이션 적용
            }}
        >
            <img
                src={NaverIcon}
                alt="Naver Icon"
                style={{ width: '35px', height: '35px', marginRight: '0px' }}
            />
            {buttonText}
        </button>
    );
};

export default NaverLoginButton;