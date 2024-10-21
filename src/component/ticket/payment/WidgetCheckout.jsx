import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Tosspayment.css";
import { useAuth } from "../../../context/AuthContext";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = generateRandomString();

export function WidgetCheckoutPage(
    { performanceId, couponId, quantity, totalPayment }) {
  const navigate = useNavigate();
  const { userName } = useAuth();

  const [amount, setAmount] = useState({
    currency: "KRW",
    value: totalPayment,
  });
  const [ready, setReady] = useState(false); // 위젯이 준비되었는지 여부
  const [widgets, setWidgets] = useState(null); // 위젯 객체

  // totalPayment가 변경될 때마다 amount 값을 업데이트
  useEffect(() => {
    setAmount({
      currency: "KRW",
      value: totalPayment,
    });
  }, [totalPayment]);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      try {
        const tossPayments = await loadTossPayments(clientKey);

        const widgets = tossPayments.widgets({
          customerKey,
        });

        setWidgets(widgets);
      } catch (error) {
        console.error("Error fetching payment widget:", error);
      }
    }

    if (!widgets) {
      fetchPaymentWidgets();
    }
  }, []); // 초기 한번만 호출되도록 빈 의존성 배열

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null || ready) {
        return;
      }

      try {
        // 결제 금액 업데이트
        await widgets.setAmount(amount);

        await Promise.all([
          widgets.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT",
          }),
          widgets.renderAgreement({
            selector: "#agreement",
            variantKey: "AGREEMENT",
          }),
        ]);

        setReady(true); // 위젯 렌더링 완료 후 ready 상태 true로 설정
      } catch (error) {
        console.error("Error rendering payment widgets:", error);
      }
    }

    renderPaymentWidgets();
  }, [widgets, amount, ready]); // ready 상태를 추가하여 중복 렌더링 방지

  return (
      <div className="wrapper">
        <div className="box_section">
          {/* 결제 UI */}
          <div id="payment-method" />
          {/* 이용약관 UI */}
          <div id="agreement" />

          <div style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px" }}>
            총 결제 금액: {totalPayment.toLocaleString()} 원
          </div>

          {/* 결제하기 버튼 */}
          <button
              className="button"
              style={{ marginTop: "30px" }}
              disabled={!ready} // 위젯이 준비되지 않으면 버튼 비활성화
              onClick={async () => {
                try {
                  // 결제 버튼 클릭 시 최신 totalPayment 값을 다시 설정
                  await widgets.setAmount({
                    currency: "KRW",
                    value: totalPayment, // 최신 totalPayment 값으로 결제 설정
                  });

                  console.log("performanceId : " + performanceId)
                  console.log("couponId : " + couponId)
                  console.log("quantity : " + quantity)

                  await widgets.requestPayment({
                    orderId: generateRandomString(),
                    orderName: "공연 티켓 결제",
                    successUrl: window.location.origin + "/widget/success",
                    failUrl: window.location.origin + "/fail",
                    // customerEmail: "customer123@gmail.com",
                    // customerName: "김토스",
                    // customerMobilePhone: "01012341234",
                    metadata: {
                      performanceId: performanceId, // 공연 ID 값
                      couponId: couponId, // 좌석 정보
                      quantity: quantity,
                    },
                  });

                } catch (error) {
                  console.error(error);
                }
              }}
          >
            결제하기
          </button>
        </div>
      </div>
  );
}

function generateRandomString() {
  return window.btoa(Math.random().toString()).slice(0, 20);
}
