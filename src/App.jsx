import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Comments from "./pages/Comments";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import "./styles/App.scss";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/comments"
                element={
                  <ProtectedRoute>
                    <Comments />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/comments" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
