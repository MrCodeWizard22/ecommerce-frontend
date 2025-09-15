import React from "react";
import { CreditCard } from "lucide-react";

export const PaymentTab = () => (
  <div className="text-center py-8">
    <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
    <p className="text-gray-500 dark:text-gray-400">
      Payment methods coming soon!
    </p>
  </div>
);
