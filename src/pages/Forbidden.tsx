import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "24px 0" }}>
      <Result
        status="403"
        title="403"
        subTitle="Kechirasiz, sizda bu sahifaga kirish huquqi yo'q."
        extra={
          <Button type="primary" onClick={() => navigate("/dashboard")}>
            Bosh sahifaga qaytish
          </Button>
        }
      />
    </div>
  );
}
