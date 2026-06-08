import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import Button from "../../shared/ui/Button.jsx";
import Input from "../../shared/ui/Input.jsx";
import Logo from "../../shared/ui/Logo.jsx";
import useRegisterMutation from "../../shared/hooks/useRegisterMutation.js";

export default function RegisterForm() {
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const registerMutation = useRegisterMutation();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const { confirmPassword, ...payload } = form;
    registerMutation.mutate(payload);
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <Logo />
      </div>

      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-md)]">
        <div className="mb-6">
          <h2 className="font-display text-xl font-semibold text-[var(--text)]">Create account</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Start collaborating with AI</p>
        </div>

        {registerMutation.isError && (
          <div className="mb-5 rounded-md border border-[var(--border)] bg-[var(--brand-subtle)] px-3 py-2.5 text-sm text-[var(--error)]">
            {registerMutation.error?.response?.data?.message || "Registration failed. Please try again."}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" name="name" value={form.name} icon={User}
            placeholder="Jane Smith" error={errors.name} onChange={handleChange} />
          <Input label="Email" name="email" type="email" value={form.email} icon={Mail}
            placeholder="jane@company.com" error={errors.email} onChange={handleChange} />
          <Input
            label="Password" name="password" value={form.password} icon={Lock}
            type={showPw ? "text" : "password"} placeholder="Min. 6 characters"
            error={errors.password} onChange={handleChange}
            rightElement={
              <button type="button" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? "Hide password" : "Show password"}
                className="text-[var(--text-muted)] transition-colors hover:text-[var(--text)]">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />
          <Input label="Confirm Password" name="confirmPassword" value={form.confirmPassword}
            icon={Lock} type={showPw ? "text" : "password"} placeholder="Re-enter password"
            error={errors.confirmPassword} onChange={handleChange} />

          <Button type="submit" className="mt-2 w-full" size="lg" loading={registerMutation.isPending}>
            Create account
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{" "}
          <Link to="/" className="font-medium text-[var(--brand)] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}