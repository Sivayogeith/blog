"use client"

import { ThemedIcon, useTheme } from "@teispace/next-themes";
import DarkIcon from "./icons/DarkIcon";
import LightIcon from "./icons/LightIcon";

export default function ThemeButton() {
  const { resolvedTheme, setTheme } = useTheme();
  return <button onClick={() => setTheme(resolvedTheme == "light" ? "dark" : "light")} className="border-0! p-0!"><ThemedIcon variants={{light: <LightIcon />, dark: <DarkIcon />}}/></button>
}
