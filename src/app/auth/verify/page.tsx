
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: 'Verify Email | ShopHub',
    description: 'Verify your email address',
};

export default function VerifyPage() {
    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Check your email
                </h1>
                <p className="text-sm text-muted-foreground">
                    We&apos;ve sent you a verification link. Please check your email to complete registration.
                </p>
                <Link href="/login">
                    <Button variant="outline" className="w-full">
                        Back to Login
                    </Button>
                </Link>
            </div>
        </div>
    );
}
