import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import MemberInfo from "../../component/member/MemberInfo";
import MyPerformances from "../../component/member/MyPerformances";
import MyTickets from "../../component/member/MyTickets";
import { getMemberInfo } from "../../api/userApi";

const MemberProfilePage = () => {
    const [memberInfo, setMemberInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMemberInfo = async () => {
            try {
                const data = await getMemberInfo();
                setMemberInfo(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMemberInfo();
    }, []);

    if (loading) {
        return <p>로딩 중...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            <CssBaseline />
            <Container fixed>
                <div>
                    <h1>마이페이지</h1>
                    <h2>내 정보</h2>
                    <MemberInfo memberInfo={memberInfo} />
                    <hr />
                    <h2>내가 등록한 공연</h2>
                    <MyPerformances memberInfo={memberInfo} />
                    <hr />
                    <h2>내가 구매한 티켓</h2>
                    <MyTickets />
                </div>
            </Container>
        </>
    );
};

export default MemberProfilePage;