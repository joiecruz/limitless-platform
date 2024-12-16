import { Link } from "react-router-dom";

export function AuthLinks() {
  return (
    <div className="mt-4 text-center text-sm">
      <Link
        to="/forgot-password"
        className="text-indigo-600 hover:text-indigo-500"
      >
        Forgot your password?
      </Link>
    </div>
  );
}