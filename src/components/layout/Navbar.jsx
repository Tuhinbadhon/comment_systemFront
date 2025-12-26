import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { toastSuccess } from "../../utils/toast";
import "./Navbar.scss";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(user);

  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const data = user?.data;

  React.useEffect(() => {
    // Reset logout state when auth user changes (login/logout/reload)
    setIsLoggingOut(false);
  }, [user]);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed && !isLoggingOut) {
        setIsLoggingOut(true);
        dispatch(logout());
        toastSuccess("Logged out successfully");
        navigate("/");
      }
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Comment System
        </Link>
        <div className="navbar-menu">
          {data ? (
            <>
              <span className="navbar-user">Welcome, {data.user?.name}</span>
              <button
                onClick={handleLogout}
                className="btn btn-logout"
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-link">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
