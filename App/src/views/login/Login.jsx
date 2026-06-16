import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    avatar: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isRegistered) {
      const timer = setTimeout(() => {
        setIsLogin(true);
        setIsRegistered(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isRegistered]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        const response = await fetch("http://localhost:9099/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }

        const { token, author } = await response.json();

        localStorage.setItem("token", token);
        localStorage.setItem("author", JSON.stringify(author));

        navigate("/");
      } else {
        const dynamicAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          formData.firstName + " " + formData.lastName,
        )}&background=random`;

        const dataToSend = {
          ...formData,
          avatar: dynamicAvatar,
        };
        const response = await fetch("http://localhost:9099/authors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }

        setIsRegistered(true);
      }
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  };

  return (
    <div
      className="container mt-5"
      style={{ paddingTop: "100px", paddingBottom: "50px" }}
    >
      <div className="card shadow-sm border-0">
        <div className="card-body p-4 p-md-5">
          <h2 className="text-center mb-4 fw-bold">
            {isLogin ? "Accedi a Strive Blog" : "Registrati a Strive Blog"}
          </h2>

          {isRegistered && (
            <div
              className="alert alert-success text-center fw-bold"
              role="alert"
            >
              Registrazione completata con successo! <br />
              Tra pochi secondi verrai reindirizzato al login...
            </div>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Nome</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Cognome</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Data di nascita</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <div className="mb-3">
              <label className="form-label fw-bold">Email</label>
              <input
                className="form-control form-control-lg"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="mario.rossi@email.com"
              ></input>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="8"
                placeholder="*********"
              ></input>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 fw-bold mb-3"
              >
                {isLogin ? "Login" : "Crea Account"}
              </button>
              <div className="d-flex align-items-center mb-3">
                <hr className="flex-grow-1" />
                <span className="mx-2 text-muted">OPPURE</span>
                <hr className="flex-grow-1" />
              </div>

              <button
                type="button"
                className="btn btn-outline-dark btn-lg w-100 fw-bold mb-3 d-flex align-items-center justify-content-center gap-2"
                onClick={() =>
                  (window.location.href = "http://localhost:9099/auth/google")
                }
              >
                <img
                  src="https://www.svgrepo.com/show/303108/google-icon-logo.svg"
                  alt="Google Logo"
                  style={{ width: "20px" }}
                />
                Accedi con Google
              </button>
              <div className="text-center mt-3">
                <span className="text-muted">
                  {isLogin ? "Non hai un account? " : "Hai già un account? "}
                </span>
                <button
                  type="button"
                  className="btn btn-link text-decoration-none fw-bold p-0 m-0 align-baseline"
                  onClick={toggleMode}
                >
                  {isLogin ? "Registrati qui" : "Accedi qui"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
