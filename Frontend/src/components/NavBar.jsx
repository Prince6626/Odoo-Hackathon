import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header className="bg-[#e3eef9] h-16 flex items-center px-8 shadow-md sticky top-0 z-50">
      {/* Brand Name */}
      <Link
        to="/"
        className="text-xl sm:text-2xl font-bold text-[#ff5e5e] tracking-wide"
      >
        devSkill
      </Link>

      {/* Navigation Links */}
      <nav className="ml-10 hidden sm:flex gap-8 text-gray-700 text-sm font-medium">
        <Link
          to="/connections"
          className="hover:text-[#ff5e5e] transition-colors"
        >
          My Swaps
        </Link>
        <Link
          to="/requests"
          className="hover:text-[#ff5e5e] transition-colors"
        >
          Request
        </Link>
      </nav>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Right Section - User */}
      {user && (
        <div className="flex items-center gap-4">
          {/* Welcome text */}
          <span className="hidden sm:block text-sm text-gray-600">
            Hello, <span className="font-semibold">{user.firstName}</span>
          </span>

          {/* Avatar + dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar ring ring-[#ff5e5e] ring-offset-[#e3eef9] ring-offset-2 hover:scale-105 transition-transform"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="User avatar"
                  src={user.profileUrl}
                  className="object-cover"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-white rounded-box w-52 text-gray-800"
            >
              <li>
                <Link to="/profile" className="hover:text-[#ff5e5e] transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-error hover:text-[#ff5e5e] transition-colors"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
