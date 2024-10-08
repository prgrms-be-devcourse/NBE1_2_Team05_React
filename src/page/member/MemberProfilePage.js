import React, {useEffect, useState} from 'react';
import MyPerformances from "../../component/member/MyPerformances";
import MyTickets from "../../component/member/MyTickets";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';


const MemberProfilePage = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false); // 로딩 상태를 false로 설정
    }, []);

    if (loading) {
        return <p>로딩 중...</p>;
    }

    return (
        <>
            <React.Fragment>
                <CssBaseline/>
                <Container fixed>
                    <div>
                        <h1>마이페이지</h1>
                        <h2>내가 등록한 공연</h2>
                        <MyPerformances/>
                        <hr/>
                        <h2>내가 구매한 티켓</h2>
                        <MyTickets/>
                    </div>
                </Container>
            </React.Fragment>
        </>
    );
};

export default MemberProfilePage;