import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Checkout from './Checkout'; // Import your Checkout component
import Success from './Sucess';
import Failed from './Failed';
import PaymentConfirmation from './PaymentConfirmation';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home route */}
        <Route path="/" element={<div>Home</div>} />
        
        {/* Checkout route */}
        <Route path="/checkout" element={<Checkout />} />

            {/* Payment confirmation route */}
            <Route path="/payment-confirmation" element={<PaymentConfirmation />} />

        <Route path="/success" element={<Success/>} />
        <Route path="/fail" element={<Failed/>} />
      </Routes>
    </Router>
  );
};

export default App;
