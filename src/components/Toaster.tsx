"use client"

import { useTheme } from "@teispace/next-themes";
import { ToasterProps, Toaster as SonnerToaster} from "sonner";

export default function Toaster(props: ToasterProps) {
    const { resolvedTheme } = useTheme<"light" | "dark">()
    return <SonnerToaster richColors position="top-center" theme={resolvedTheme}/>
}