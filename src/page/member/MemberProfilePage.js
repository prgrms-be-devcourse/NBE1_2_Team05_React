import React from 'react';
import MyPerformances from "../../component/member/MyPerformances";
import MyTickets from "../../component/member/MyTickets";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import MemberInfo from "../../component/member/MemberInfo";

const MemberProfilePage = () => {
    return (
        <>
            <React.Fragment>
                <CssBaseline/>
                <Container fixed>
                    <div>
                        <h1>마이페이지</h1>
                        <h2>내 정보</h2>
                        <MemberInfo />
                        <hr/>
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