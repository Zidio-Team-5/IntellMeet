import AuthLayout from "../shared/layouts/AuthLayout.jsx";
import ForgotPasswordForm from "../features/auth/ForgotPasswordForm.jsx";
import PublicRoute from "../routes/PublicRoute.jsx";

export default function ForgotPassword() {
  return (
    <PublicRoute>
      <AuthLayout>
        <ForgotPasswordForm />
      </AuthLayout>
    </PublicRoute>
  );
}
