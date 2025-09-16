import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AdminDashboard from "../features/AdminDashboard/AdminDashboard";
import SellerDashboard from "../features/SellerDashboard/SellerDashboard";
import { UserDashboard } from "../features/UserDashboard/UserDashboard";
const Dashboard = () => {
  const { role, userId } = useSelector((state) => state.auth);

  if (!role || !userId) {
    return <Navigate to="/api/auth/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {role.toLowerCase() === "admin" && <AdminDashboard id={userId} />}
      {role.toLowerCase() === "seller" && <SellerDashboard id={userId} />}
      {role.toLowerCase() === "user" && <UserDashboard id={userId} />}
    </div>
  );
};

export default Dashboard;
