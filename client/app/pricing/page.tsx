'use client';

import React, { useState } from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import { PLAN_DETAILS, PaidPlanId, planRank } from '../libs/plans';
import { useAuth } from '../contexts/AuthContext';
import CheckoutModal from '../components/CheckoutModal';
import LoginModal from '../components/LoginModal';
import { useSession } from 'next-auth/react';

function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default function Pricing() {
  const { user, setUser } = useAuth();
  const { data: session } = useSession();
  const [checkoutPlan, setCheckoutPlan] = useState<PaidPlanId | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);

  const currentRole = user?.role || "FREE";

  function startCheckout(plan: PaidPlanId) {
    if (!user) {
      setLoginOpen(true);
      return;
    }
    setCheckoutPlan(plan);
  }

  return (
    <div className="relative isolate min-h-screen px-6 py-24 sm:py-32 lg:px-8 bg-black">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
      <div className="mx-auto max-w-4xl text-center">
        <p className="mt-2 text-balance text-5xl font-semibold tracking-tight sm:text-6xl text-white">
          Choose the right plan for you
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-pretty text-center text-lg font-medium text-gray-400 sm:text-xl/8">
        Simulated billing for this project — unlock tokens instantly, no Stripe or Razorpay required.
      </p>
      <div className="mx-auto mt-16 grid max-w-[80rem] grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {(Object.keys(PLAN_DETAILS) as Array<keyof typeof PLAN_DETAILS>).map((id) => {
          const tier = PLAN_DETAILS[id];
          const featured = id !== "FREE";
          const isCurrent = currentRole === id;
          return (
            <div
              key={id}
              className={classNames(
                featured
                  ? 'relative bg-black/60 border border-white/10 backdrop-blur-md'
                  : 'bg-white/10 border border-white/25 backdrop-blur-xl',
                'rounded-3xl p-8 sm:p-10 flex flex-col justify-between'
              )}
            >
              <div>
                <h3 className="text-indigo-400 text-base/7 font-semibold">
                  {tier.name}
                  {isCurrent && (
                    <span className="text-xs text-gray-300 ml-2">(current plan)</span>
                  )}
                </h3>
                <p className="mt-4 flex items-baseline gap-x-2">
                  <span className="text-white text-5xl font-semibold tracking-tight">
                    {tier.priceLabel}
                  </span>
                  <span className="text-gray-300 text-base">
                    /month
                  </span>
                </p>
                <p className="mt-2 text-sm text-violet-200/80">
                  {id === "FREE" ? `${tier.tokens} starting tokens` : `+${tier.tokens} tokens on purchase`}
                </p>
                <p className="mt-6 text-base/7 text-gray-300">
                  {tier.description}
                </p>
                <ul
                  role="list"
                  className="mt-8 space-y-3 text-sm/6 sm:mt-10 text-gray-300"
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <CheckIcon
                        aria-hidden="true"
                        className="text-indigo-400 h-6 w-5 flex-none"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 sm:mt-10">
                {id === "FREE" ? (
                  <Link
                    href="/"
                    className="block rounded-full px-6 py-3 text-center text-sm font-semibold border-2 border-white/50 text-white hover:bg-white hover:text-black transition-colors"
                  >
                    Go back
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => startCheckout(id as PaidPlanId)}
                    className="mt-8 w-full block rounded-full px-6 py-3 text-center text-sm font-semibold bg-white text-black hover:bg-gray-200 transition-colors"
                  >
                    {planRank(currentRole) >= planRank(id) ? "Buy more tokens" : "Get started today"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {checkoutPlan && (
        <CheckoutModal plan={checkoutPlan} onClose={() => setCheckoutPlan(null)} />
      )}
      {loginOpen && (
        <LoginModal
          session={session}
          closeModal={() => setLoginOpen(false)}
          setIsLoggedIn={() => {}}
          setUserData={setUser}
        />
      )}
    </div>
  );
}
