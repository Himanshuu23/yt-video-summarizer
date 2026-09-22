"use client";

import { FormEvent, useMemo, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { API_URL } from "../libs/api";
import { PLAN_DETAILS, PaidPlanId } from "../libs/plans";
import {
  DEMO_CARD,
  cardBrand,
  digitsOnly,
  expiryValid,
  formatCardNumber,
  formatExpiry,
  luhnCheck,
} from "../libs/card";
import { persistUser, toPublicUser } from "../libs/handleToken";
import { readApiError } from "../libs/apiError";
import { toast } from "react-toastify";
import { modalInput, modalOverlay } from "../libs/modalStyles";

const STEPS = [
  "Validating card details",
  "Contacting issuing bank",
  "Authorizing payment",
  "Provisioning tokens",
];

export default function CheckoutModal({
  plan,
  onClose,
}: {
  plan: PaidPlanId;
  onClose: () => void;
}) {
  const { user, setUser } = useAuth();
  const details = PLAN_DETAILS[plan];
  const [name, setName] = useState(user?.name || "");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(-1);
  const [receipt, setReceipt] = useState<{ id: string; last4: string } | null>(null);

  const brand = cardBrand(number);
  const processing = step >= 0 && !receipt;

  const brandLabel = useMemo(() => {
    if (brand === "visa") return "VISA";
    if (brand === "mastercard") return "MC";
    if (brand === "amex") return "AMEX";
    return "CARD";
  }, [brand]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!user?.email) {
      setError("Please sign in before checking out.");
      return;
    }
    if (!name.trim()) {
      setError("Name on card is required.");
      return;
    }
    if (!luhnCheck(number)) {
      setError("Enter a valid 16-digit card number. Try 4242 4242 4242 4242.");
      return;
    }
    if (!expiryValid(expiry)) {
      setError("Enter a valid expiry date (MM/YY).");
      return;
    }
    if (digitsOnly(cvc).length < 3) {
      setError("Enter a valid CVC.");
      return;
    }

    try {
      for (let i = 0; i < STEPS.length; i++) {
        setStep(i);
        await new Promise((resolve) => setTimeout(resolve, 700));
      }

      const res = await fetch(`${API_URL}/api/user/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, plan }),
      });

      if (!res.ok) {
        throw new Error(await readApiError(res, "Payment could not be completed."));
      }

      const data = await res.json();
      const next = toPublicUser(data);
      persistUser(next);
      setUser(next);
      setReceipt({
        id: data.receiptId || `SF-${Date.now()}`,
        last4: digitsOnly(number).slice(-4),
      });
      toast.success(`${details.name} unlocked. +${details.tokens} tokens added.`);
    } catch (err) {
      setStep(-1);
      setError(err instanceof Error ? err.message : "Payment failed.");
    }
  }

  return (
    <div className={modalOverlay} onClick={onClose}>
      <div
        className="relative w-[92vw] max-w-md rounded-2xl border border-white/15 bg-neutral-950 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-sky-500" />
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-white/50 hover:text-white text-2xl"
          aria-label="Close checkout"
        >
          &times;
        </button>

        <div className="p-6 sm:p-7">
          <p className="text-[11px] tracking-[0.25em] text-white/40 uppercase">Summarify Pay</p>
          <h2 className="mt-1 text-xl font-semibold text-white">Complete purchase</h2>
          <p className="mt-1 text-sm text-gray-400">
            {details.name} · {details.priceLabel}/month · +{details.tokens} tokens
          </p>

          {receipt ? (
            <div className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-950/40 p-4 text-sm text-emerald-100">
              <p className="font-semibold text-white">Payment authorized</p>
              <p className="mt-2">Receipt {receipt.id}</p>
              <p className="mt-1">
                {brandLabel} •••• {receipt.last4} · ${details.amountUsd}.00 USD
              </p>
              <button onClick={onClose} className="mt-5 w-full rounded-xl bg-white text-black py-2.5 text-sm font-semibold">
                Done
              </button>
            </div>
          ) : processing ? (
            <div className="mt-6 space-y-3">
              {STEPS.map((label, index) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      index < step ? "bg-emerald-400" : index === step ? "bg-violet-400 animate-pulse" : "bg-white/20"
                    }`}
                  />
                  <span className={index <= step ? "text-white" : "text-white/40"}>{label}</span>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <div className="rounded-xl border border-white/15 bg-gradient-to-br from-violet-900/40 to-black p-4 mb-4">
                <div className="flex justify-between text-xs text-white/60">
                  <span>Summarify</span>
                  <span>{brandLabel}</span>
                </div>
                <p className="mt-6 tracking-[0.3em] text-white/90 text-sm">
                  {number || "•••• •••• •••• ••••"}
                </p>
                <div className="mt-4 flex justify-between text-xs text-white/70">
                  <span className="uppercase">{name || "Name on card"}</span>
                  <span>{expiry || "MM/YY"}</span>
                </div>
              </div>

              <input
                className={modalInput}
                placeholder="Name on card"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className={modalInput}
                placeholder={DEMO_CARD}
                inputMode="numeric"
                autoComplete="cc-number"
                value={number}
                onChange={(e) => setNumber(formatCardNumber(e.target.value))}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  className={modalInput}
                  placeholder="MM/YY"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                />
                <input
                  className={modalInput}
                  placeholder="CVC"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  maxLength={4}
                  value={cvc}
                  onChange={(e) => setCvc(digitsOnly(e.target.value).slice(0, 4))}
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                className="w-full rounded-xl bg-white text-black py-2.5 text-sm font-semibold hover:bg-white/90"
              >
                Pay {details.priceLabel}
              </button>
              <p className="text-[11px] text-center text-white/35">
                Secure checkout · Payment verification required
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
