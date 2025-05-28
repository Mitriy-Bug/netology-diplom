import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import './layouts/client/css/styles.css';
//import './layouts/admin/CSS/styles.css';
import MovieDetailsComponent from './components/clientComponents/MovieDetailsComponent';
import HallComponent from './components/clientComponents/HallComponent';
import PaymentComponent from './components/clientComponents/PaymentComponent';
import ConfirmationComponent from './components/clientComponents/ConfirmationComponent';
import AdministratorMainComponent from './components/adminComponents/AdministratorMainComponent';



function App() {
  return (
    <>    
      <Router>
        <Routes>
          <Route path="/" element={<MovieDetailsComponent />} />
          <Route path="hall/:sessionId" element={<HallComponent />} />
          <Route path="ticket" element={<PaymentComponent />} />
          <Route path="confirm" element={<ConfirmationComponent />} />

          <Route path="/administrator" element={<AdministratorMainComponent />} />
        </Routes>
      </Router>
    </>


  );
}

export default App;
