import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';

const Checkout: React.FC = () => {
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [polling, setPolling] = useState(false); 
  const navigate = useNavigate(); 

  const handleCheckout = async () => {
    if (typeof amount === "number" && amount < 50) {
      alert("Amount must be at least 50 PHP.");
      return;
    }

    if (amount === "") {
      alert("Please enter a valid amount.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8081/checkout", {
        amount: amount,
        description: "Order payment with GCash",
      });

      setPaymentIntentId(response.data.payment_intent_id);
      window.location.href = response.data.checkout_url;
    } catch (error) {
      setError("GCash payment failed. Please try again.");
      console.error("GCash payment error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paymentIntentId && polling) {
      const pollPaymentStatus = setInterval(async () => {
        try {
          const statusResponse = await axios.get(`http://localhost:8081/payment-status/${paymentIntentId}`);
          const status = statusResponse.data.status;

          if (status === "succeeded") {
            clearInterval(pollPaymentStatus);
            navigate("/home");
          } else if (status === "failed") {
            clearInterval(pollPaymentStatus);
            setError("Payment failed. Please try again.");
          }
        } catch (error) {
          console.error("Error checking payment status", error);
          setError("Error retrieving payment status.");
        }
      }, 5000); 

      return () => clearInterval(pollPaymentStatus);
    }
  }, [paymentIntentId, polling, navigate]);

  useEffect(() => {
    if (paymentIntentId) {
      setPolling(true);
    }
  }, [paymentIntentId]);

  return (
   

<div className="container d-flex justify-content-center align-items-center vh-100">
  <div className="card shadow-lg p-4" style={{ width: '400px' }}>
    <h3 className="card-title text-center">Checkout with GCash</h3>
    <div className="card-body">
      <div className="form-group mb-3">
        <label htmlFor="amount" className="form-label">Amount (PHP)</label>
        <input
          type="number"
          className="form-control"
          name="amount"
          placeholder="Enter amount"
          value={amount === 0 ? "" : amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <button
        onClick={handleCheckout}
        className="btn btn-primary btn-block w-100"
      >
        Pay with GCash
      </button>

      {paymentIntentId && !polling && (
        <button
          className="btn btn-secondary btn-block mt-3 w-100"
          onClick={() => setPolling(true)}
        >
          Check Payment Status
        </button>
      )}
    </div>
  </div>
</div>


  

  );
};

export default Checkout;
