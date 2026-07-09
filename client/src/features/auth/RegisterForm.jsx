import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ShieldCheck } from "lucide-react";
import Button from "../../shared/ui/Button.jsx";
import Input from "../../shared/ui/Input.jsx";
import Logo from "../../shared/ui/Logo.jsx";
import useRegisterMutation, {
  useResendOtpMutation,
  useVerifyOtpMutation,
  useSetPasswordMutation,
} from "../../shared/hooks/useRegisterMutation.js";

const errMsg = (m, fallback) => m?.response?.data?.message || fallback;

// 3-step signup: (1) name+email -> emailed OTP, (2) enter OTP, (3) set password.
export default function RegisterForm() {
  const [step, setStep] = useState("details"); // details | otp | password
  const [showPw, setShowPw] = useState(false);
  const [details, setDetails] = useState({ name: "", email: "" });
  const [code, setCode] = useState("");
  const [pw, setPw] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});

  const registerMutation = useRegisterMutation();
  const resendMutation = useResendOtpMutation();
  const verifyMutation = useVerifyOtpMutation();
  const setPasswordMutation = useSetPasswordMutation();

  const handleDetailsChange = (e) => {
    setDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const submitDetails = (e) => {
    e.preventDefault();
    const errs = {};
    if (!details.name.trim()) errs.name = "Name is required";
    if (!details.email.trim()) errs.email = "Email is required";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    registerMutation.mutate(details, { onSuccess: () => setStep("otp") });
  };

  const submitOtp = (e) => {
    e.preventDefault();
    if (!code.trim()) { setErrors({ code: "Enter the 6-digit code" }); return; }
    verifyMutation.mutate({ email: details.email, code }, { onSuccess: () => setStep("password") });
  };

  const submitPassword = (e) => {
    e.preventDefault();
    const errs = {};
    if (pw.password.length < 8) errs.password = "Password must be at least 8 characters";
    if (pw.password !== pw.confirmPassword) errs.confirmPassword = "Passwords do not match";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setPasswordMutation.mutate({ email: details.email, password: pw.password });
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <Logo />
      </div>

      <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-8 shadow-[var(--shadow-md)]">
        {step === "details" && (
          <>
            <div className="mb-6">
              <h2 className="font-display text-xl font-semibold text-[var(--text)]">Create account</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">We'll email you a verification code</p>
            </div>

            {registerMutation.isError && (
              <div className="mb-5 rounded-md border border-[var(--border)] bg-[var(--brand-subtle)] px-3 py-2.5 text-sm text-[var(--error)]">
                {errMsg(registerMutation.error, "Registration failed. Please try again.")}
              </div>
            )}

            <form onSubmit={submitDetails} className="space-y-4">
              <Input label="Full Name" name="name" value={details.name} icon={User}
                placeholder="Jane Smith" error={errors.name} onChange={handleDetailsChange} />
              <Input label="Email" name="email" type="email" value={details.email} icon={Mail}
                placeholder="jane@company.com" error={errors.email} onChange={handleDetailsChange} />

              <Button type="submit" className="mt-2 w-full" size="lg" loading={registerMutation.isPending}>
                Send verification code
              </Button>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <div className="mb-6">
              <h2 className="font-display text-xl font-semibold text-[var(--text)]">Check your email</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Enter the 6-digit code we sent to <span className="font-medium text-[var(--text)]">{details.email}</span>
              </p>
            </div>

            {verifyMutation.isError && (
              <div className="mb-5 rounded-md border border-[var(--border)] bg-[var(--brand-subtle)] px-3 py-2.5 text-sm text-[var(--error)]">
                {errMsg(verifyMutation.error, "Invalid code. Please try again.")}
              </div>
            )}

            <form onSubmit={submitOtp} className="space-y-4">
              <Input
                label="Verification code" name="code" value={code} icon={ShieldCheck}
                placeholder="123456" maxLength={6} inputMode="numeric" error={errors.code}
                onChange={(e) => { setCode(e.target.value.replace(/\D/g, "")); setErrors((p) => ({ ...p, code: "" })); }}
              />
              <Button type="submit" className="w-full" size="lg" loading={verifyMutation.isPending}>
                Verify
              </Button>
              <button
                type="button"
                disabled={resendMutation.isPending}
                onClick={() => resendMutation.mutate(details.email)}
                className="w-full text-center text-sm text-[var(--brand)] hover:underline disabled:opacity-50"
              >
                {resendMutation.isPending ? "Sending…" : resendMutation.isSuccess ? "Code resent!" : "Resend code"}
              </button>
            </form>
          </>
        )}

        {step === "password" && (
          <>
            <div className="mb-6">
              <h2 className="font-display text-xl font-semibold text-[var(--text)]">Set your password</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Email verified — last step</p>
            </div>

            {setPasswordMutation.isError && (
              <div className="mb-5 rounded-md border border-[var(--border)] bg-[var(--brand-subtle)] px-3 py-2.5 text-sm text-[var(--error)]">
                {errMsg(setPasswordMutation.error, "Couldn't set password. Please try again.")}
              </div>
            )}

            <form onSubmit={submitPassword} className="space-y-4">
              <Input
                label="Password" name="password" value={pw.password} icon={Lock}
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
              <Input label="Confirm Password" name="confirmPassword" value={pw.confirmPassword}
                icon={Lock} type={showPw ? "text" : "password"} placeholder="Re-enter password"
                error={errors.confirmPassword}
                onChange={(e) => { setPw((p) => ({ ...p, confirmPassword: e.target.value })); setErrors((er) => ({ ...er, confirmPassword: "" })); }}
              />

              <Button type="submit" className="mt-2 w-full" size="lg" loading={setPasswordMutation.isPending}>
                Create account
              </Button>
            </form>
          </>
        )}

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
