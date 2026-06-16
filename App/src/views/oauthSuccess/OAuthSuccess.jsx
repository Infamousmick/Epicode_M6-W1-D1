import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    const getMe = async () => {
      try {
        const response = await fetch("http://localhost:9099/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const authorData = await response.json();
          localStorage.setItem("author", JSON.stringify(authorData));
          navigate("/");
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };
    if (token) {
      localStorage.setItem("token", token);
      getMe();
    } else {
      navigate("/login");
    }
  }, [location, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Accesso in corso...</span>
      </div>
      <h2 className="ms-3">Accesso con Google in corso...</h2>
    </div>
  );
};

export default OAuthSuccess;
