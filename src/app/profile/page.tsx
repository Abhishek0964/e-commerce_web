import { Button } from '@/components/ui/button';

export default function ProfilePage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-8 text-3xl font-bold">My Profile</h1>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Profile Form */}
                    <div className="space-y-6 lg:col-span-2">
                        <div className="rounded-lg border p-6">
                            <h2 className="mb-4 text-xl font-semibold">Personal Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-md border px-3 py-2"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full rounded-md border px-3 py-2"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        className="w-full rounded-md border px-3 py-2"
                                        placeholder="+91 1234567890"
                                    />
                                </div>
                                <Button>Save Changes</Button>
                            </div>
                        </div>

                        <div className="rounded-lg border p-6">
                            <h2 className="mb-4 text-xl font-semibold">Saved Addresses</h2>
                            <p className="text-muted-foreground">
                                No saved addresses yet. Add addresses during checkout.
                            </p>
                        </div>
                    </div>

                    {/* Account Actions */}
                    <div className="space-y-4">
                        <div className="rounded-lg border p-6">
                            <h2 className="mb-4 text-xl font-semibold">Account</h2>
                            <div className="space-y-2">
                                <Button variant="outline" className="w-full">
                                    Change Password
                                </Button>
                                <Button variant="outline" className="w-full">
                                    Manage Addresses
                                </Button>
                                <Button variant="destructive" className="w-full">
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
