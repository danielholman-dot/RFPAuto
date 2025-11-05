
'use client';

import { Button } from "@/components/ui/button";
import { useAuth } from "@/firebase";
import { signInWithGoogle } from "@/firebase/auth/utils";
import { Chrome } from "lucide-react";

export function SignIn() {
    const auth = useAuth();
    return (
        <Button variant="outline" className="w-full" onClick={() => signInWithGoogle(auth)}>
            <Chrome className="mr-2 h-4 w-4" />
            Sign in with Google
        </Button>
    )
}
