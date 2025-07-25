import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Navbar from './components/Navbar';
import NoteState from './context/notes/NotesState';
import Alert from './components/Alert';
import Signup from './components/Signup';
import Login from './components/Login';
import ProtectedRoute from "./components/ProtectedRoute"; // ✅ Import


const App = () => {
  const [alert, setAlert] = useState(null);
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    });

    // auto-dismiss after 3 seconds
    setTimeout(() => {
      setAlert(null);
    }, 3500);
  }
  return (
    <>
      <NoteState>
        <Router>
          <Navbar showAlert={showAlert}/>
          <Alert alert={alert}/>
          <div className="container">
            <Routes>
 
              <Route path="/" element={<ProtectedRoute> <Home  showAlert={showAlert} /> </ProtectedRoute>} />
   
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login showAlert={showAlert}/>} />
              <Route path="/signup" element={<Signup showAlert={showAlert}/>} />

            </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
};

export default App;
