import { useSelector } from "react-redux";
import AdminDashboard from "./AdminDashboard";
import SellerDashboard from "./SellerDashboard";
import UserDashboard from "./UserDashboard";

const Dashboard = () => {
  // Get id and role both from Redux (or from decoded token)
  const { role, userId } = useSelector((state) => state.auth);

  if (!role || !userId) {
    return <div>Unauthorized Access!! Dude </div>;
  }

  return (
    <div>
      {role.toLowerCase() === "admin" && <AdminDashboard id={userId} />}
      {role.toLowerCase() === "seller" && <SellerDashboard id={userId} />}
      {role.toLowerCase() === "user" && <UserDashboard id={userId} />}
    </div>
  );
};

export default Dashboard;
