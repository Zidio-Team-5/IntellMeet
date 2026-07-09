import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Button from "../../shared/ui/Button.jsx";
import Input from "../../shared/ui/Input.jsx";
import Logo from "../../shared/ui/Logo.jsx";
import useLoginMutation from "../../shared/hooks/useLoginMutation.js";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const loginMutation = useLoginMutation();
  const navigate = useNavigate();

  const errorCode = loginMutation.error?.response?.data?.code;
  const errorMessage = loginMutation.error?.response?.data?.message;

  // No account with this email — send them to signup instead of just erroring.
  useEffect(() => {
    if (errorCode === "NO_ACCOUNT") {
      const t = setTimeout(() => navigate("/register", { state: { email: form.email } }), 1600);
      return () => clearTimeout(t);
    }
  }, [errorCode, form.email, navigate]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(form);
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <Logo />
      </div>

      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-md)]">
        <div className="mb-6">
          <h2 className="font-display text-xl font-semibold text-[var(--text)]">Welcome back</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Sign in to your workspace</p>
        </div>

        {loginMutation.isError && (
          <div className="mb-5 rounded-md border border-[var(--border)] bg-[var(--brand-subtle)] px-3 py-2.5 text-sm text-[var(--error)]">
            {errorCode === "NO_ACCOUNT"
              ? "No account with this email — taking you to sign up…"
              : errorMessage || "Invalid credentials. Please try again."}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email" name="email" type="email" value={form.email}
            placeholder="name@company.com" icon={Mail} autoComplete="email" required onChange={handleChange}
          />
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--text)]">Password</label>
              <Link to="/forgot-password" className="text-xs font-medium text-[var(--brand)] hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              name="password" type={showPassword ? "text" : "password"} value={form.password}
              placeholder="Enter your password" icon={Lock} autoComplete="current-password" required onChange={handleChange}
              rightElement={
                <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-[var(--text-muted)] transition-colors hover:text-[var(--text)]">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />
          </div>

          <Button type="submit" className="mt-2 w-full" size="lg" loading={loginMutation.isPending}>
            Sign in
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-[var(--text-secondary)]">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-[var(--brand)] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}