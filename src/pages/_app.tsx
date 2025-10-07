// src/pages/_app.tsx
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { ThemeProvider } from "../context/ThemeContext";
import type { AppProps } from "next/app";

import "../styles/globals.css";
import "../styles/brand.css";
import "../styles/glow.css";

export default function App({ Component, pageProps }: AppProps) {
    return (
        // 👇 prevents the SDK from hitting /api/auth/me
        <UserProvider skipFetch>
            <ThemeProvider>
                <Component {...pageProps} />
            </ThemeProvider>
        </UserProvider>
    );
}
