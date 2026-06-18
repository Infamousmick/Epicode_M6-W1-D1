import { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getMyProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setUser(null);
          return;
        }

        const response = await fetch(
          `${process.env.REACT_APP_SERVERURL}/auth/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          throw new Error("Impossibile caricare il profilo");
        }
      } catch (e) {
        console.error(e);
        setError(e.message);
      }
    };
    getMyProfile();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("author");
    setUser(null);
    navigate("/login");
  };

  if (!user) {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
          Caricamento...
        </Dropdown.Toggle>
      </Dropdown>
    );
  }
  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        id="dropdown-basic"
        variant="outline-dark"
        className="d-flex align-items-center gap-2"
      >
        <img
          src={user.avatar || "https://ui-avatars.com/api/?name=User"}
          alt="avatar"
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        {user.firstName}
      </Dropdown.Toggle>

      <Dropdown.Menu className="shadow-sm">
        <Dropdown.Header className="fw-bold text-dark border-bottom mb-2">
          {user.firstName} {user.lastName} <br />
          <small className="text-muted fw-normal">{user.email}</small>
        </Dropdown.Header>

        <Dropdown.Item onClick={() => alert("Pagina impostazioni in arrivo!")}>
          Impostazioni Account
        </Dropdown.Item>

        <Dropdown.Divider />

        <Dropdown.Item
          onClick={handleLogout}
          className="d-flex align-items-center gap-2 text-danger fw-bold"
        >
          Esci (Logout)
          <LogOut size={16} />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Profile;
