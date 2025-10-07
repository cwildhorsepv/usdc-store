import useSWR from "swr";
import Layout from "../../components/Layout";

const fetcher = (url: string) =>
    fetch(url, { credentials: "include" }).then((r) => r.json());

export default function WalletOverview() {
    const { data, error } = useSWR("/api/wallet/overview", fetcher);

    if (error)
        return (
            <Layout>
                <p className="text-red-500">
                    Error loading wallets: {error.message}
                </p>
            </Layout>
        );
    if (!data)
        return (
            <Layout>
                <p className="text-gray-400">Loading wallets…</p>
            </Layout>
        );

    const { viewports } = data;
    return (
        <Layout>
            <h1 className="text-3xl font-bold mb-6">My Wallets</h1>
            <ul className="grid md:grid-cols-2 gap-4">
                {viewports.map((v: any) => (
                    <li key={v.id} className="uv-card uv-glow p-4 rounded-xl">
                        <h2 className="text-lg font-semibold">{v.name}</h2>
                        <p>Type: {v.type}</p>
                        <p className="text-xs text-gray-400">ID: {v.id}</p>
                    </li>
                ))}
            </ul>
        </Layout>
    );
}
