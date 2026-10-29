import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import logo from "../assets/LOGO.jpg";
import background from "../assets/store.jpg";
import { NavLink } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Login failed. Please try again.");
      }

      if (!data.token) {
        throw new Error("The server did not return an admin token.");
      }

      // Keep the token for this browser session.
      sessionStorage.setItem("vandaluxe_admin_token", data.token);

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot reach the server. Check that your backend is running."
          : err.message || "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    login: {
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${background})`,
    },
  };

  return (
    <div
      style={styles.login}
      className="flex flex-col h-screen relative w-full items-center justify-center bg-dark px-4 py-8"
    >
      <div className="storeBanner z-2 flex justify-between items-center w-full h-[100px]">
        <span className="font-sm cursor-pointer border border-white-soft text-white-soft p-2 font-thin">
          <NavLink className="font-sm hover:underline" to="/">
            Home
          </NavLink>
          {" / "}Admin
        </span>
      </div>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex w-full max-w-2xl flex-col gap-5 rounded bg-dark-soft/50 p-5 text-white backdrop-blur-2xl lg:flex-row lg:items-center lg:gap-2 lg:p-8"
      >
        <div className="flex items-center justify-center lg:flex-1">
          <img
            src={logo}
            alt="Vandaluxe logo"
            className="h-20 w-20 rounded-full object-cover lg:h-32 lg:w-32"
          />
        </div>

        <div className="mt-2 w-full space-y-5 lg:flex-1">
          <h1
            style={{ fontFamily: "Castoro titling" }}
            className="my-4 border-b border-gray/20 p-2 text-center text-2xl text-white"
          >
            Admin Login
          </h1>

          {error && (
            <p
              role="alert"
              className="rounded border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-gray">
              Email
            </label>

            <input
              type="email"
              name="email"
              id="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              className="w-full border border-gray/20 bg-transparent p-4 outline-none transition focus:border-white"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm text-gray">
              Password
            </label>

            <input
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              required
              className="w-full border border-gray/20 bg-transparent p-4 outline-none transition focus:border-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email.trim() || !password}
            className={`w-full p-4 transition ${
              loading || !email.trim() || !password
                ? "cursor-not-allowed bg-gray/20 text-gray"
                : "cursor-pointer bg-white text-dark hover:bg-gray-200"
            }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="text-center text-xs text-gray">
            Authorized Vandaluxe administrators only.
          </p>
        </div>
      </motion.form>
    </div>
  );
}

export default Login;
