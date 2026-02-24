import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import EditPost from "./pages/EditPost";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";


function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  // Check token on first load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true); // ✅ trigger re-render
        navigate("/dashboard");
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}

      <Routes>
        <Route
          path="/"
          element={
            <>
            <div className="welcome">Welcome !!! login to start scribbling</div>
              
            <div className="login-container">
              <div className="card">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button type="submit" className="btn btn-primary">
                    Login
                  </button>

                  <p style={{ marginTop: "15px" }}>
                    Don’t have an account?{" "}
                    <span
                      className="link"
                      onClick={() => navigate("/register")}
                    >
                      Register here
                    </span>
                  </p>
                </form>
              </div>
            </div></>
          }
        />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/create" element={<CreatePost />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/profile/:id" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;