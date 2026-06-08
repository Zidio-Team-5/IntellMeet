import AuthLayout from "../shared/layouts/AuthLayout.jsx";
import LoginForm from "../features/auth/LoginForm.jsx";
import PublicRoute from "../routes/PublicRoute.jsx";

export default function Login() {
  return (
    <PublicRoute>
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </PublicRoute>
  );
}
