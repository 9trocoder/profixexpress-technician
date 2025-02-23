import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";
import Signuppage from "./screen/Signuppage";
import { useEffect, useState } from "react";
import { get, getDatabase, ref } from "firebase/database";
import Infopage from "./screen/infopage";
import InfopageTwo from "./screen/infopage_two";
import Dashboard from "./screen/Dashboard";
import Authpage from "./screen/authpage";
import PrivateRoute from "./utilities/ProtectedRoute";
import SignIn from "./screen/SignIn";

const googleMapsApiKey = "AIzaSyCeirrtXS_SjOfBcSX_-uetXg0jtsawF-s";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Authpage />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<Signuppage />} />
        <Route path='/info_one' element={<Infopage />} />
        <Route path='/info_two' element={<InfopageTwo />} />
        <Route
          path='/dashboard'
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
