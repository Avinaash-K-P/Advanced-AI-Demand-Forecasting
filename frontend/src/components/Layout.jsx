import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Layout({ children }) {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");

    navigate("/");
  };

  useEffect(() => {

  const token = localStorage.getItem("token");

  if (!token) {

    navigate("/");
    alert("Please log in to access the dashboard.");
  }

  }, []);

  return (

    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <div className="  w-64
    bg-gradient-to-b
    from-emerald-950
    via-green-900
    to-emerald-800
    text-white
    p-6
    hidden
    md:block
    shadow-2xl">

        <h1 className="text-2xl font-bold mb-10">
          AI Forecast
        </h1>

        <nav className="space-y-4">

          <Link
            to="/dashboard"
            className="
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            Dashboard
          </Link>

          <Link
            to="/upload"
            className="
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            Upload Dataset
          </Link>

          <Link
            to="/forecast"
            className="
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            Forecast
          </Link>

          <Link
            to="/reports"
            className="
             block px-4
             py-3
             rounded-xl
             hover:bg-white/10
             hover:text-green-200
             transition
            "
          >
            Reports
          </Link>

          <button
            onClick={handleLogout}
            className="
            mt-10
            w-full
            bg-white/10
            border
            border-white/20
            px-4
            py-3
            rounded-2xl
            hover:bg-red-500
            hover:border-red-500
            transition
            font-semibold
            backdrop-blur-md
          "
          >
            Logout
          </button>

        </nav>

      </div>

      {/* Page Content */}
      <div className="flex-1 p-6">

        {children}

      </div>

    </div>
  );
}

export default Layout;