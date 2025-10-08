import { motion } from "framer-motion";
import Link from "next/link";
import { WHY } from "../content/why";

export default function WhyUsdcStore() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Left: narrative */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-extrabold text-neutral-900"
          >
            {WHY.tagline}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.04 }}
            className="mt-3 text-lg text-neutral-600"
          >
            {WHY.valueProp}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-6 space-y-4"
          >
            <blockquote className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-neutral-200">
              <div className="text-sm font-semibold text-neutral-900 mb-1">
                For consumers
              </div>
              <p className="text-sm text-neutral-700">
                {WHY.elevator.consumer}
              </p>
            </blockquote>
            <blockquote className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-neutral-200">
              <div className="text-sm font-semibold text-neutral-900 mb-1">
                For merchants
              </div>
              <p className="text-sm text-neutral-700">
                {WHY.elevator.merchant}
              </p>
            </blockquote>
          </motion.div>

          <motion.ul
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.05 } },
            }}
            className="mt-6 grid gap-2"
          >
            {WHY.differentiators.map((d) => (
              <motion.li
                key={d}
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  show: { opacity: 1, y: 0 },
                }}
                className="flex items-start gap-2 text-sm text-neutral-800"
              >
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                <span>{d}</span>
              </motion.li>
            ))}
          </motion.ul>

          <div className="mt-8 flex gap-3">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-white font-semibold shadow-sm hover:bg-emerald-500 transition"
            >
              Try Checkout
            </Link>
            <Link
              href="/delegations"
              className="inline-flex items-center justify-center rounded-xl bg-white ring-1 ring-neutral-200 px-5 py-3 text-neutral-900 font-semibold hover:ring-neutral-300 transition"
            >
              Delegations
            </Link>
          </div>
        </div>

        {/* Right: pillars */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {WHY.pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.04 * i }}
              className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200"
            >
              <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-emerald-100" />
              <h3 className="relative z-10 text-base font-semibold text-neutral-900">
                {p.title}
              </h3>
              <p className="relative z-10 mt-2 text-sm text-neutral-600">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
