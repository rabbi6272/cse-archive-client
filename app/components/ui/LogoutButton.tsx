"use client";

import React, { type ReactNode } from "react";
import { useRouter } from "next/navigation";
import FirebaseAuthService from "@/lib/firebase-auth-service";
import AuthUtils from "@/lib/auth-utils-secure";
import { logoutAction } from "@/features/auth/actions";
import toast from "react-hot-toast";

export interface LogoutButtonProps {
  className?: string;
  variant?: "danger" | "outline" | "ghost" | "minimal" | "default";
  showIcon?: boolean;
  children?: ReactNode;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = "",
  variant = "default",
  showIcon = true,
  children,
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutAction(); // clears the HttpOnly __session on the server
      await FirebaseAuthService.signOut(); // anonymous data-access auth (RTDB), not user login
      const success = AuthUtils.logout();

      if (success) {
        toast.success("Logged out successfully!");
        router.push("/user/login");
        router.refresh();
      } else {
        toast.error("Error during logout");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An error occurred during logout");
    }
  };

  const getVariantClasses = (): string => {
    switch (variant) {
      case "danger":
        return "bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600";
      case "outline":
        return "bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 border-red-300 dark:border-red-600 hover:border-red-400";
      case "ghost":
        return "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border-transparent";
      case "minimal":
        return "bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 border-none shadow-none hover:shadow-none";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white border-gray-500 hover:border-gray-600";
    }
  };

  const baseClasses =
    "px-4 py-2 rounded-lg border font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 flex items-center gap-2";

  return (
    <button
      onClick={handleLogout}
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      title="Logout"
    >
      {showIcon && <i className="fas fa-sign-out-alt"></i>}
      {children || "Logout"}
    </button>
  );
};

export default LogoutButton;
