// src/pages/wallet/[id].tsx
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import useSWR from "swr";

const fetcher = (url: string) =>
    fetch(url, { credentials: "include" }).then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
    });

export default function WalletDetail() {
    const router = useRouter();
    const { id } = router.query;

    const { data: wallet, error } = useSWR(
        id ? `/api/wallet/${id}` : null,
        fetcher,
    );

    if (error)
        return (
            <Layout>
                <p className="text-red-500">
                    Error loading wallet: {error.message}
                </p>
            </Layout>
        );

    if (!wallet)
        return (
            <Layout>
                <p className="text-gray-400">Loading wallet…</p>
            </Layout>
        );

    return (
        <Layout>
            <h1 className="text-2xl font-bold mb-4">{wallet.name}</h1>

            <div className="p-4 border rounded bg-white dark:bg-gray-900 space-y-2">
                <p>
                    <strong>Viewport ID:</strong> {wallet.id}
                </p>
                <p>
                    <strong>Type:</strong> {wallet.type}
                </p>
                <p>
                    <strong>Created:</strong>{" "}
                    {new Date(wallet.createdAt).toLocaleString()}
                </p>

                {wallet.balance !== undefined && (
                    <p>
                        <strong>Balance:</strong> {wallet.balance} USDC
                    </p>
                )}

                {wallet.endpoints?.length > 0 && (
                    <>
                        <h2 className="text-lg font-semibold mt-4">
                            Endpoints
                        </h2>
                        <ul className="list-disc list-inside">
                            {wallet.endpoints.map((e: any) => (
                                <li key={e.endpointId}>
                                    {e.endpoint.name} ({e.endpoint.type})
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </Layout>
    );
}
