import useSWR from "swr";
import Layout from "../components/Layout";
import Link from "next/link";

const fetcher = (url: string) =>
    fetch(url, { credentials: "include" }).then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
    });

export default function Profile() {
    const { data: user, error } = useSWR("/api/me", fetcher);

    if (error)
        return (
            <Layout>
                <p className="text-red-500">
                    Error loading profile: {error.message || "Unknown error"}
                </p>
            </Layout>
        );

    if (!user)
        return (
            <Layout>
                <p className="text-gray-400">Loading profile…</p>
            </Layout>
        );

    return (
        <Layout>
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>

            <div className="p-6 bg-gray-800 rounded-xl space-y-2">
                <p>
                    <strong>Name:</strong> {user.name}
                </p>
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
                <p>
                    <strong>Viewports:</strong> {user.viewports?.length ?? 0}
                </p>
            </div>

            <div className="mt-6 text-center">
                <Link href="/api/auth/logout" className="btn-secondary">
                    Log out
                </Link>
            </div>
        </Layout>
    );
}
