import { redirect } from "next/navigation";
import { JSX } from "react/jsx-runtime";

import { logout } from "../api/authAPI";

import LogoutIcon from "../components/icons/LogoutIcon";
import DashboardIcon from "../components/icons/DashboardIcon";
import LightIcon from "../components/icons/LightIcon";
import DarkIcon from "../components/icons/DarkIcon";
import { ThemedIcon } from "@teispace/next-themes";
import EditIcon from "../components/icons/EditIcon";

export const adminDropdownItems = [
  {
    name: "Dashboard",
    icon: <DashboardIcon />,
    onClick: () => redirect("/dashboard"),
  },
  {
    name: "",
    icon: <ThemedIcon variants={{light: <><LightIcon /> Light Mode</>, dark: <><DarkIcon /> Dark Mode</>}}/>,
    onClick: (t: any) =>
      t.setTheme(t.resolvedTheme == "light" ? "dark" : "light"),
  },
  {
    name: "divider",
    divider: true,
  },
  {
    name: "Edit Profile",
    icon: <EditIcon />,
    onClick: () => redirect("/profile/edit")
  },
  {
    name: "Logout",
    icon: <LogoutIcon />,
    onClick: () => logout().then(() => redirect("/"))
  },
];

export const dropdownMap: {
  [type: string]: {
    name: string;
    onClick?: (theme: any) => never | void;
    icon?: JSX.Element;
    divider?: boolean;
  }[];
} = {
  admin: adminDropdownItems,
};
