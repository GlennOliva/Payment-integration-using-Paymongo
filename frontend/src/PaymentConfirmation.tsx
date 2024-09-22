import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentConfirmation: React.FC = () => {
    const history = useNavigate();
  
    useEffect(() => {
      const checkPaymentStatus = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentIntentId = urlParams.get('payment_intent_id');
  
        if (paymentIntentId) {
          try {
            const response = await axios.get(`http://localhost:8081/payment-status/${paymentIntentId}`);
            if (response.data.status === 'succeeded') {
              history('/home'); // Redirect to home after successful payment
            } else {
              history('/fail'); // Redirect to fail page if payment unsuccessful
            }
          } catch (error) {
            console.error('Error checking payment status', error);
            history('/fail'); // Redirect to fail page in case of error
          }
        }
      };
  
      checkPaymentStatus();
    }, [history]);
  
    return <div>Processing your payment...</div>;
  };
  
  export default PaymentConfirmation;
  