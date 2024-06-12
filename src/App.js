import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import './App.css';
import LayoutMain from "./layout/LayoutMain";
function App() {


  return (
    <div className="App">
      <LayoutMain />


      {/* Navbar */}


      {/* <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/sign-in" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/social" element={<Social />} />
          <Route path="/feedback" element={<FinalFeedback />} />
        </Routes> */}



      {/* <div className="container">
          <h2>Login Data</h2>
          <ul>
            {loginData.map((item, index) => (
              <li key={index}>{JSON.stringify(item)}</li>
            ))}
          </ul>
        </div> */}

    </div>
  );
}

export default App;
