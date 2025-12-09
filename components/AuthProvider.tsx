"use client";

import React, { useEffect, useState } from "react";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User authenticated:", user.email);
        setIsAuthenticated(true);
        
        // If on login or register page, redirect to home page
        if (pathname === "/login" || pathname === "/register" || pathname === "/auth/login" || pathname === "/auth/register") {
          router.push("/");
        }
      } else {
        console.log("User not authenticated");
        setIsAuthenticated(false);
        
        // If on protected route (not auth page), redirect to login
        if (pathname?.startsWith("/dashboard")) {
          router.push("/login");
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{
        background: "linear-gradient(180deg, #0F2139 0%, #132742 50%, #1A5AA8 100%)"
      }}>
        <div className="text-white text-lg">Đang tải...</div>
      </div>
    );
  }

  return <>{children}</>;
}
