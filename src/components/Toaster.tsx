"use client"

import { useTheme } from "@teispace/next-themes";
import { useEffect } from "react";
import { Toaster as SonnerToaster, toast} from "sonner";

export default function Toaster({ toastCookie }: { toastCookie: string | undefined }) {
    const { resolvedTheme } = useTheme<"light" | "dark">()
    useEffect(() => {
        if (!toastCookie) return

        const { message, type } = JSON.parse(toastCookie)
        toast[type as "success" | "error" | "info" | "warning" | "message"](message)
        // document.cookie = "toast=; Max-Age=0; path=/"
    }, [toastCookie])

    return <SonnerToaster richColors position="top-center" theme={resolvedTheme}/>
}