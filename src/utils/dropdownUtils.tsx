import LogoutIcon from "../components/icons/LogoutIcon";
import DashboardIcon from "../components/icons/DashboardIcon";
import LightIcon from "../components/icons/LightIcon";
import DarkIcon from "../components/icons/DarkIcon";
import { ThemedIcon, useTheme } from "@teispace/next-themes";

import { logout } from "../api/authAPI";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReactNode } from "react";
import UserIcon from "../components/icons/UserIcon";

interface Dropdown {
  name: string;
  onClick?: (
    router: AppRouterInstance,
    theme: ReturnType<typeof useTheme>,
  ) => Promise<void> | void;
  icon?: ReactNode;
  divider?: boolean;
  adminOnly?: boolean;
}

export const adminDropdownItems: Dropdown[] = [
  {
    name: "Dashboard",
    icon: <DashboardIcon />,
    onClick: (r) => r.push("/admin/dashboard"),
    adminOnly: true,
  },
  {
    name: "Profile",
    icon: <UserIcon />,
    onClick: (r) => r.push("/profile"),
  },
  {
    name: "",
    icon: (
      <ThemedIcon
        variants={{
          light: (
            <>
              <LightIcon /> Light Mode
            </>
          ),
          dark: (
            <>
              <DarkIcon /> Dark Mode
            </>
          ),
        }}
      />
    ),
    onClick: (_, t) =>
      t.setTheme(t.resolvedTheme == "light" ? "dark" : "light"),
  },
  {
    name: "divider",
    divider: true,
  },
  {
    name: "Logout",
    icon: <LogoutIcon />,
    onClick: (r) =>
      logout().then(() => {
        window.location.href = "/";
        r.replace("/");
      }),
  },
];

export const dropdownMap: { [type: string]: Dropdown[] } = {
  admin: adminDropdownItems,
};

export const hideNavbarRoutes: string[] = ["/login", "/register"];
