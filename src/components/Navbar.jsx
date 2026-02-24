import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Navbar.css";

function Navbar({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let userId = null;
  let username = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
      username = decoded.username || "";
    } catch (err) {
      console.log("Invalid token", err);
    }
  }

  return (
    <div className="navbar">
      <div className="nav-title" onClick={() => navigate("/dashboard")}>
        Writora
      </div>

      {token && (
        <div className="nav-actions">
          <button
            className="btn btn-outline"
            onClick={() => navigate("/create")}
          >
            New Post
          </button>

          <button
            className="btn btn-danger"
            onClick={() => {
              localStorage.removeItem("token");
              setIsLoggedIn(false);  
              navigate("/");
            }}
          >
            Logout
          </button>

          {/* Profile Icon */}
          <div
            className="profile-icon"
            onClick={() => navigate(`/profile/${userId}`)}
            title="Go to Profile"
          >
            {username ? username.charAt(0).toUpperCase() : "U"}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;