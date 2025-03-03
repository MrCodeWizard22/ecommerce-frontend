import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
const Logout = () => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/"; // Redirect user to the home page
  };

  return (
    <div className="flex justify-center items-center ">
      <button
        onClick={handleLogout}
        className="px-3 py-1 sm:px-2 md:px-4 lg:px-6 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );

  // dispatch the logout action
};
export default Logout;
