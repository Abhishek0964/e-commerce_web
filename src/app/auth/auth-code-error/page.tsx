
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AuthCodeError() {
    return (
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
            <div className="text-center space-y-4">
                <h1 className="text-2xl font-bold text-destructive">Authentication Error</h1>
                <p className="text-muted-foreground">
                    There was an error verifying your login information. The link may have expired.
                </p>
                <Link href="/login">
                    <Button>Back to Login</Button>
                </Link>
            </div>
        </div>
    );
}
