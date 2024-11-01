import React, { useEffect, useRef } from 'react';

const KakaoMapFinder = ({ onCoordinatesChange }) => {
    const mapContainer = useRef(null); // 지도 DOM element를 가리킬 ref
    const mapRef = useRef(null); // 지도 인스턴스를 저장할 ref
    const markerRef = useRef(null); // 마커 인스턴스를 저장할 ref
    const infoWindowRef = useRef(null); // 인포윈도우 인스턴스를 저장할 ref
    const isMapInitialized = useRef(false); // 지도 초기화 여부를 저장할 ref

    const initMap = async () => {
        const kakao = window.kakao;
        const map = new kakao.maps.Map(mapContainer.current, {
            center: new kakao.maps.LatLng(37.5665, 126.9780), // 기본값으로 서울
            level: 3, // 줌 레벨
        });

        try {
            const location = await getCurrentLocation();
            const coords = new kakao.maps.LatLng(location.lat, location.lng);
            console.log(isMapInitialized)
            
            onCoordinatesChange({ lat: location.lat, lng: location.lng });
            
            // 현재 위치로 지도 중심 이동
            map.setCenter(coords);

            // 현재 위치에 마커 생성
            markerRef.current = new kakao.maps.Marker({
                map: map,
                position: coords,
            });

            // 인포윈도우 생성
            infoWindowRef.current = new kakao.maps.InfoWindow({
                content: `<div style="padding:5px;">현재 위치</div>`,
            });

            kakao.maps.event.addListener(markerRef.current, 'click', () => {
                infoWindowRef.current.open(map, markerRef.current);
            });

            // 지도 클릭 이벤트 추가
            kakao.maps.event.addListener(map, 'click', async (mouseEvent) => {
                const clickedCoords = mouseEvent.latLng; // 클릭한 위치의 좌표
                await handleMapClick(clickedCoords);
            });

        } catch (error) {
            console.error('현재 위치를 가져오는 데 실패했습니다:', error);
        }
    };

    // 사용자의 현재 위치를 가져오는 함수
    const getCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        resolve({ lat, lng });
                    },
                    (error) => {
                        reject(error);
                    }
                );
            } else {
                reject(new Error('Geolocation is not supported by this browser.'));
            }
        });
    };

    // 좌표에 해당하는 주소를 가져오는 함수
    const getAddressFromCoords = (lat, lng) => {
        console.log(lat, lng);
        return new Promise((resolve, reject) => {
            const kakao = window.kakao;
            const geocoder = new kakao.maps.services.Geocoder();
            const coords = new kakao.maps.LatLng(lat, lng);

            geocoder.coord2Address(coords.getLng(), coords.getLat(), (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    console.log(result[0].address);
                    resolve(result[0].address.address_name); // 첫 번째 주소 반환
                } else {
                    reject(new Error('주소를 찾을 수 없습니다.'));
                }
            });
        });
    };

    const handleMapClick = async (clickedCoords) => {
        const kakao = window.kakao;
        const lat = clickedCoords.getLat();
        const lng = clickedCoords.getLng();

        // 클릭한 좌표를 부모 컴포넌트에 전달
        onCoordinatesChange({ lat, lng });

        // 기존 인포윈도우가 열려 있다면 닫기
        if (infoWindowRef.current) {
            infoWindowRef.current.close(); // 기존 인포윈도우 닫기
        }

        // 마커 위치 업데이트
        if (markerRef.current) {
            markerRef.current.setPosition(clickedCoords); // 마커 위치 업데이트
        }

        // 주소 가져오기
        try {
            const address = await getAddressFromCoords(lat, lng);
            
            // 인포윈도우 생성 및 표시
            const infoWindowContent = document.createElement('div');
            infoWindowContent.style.padding = '5px';
            infoWindowContent.innerHTML = `주소: ${address}`;

            infoWindowRef.current = new kakao.maps.InfoWindow({
                content: infoWindowContent,
            });

            // 클릭한 위치에서 인포윈도우 열기
            infoWindowRef.current.open(mapRef.current, markerRef.current);
        } catch (error) {
            console.error('주소 로드 실패 : ', error);
        }
    };

    useEffect(() => {
        if (!isMapInitialized.current) {
            initMap();
            isMapInitialized.current = true; // 지도 초기화 완료
        }
    }, [onCoordinatesChange]);


    return <div ref={mapContainer} style={{ width: '100%', height: '300px' }} />;
};

export default KakaoMapFinder;
