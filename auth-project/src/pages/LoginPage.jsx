import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { validateEmail, validatePassword } from "../utils/validation";

function LoginPage() {
  const { login, user, isLoading } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  if (isLoading) {
    return <p className="p-8">Loading...</p>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    setErrors(newErrors);
    setMessage("");

    if (Object.values(newErrors).some(Boolean)) {
      return;
    }

    try {
      setLoading(true);

      await login({ email, password });

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setMessage(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-lg"
      >
        <h1 className="text-center text-3xl font-bold">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500">
          Login to your account
        </p>

        {location.state?.registered && (
          <p className="rounded bg-green-100 p-3 text-green-700">
            Registration successful! Please login.
          </p>
        )}

        {message && (
          <p className="rounded bg-red-100 p-3 text-red-700">
            {message}
          </p>
        )}

        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({
                ...prev,
                email: validateEmail(e.target.value),
              }));
            }}
            className="w-full rounded-lg border p-3"
          />

          {errors.email && (
            <p className="text-sm text-red-500">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({
                ...prev,
                password: validatePassword(e.target.value),
              }));
            }}
            className="w-full rounded-lg border p-3"
          />

          {errors.password && (
            <p className="text-sm text-red-500">
              {errors.password}
            </p>
          )}

          <label className="mt-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Show password
          </label>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            Remember me
          </label>

          <button
            type="button"
            onClick={() =>
              setMessage(
                "Forgot password is not implemented yet."
              )
            }
            className="text-blue-600"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;