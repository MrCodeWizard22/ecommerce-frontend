import React from "react";
import { Sidebar } from "./Sidebar";
import { ProfileTab } from "./ProfileTab";
import { OrdersTab } from "./OrdersTab";
import { WishlistTab } from "./WishlistTab";
import { Loading } from "./Loading";
import { Error } from "./Error";
import { useUserDashboard } from "./useUserDashboard";
import { AddressesTab } from "./AddressesTab";
import { PaymentTab } from "./PaymentTab";
import { SettingsTab } from "./SettingsTab";

export const UserDashboard = () => {
  const {
    loading,
    error,
    userProfile,
    setUserProfile,
    isEditing,
    setIsEditing,
    orders,
    wishlist,
    setWishlist,
    activeTab,
    setActiveTab,
  } = useUserDashboard();

  const renderContent = () => {
    switch (activeTab) {
      case "Profile":
        return (
          <ProfileTab
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        );
      case "Orders":
        return <OrdersTab orders={orders} />;
      case "Wishlist":
        return <WishlistTab wishlist={wishlist} setWishlist={setWishlist} />;
      case "Addresses":
        return <AddressesTab />;
      case "Payment Methods":
        return <PaymentTab />;
      case "Settings":
        return <SettingsTab />;
      default:
        return <ProfileTab />;
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userName={userProfile.name}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="pt-8 px-6">{renderContent()}</div>
      </div>
    </div>
  );
};
