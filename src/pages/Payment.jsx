import React from "react";
import { useLocation } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const { amount } = location.state || {};
  return (
    <div>
      Proceed Payment of Rs. {amount} <br />
      <button></button>
    </div>
  );
};

export default Payment;
