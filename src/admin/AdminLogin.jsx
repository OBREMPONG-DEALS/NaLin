import "./AdminLogin.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NalinLogo from "../assets/images/NalinLogo.png";
import {
LockKeyhole,
Mail,
Eye,
EyeOff,
ShieldCheck,
AlertCircle,
} from "lucide-react";


const API_URL = "https://nalin11.onrender.com/api";


function AdminLogin() {
const navigate = useNavigate();

const [showPassword, setShowPassword] = useState(false);
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleSubmit = async (event) => {
event.preventDefault();


setError("");
setLoading(true);

try {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success || !data.token) {
    throw new Error(
      data.message || "Login failed. Please check your credentials."
    );
  }

  if (!data.admin || data.admin.role !== "admin") {
    throw new Error("The server returned an invalid administrator account.");
  }

  // Save the authentication token and admin details.
  localStorage.setItem("ws_token", data.token);
  localStorage.setItem("ws_user", JSON.stringify(data.admin));

  // Open the admin dashboard.
  navigate("/admin", { replace: true });
} catch (err) {
  if (err instanceof TypeError) {
    setError(
      "Cannot connect to the server. Make sure the NaLin backend is running."
    );
  } else {
    setError(err.message || "Unable to sign in. Please try again.");
  }
} finally {
  setLoading(false);
}


};

return ( <main className="nalin-login-page"> <section className="nalin-login-card"> <div className="nalin-login-logo">
<img
src={NalinLogo}
alt="NaLin Fitness Apparels"
onError={(event) => {
event.currentTarget.style.display = "none";
}}
/>


      <span>NaLin</span>
      <p>FITNESS APPARELS</p>
    </div>

    <div className="nalin-login-heading">
      <div className="nalin-login-icon">
        <LockKeyhole size={25} />
      </div>

      <h1>Welcome Back</h1>

      <p>Sign in to access your admin dashboard.</p>
    </div>

    <form onSubmit={handleSubmit}>
      <label htmlFor="admin-email">Email Address</label>

      <div className="nalin-login-input">
        <Mail size={19} />

        <input
          id="admin-email"
          type="email"
          placeholder="Enter your admin email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="username"
          required
        />
      </div>

      <label htmlFor="admin-password">Password</label>

      <div className="nalin-login-input">
        <LockKeyhole size={19} />

        <input
          id="admin-password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />

        <button
          type="button"
          className="nalin-password-toggle"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>

      {error && (
        <div className="nalin-login-error" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        className="nalin-login-button"
        disabled={loading}
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </form>

    <div className="nalin-login-security">
      <ShieldCheck size={18} />
      <span>Authorized administrators only</span>
    </div>

    <p className="nalin-login-footer">
      © {new Date().getFullYear()} NaLin Fitness Apparels
    </p>
  </section>
</main>


);
}

export default AdminLogin;
