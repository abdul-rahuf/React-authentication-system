import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-lg">

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <img
            src={user.avatar}
            alt={user.fullName}
            className="h-24 w-24 rounded-full object-cover"
          />

          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold">
              Welcome, {user.fullName}!
            </h1>

            <p className="text-gray-500">
              Your User Dashboard
            </p>
          </div>
        </div>

        <hr className="my-6" />

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-semibold">{user.fullName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Username</p>
            <p className="font-semibold">{user.username}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Joined At</p>
            <p className="font-semibold">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full rounded-lg bg-red-600 p-3 font-semibold text-white hover:bg-red-700"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default DashboardPage;