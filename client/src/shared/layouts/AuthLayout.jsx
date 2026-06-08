import { motion } from "framer-motion";
import AuthHero from "../../features/auth/AuthHero.jsx";
import ThemeToggle from "../ui/ThemeToggle.jsx";

export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-[var(--background)] text-[var(--text)]">
      <div className="absolute right-5 top-5 z-50">
        <ThemeToggle />
      </div>
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="hidden items-center justify-center border-r border-[var(--border)] bg-[var(--bg-surface)] p-12 lg:flex">
          <AuthHero />
        </div>
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="flex items-center justify-center p-6"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}