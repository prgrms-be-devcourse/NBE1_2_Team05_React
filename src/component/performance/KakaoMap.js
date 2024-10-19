import React, { useEffect, useRef } from 'react';

const KakaoMap = ({ address }) => {
    const mapContainer = useRef(null); // 지도 DOM element를 가리킬 ref

    useEffect(() => {
        const kakao = window.kakao;

        const geocoder = new kakao.maps.services.Geocoder();
        const map = new kakao.maps.Map(mapContainer.current, {
            center: new kakao.maps.LatLng(37.5665, 126.9780), // 기본값으로 서울
            level: 3, // 줌 레벨
        });

        // 주소로 좌표 검색
        geocoder.addressSearch(address, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 검색된 좌표로 지도 중심 이동
                map.setCenter(coords);

                // 마커를 생성하고 지도에 표시
                const marker = new kakao.maps.Marker({
                    map: map,
                    position: coords, // 마커 위치를 검색된 좌표로 설정
                });

                // 마커 클릭 시 인포윈도우 생성
                const infowindow = new kakao.maps.InfoWindow({
                    content: `<div style="padding:5px;">${address}</div>`, // 마커 위에 표시될 내용
                });

                // 마커에 클릭 이벤트 추가
                kakao.maps.event.addListener(marker, 'click', () => {
                    infowindow.open(map, marker); // 클릭 시 인포윈도우를 마커에 연동하여 표시
                });
            }
        });
    }, [address]);

    return <div ref={mapContainer} style={{ width: '100%', height: '300px' }} />;
};

export default KakaoMap;
