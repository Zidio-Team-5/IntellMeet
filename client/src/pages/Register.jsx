import AuthLayout from "../shared/layouts/AuthLayout.jsx";
import RegisterForm from "../features/auth/RegisterForm.jsx";
import PublicRoute from "../routes/PublicRoute.jsx";

export default function Register() {
  return (
    <PublicRoute>
      <AuthLayout>
        <RegisterForm />
      </AuthLayout>
    </PublicRoute>
  );
}
