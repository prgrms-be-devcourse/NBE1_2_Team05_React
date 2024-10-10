import React, {useEffect, useState} from 'react';
import { getMemberInfo } from "../../api/userApi";
import {Button} from "@mui/material";
import {useNavigate} from 'react-router-dom';


const MemberInfo = () => {
    const [loading, setLoading] = useState(true);
    const [memberInfo, setMemberInfo] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
        <div>
            {memberInfo && (
                <>
                    <p>이름: {memberInfo.name}</p>
                    <p>권한: {memberInfo.role}</p>
                </>
            )}
            <Button
                size="small"
                onClick={() => navigate(`/member/category`)}
            >
                선호하는 카테고리 수정하기
            </Button>
        </div>
    );
};

export default MemberInfo;
