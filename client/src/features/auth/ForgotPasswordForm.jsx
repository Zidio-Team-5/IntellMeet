import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Mail, Lock, ShieldCheck, ArrowLeft } from "lucide-react";
import Button from "../../shared/ui/Button.jsx";
import Input from "../../shared/ui/Input.jsx";
import Logo from "../../shared/ui/Logo.jsx";
import { forgotPassword, resetPassword } from "../../services/authService.js";

const errMsg = (m, fallback) => m?.response?.data?.message || fallback;

export default function ForgotPasswordForm() {
  const [step, setStep] = useState("email"); // email | reset | done
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pw, setPw] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const requestMutation = useMutation({ mutationFn: forgotPassword });
  const resetMutation = useMutation({ mutationFn: ({ email, code, password }) => resetPassword(email, code, password) });

  const submitEmail = (e) => {
    e.preventDefault();
    if (!email.trim()) { setErrors({ email: "Email is required" }); return; }
    setErrors({});
    requestMutation.mutate(email, { onSuccess: () => setStep("reset") });
  };

  const submitReset = (e) => {
    e.preventDefault();
    const errs = {};
    if (!code.trim()) errs.code = "Enter the 6-digit code";
    if (pw.password.length < 8) errs.password = "Password must be at least 8 characters";
    if (pw.password !== pw.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    resetMutation.mutate({ email, code, password: pw.password }, { onSuccess: () => setStep("done") });
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <Logo />
      </div>

      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-md)]">
        {step === "email" && (
          <>
            <div className="mb-6">
              <h2 className="font-display text-xl font-semibold text-[var(--text)]">Forgot password</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Enter your email and we'll send you a reset code</p>
            </div>

            {requestMutation.isError && (
              <div className="mb-5 rounded-md border border-[var(--border)] bg-[var(--brand-subtle)] px-3 py-2.5 text-sm text-[var(--error)]">
                {errMsg(requestMutation.error, "Couldn't send reset code. Please try again.")}
              </div>
            )}

            <form onSubmit={submitEmail} className="space-y-4">
              <Input
                label="Email" type="email" value={email} icon={Mail}
                placeholder="jane@company.com" error={errors.email}
                onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
              />
              <Button type="submit" className="w-full" size="lg" loading={requestMutation.isPending}>
                Send reset code
              </Button>
            </form>
          </>
        )}

        {step === "reset" && (
          <>
            <div className="mb-6">
              <h2 className="font-display text-xl font-semibold text-[var(--text)]">Check your email</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                If <span className="font-medium text-[var(--text)]">{email}</span> is registered, a code is on its way.
                Enter it below with your new password.
              </p>
            </div>

            {resetMutation.isError && (
              <div className="mb-5 rounded-md border border-[var(--border)] bg-[var(--brand-subtle)] px-3 py-2.5 text-sm text-[var(--error)]">
                {errMsg(resetMutation.error, "Couldn't reset password. Please try again.")}
              </div>
            )}

            <form onSubmit={submitReset} className="space-y-4">
              <Input
                label="Reset code" value={code} icon={ShieldCheck}
                placeholder="123456" maxLength={6} inputMode="numeric" error={errors.code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setErrors((p) => ({ ...p, code: "" })); }}
              />
              <Input
                label="New password" value={pw.password} icon={Lock}
                type={showPw ? "text" : "password"} placeholder="Min. 8 characters"
                error={errors.password}
                onChange={(e) => { setPw((p) => ({ ...p, password: e.target.value })); setErrors((er) => ({ ...er, password: "" })); }}
                rightElement={
                  <button type="button" onClick={() => setShowPw((v) => !v)} aria-label={showPw ? "Hide password" : "Show password"}
                    className="text-[var(--text-muted)] transition-colors hover:text-[var(--text)]">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />
              <Input
                label="Confirm new password" value={pw.confirmPassword} icon={Lock}
                type={showPw ? "text" : "password"} placeholder="Re-enter password"
                error={errors.confirmPassword}
                onChange={(e) => { setPw((p) => ({ ...p, confirmPassword: e.target.value })); setErrors((er) => ({ ...er, confirmPassword: "" })); }}
              />
              <Button type="submit" className="w-full" size="lg" loading={resetMutation.isPending}>
                Reset password
              </Button>
              <button
                type="button"
                onClick={() => requestMutation.mutate(email)}
                disabled={requestMutation.isPending}
                className="w-full text-center text-sm text-[var(--brand)] hover:underline disabled:opacity-50"
              >
                {requestMutation.isPending ? "Sending…" : "Resend code"}
              </button>
            </form>
          </>
        )}

        {step === "done" && (
          <>
            <div className="mb-6">
              <h2 className="font-display text-xl font-semibold text-[var(--text)]">Password reset</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">You can now sign in with your new password.</p>
            </div>
            <Button className="w-full" size="lg" onClick={() => navigate("/")}>
              Go to sign in
            </Button>
          </>
        )}

        {step !== "done" && (
          <p className="mt-5 flex items-center justify-center gap-1 text-center text-sm text-[var(--text-secondary)]">
            <ArrowLeft size={14} />
            <Link to="/" className="font-medium text-[var(--brand)] hover:underline">
              Back to sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
