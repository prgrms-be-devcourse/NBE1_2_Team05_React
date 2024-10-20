import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {buyTicket} from "../../../api/ticketApi";

export function WidgetSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    async function confirm() {
      const requestData = {
        orderId: searchParams.get("orderId"),
        amount: searchParams.get("amount"),
        paymentKey: searchParams.get("paymentKey"),
      };

      try {
        // 시크릿 키를 Base64로 인코딩 (btoa 함수 사용)
        const secretKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'; // 시크릿 키
        const encodedKey = btoa(`${secretKey}:`); // Base64 인코딩

        // Toss Payments API로 결제 정보 요청 (paymentKey 사용)
        const response = await fetch(`https://api.tosspayments.com/v1/payments/${requestData.paymentKey}`, {
          method: 'GET',
          headers: {
            Authorization: `Basic ${encodedKey}`, // 인코딩된 시크릿 키 사용
            'Content-Type': 'application/json',
          },
        });

        // JSON 응답 파싱
        const data = await response.json();
        console.log("결제 내역:", data);

        if (data.metadata) {
          console.log("Metadata:", data.metadata);
        }

      } catch (error) {
        console.error("Error in confirm function:", error);
        throw error;
      }


      // 결제 확인 후 티켓 구매 요청
      // const ticketRequestDto = {
      //   performanceId: searchParams.get("performanceId"), // 공연 ID는 추가 파라미터로 받아올 수 있음
      //   quantity: 1, // 예매 인원 (예시)
      //   couponId: null // 쿠폰 ID (선택 사항)
      // };
      //
      // const ticketResponse = await buyTicket(ticketRequestDto); // 티켓 발권 API 호출
      // setResponseData(ticketResponse);

    }

    confirm()
        .then((data) => {
          // setResponseData(data);
          console.log("결제 및 티켓 발권 성공:", data);
        })
        .catch((error) => {
          console.error("Error in catch block:", error); // 에러 디버깅
          navigate(`/fail?code=${error.code}&message=${error.message}`);
        });
  }, [searchParams]);

  return (
    <>
      <div className="box_section" style={{ width: "600px" }}>
        <img width="100px" src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png" />
        <h2>결제를 완료했어요</h2>
        <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
          <div className="p-grid-col text--left">
            <b>결제금액</b>
          </div>
          <div className="p-grid-col text--right" id="amount">
            {`${Number(searchParams.get("amount")).toLocaleString()}원`}
          </div>
        </div>
        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>주문번호</b>
          </div>
          <div className="p-grid-col text--right" id="orderId">
            {`${searchParams.get("orderId")}`}
          </div>
        </div>
        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>paymentKey</b>
          </div>
          <div className="p-grid-col text--right" id="paymentKey" style={{ whiteSpace: "initial", width: "250px" }}>
            {`${searchParams.get("paymentKey")}`}
          </div>
        </div>
        <div className="p-grid-col">
          <Link to="https://docs.tosspayments.com/guides/v2/payment-widget/integration">
            <button className="button p-grid-col5">연동 문서</button>
          </Link>
          <Link to="https://discord.gg/A4fRFXQhRu">
            <button className="button p-grid-col5" style={{ backgroundColor: "#e8f3ff", color: "#1b64da" }}>
              실시간 문의
            </button>
          </Link>
        </div>
      </div>
      <div className="box_section" style={{ width: "600px", textAlign: "left" }}>
        <b>Response Data :</b>
        <div id="response" style={{ whiteSpace: "initial" }}>
          {responseData && <pre>{JSON.stringify(responseData, null, 4)}</pre>}
        </div>
      </div>
    </>
  );
}
