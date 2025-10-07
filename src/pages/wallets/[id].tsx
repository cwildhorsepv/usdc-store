// src/pages/wallet/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API } from "@/api";
import type { ViewportDetail } from "@/types/api";

export default function WalletDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const [viewport, setViewport] = useState<ViewportDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        API.Viewports.get(id as string)
            .then((data) => setViewport(data))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <main className="p-6 text-gray-300">Loading...</main>;
    if (!viewport)
        return (
            <main className="p-6 text-gray-300">
                <p>Viewport not found.</p>
            </main>
        );

    return (
        <main className="p-8 text-gray-200 bg-gray-950 min-h-screen">
            <h1 className="text-3xl font-bold mb-4">{viewport.name}</h1>
            <p className="text-gray-400 mb-6">{viewport.type} Viewport</p>

            <section className="bg-gray-900 rounded-xl p-5 mb-6 border border-gray-800">
                <h2 className="text-xl font-semibold mb-2">Balances</h2>
                <ul className="divide-y divide-gray-800">
                    {viewport.balances.map((b) => (
                        <li key={b.type} className="flex justify-between py-1">
                            <span>{b.type}</span>
                            <span className="font-mono">{b.amount}</span>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="bg-gray-900 rounded-xl p-5 mb-6 border border-gray-800">
                <h2 className="text-xl font-semibold mb-3">Delegations</h2>
                {viewport.delegations.length === 0 && (
                    <p className="text-gray-500 text-sm">No delegations.</p>
                )}
                {viewport.delegations.map((d) => (
                    <div
                        key={d.id}
                        className={`flex justify-between border-b border-gray-800 py-2 ${
                            d.enabled ? "text-green-400" : "text-gray-500"
                        }`}
                    >
                        <span>{d.actorUserId}</span>
                        <span>{d.enabled ? "Enabled" : "Disabled"}</span>
                    </div>
                ))}
            </section>

            <section className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <h2 className="text-xl font-semibold mb-3">Active Pledges</h2>
                {viewport.pledges.length === 0 && (
                    <p className="text-gray-500 text-sm">No pledges yet.</p>
                )}
                {viewport.pledges.map((p) => (
                    <div
                        key={p.id}
                        className="border-t border-gray-800 pt-3 mt-3"
                    >
                        <p>
                            <strong>{p.type}</strong> {p.amount} —{" "}
                            <em className="text-blue-400">{p.status}</em>
                        </p>
                        <ul className="text-sm text-gray-400 mt-1">
                            {p.parties.map((party, i) => (
                                <li key={i}>
                                    {party.role}: {party.user}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>
        </main>
    );
}
