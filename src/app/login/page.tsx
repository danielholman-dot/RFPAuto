
import { SignIn } from "@/components/auth/sign-in";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Sign in to access the MARCUS Automation Suite.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <SignIn />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
