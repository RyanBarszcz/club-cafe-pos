"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StaffLoginPage() {
    const { isLoaded, isSignedIn } = useUser();
    const router = useRouter();

    // console.log(isSignedIn);

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            router.push("/staff");
        }
    }, [isLoaded, isSignedIn, router]);

    if (!isLoaded) {
        return null;
    }

    return (
        <main className="staff-login-page">
            <div className="staff-login-card">
                <div className="staff-login-header">
                    <h1>Staff Login</h1>
                    <p>Liberty Cafe POS Access</p>
                </div>

                <SignIn
                    routing="hash"
                    forceRedirectUrl="/"
                    fallbackRedirectUrl="/staff-login"
                    appearance={{
                        elements: {
                            card: {
                                boxShadow: "none",
                                border: "none",
                            },
                        },
                    }}
                />
            </div>
        </main>
    );
}