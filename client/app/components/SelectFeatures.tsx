import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Error from "./Error";
import { useAuth } from "../contexts/AuthContext";

const FEATURE_COSTS: Record<string, number> = {
  "Questions & Answers": 40,
  "Flowchart & Diagrams": 50,
  "Translation Options": 30,
};

const SelectFeatures = ({ token, setSelectedFeatures }: { token: number, setSelectedFeatures: (features: string[]) => void }) => {
  const { user } = useAuth();
  const [values, setValues] = useState<string[]>([]);

  const options = useMemo(() =>
    Object.entries(FEATURE_COSTS).map(([label, value]) => ({ label, value })),
    []
  );

  const sum = values.reduce((acc, label) => acc + (FEATURE_COSTS[label] || 0), 0);
  const minOptionCost = Math.min(...options.map((o) => o.value));
  const canSelect = !!user && token >= minOptionCost;

  useEffect(() => {
    setSelectedFeatures(values);
  }, [values, setSelectedFeatures]);

  const handleCheckboxChange = (label: string, value: number) => {
    if (!values.includes(label)) {
      if (sum + value > token) return;
    }
    setValues((prev) =>
      prev.includes(label) ? prev.filter((v) => v !== label) : [...prev, label]
    );
  };

  const hasAnyLockedOption = options.some(
    (opt) => !values.includes(opt.label) && sum + opt.value > token
  );

  return (
    <div style={{ transform: 'translateX(-2%)' }} className="flex flex-col mt-8 px-4 text-white">
      <div className="text-lg font-bold mb-2">What All To Include?</div>
      {!user && (
        <Error message="Sign in to spend tokens on extra features. Summary still needs an account." />
      )}
      {user && !canSelect && (
        <Error message="You don't have enough tokens to select any extra feature." />
      )}
      {user && hasAnyLockedOption && (
        <Link
          href="/pricing"
          className="self-start mb-2 px-4 py-2 rounded-full text-sm font-semibold bg-white text-black hover:bg-gray-200 transition-colors"
        >
          Buy More
        </Link>
      )}
      <div className="w-full my-4 md:w-2/3 flex flex-wrap gap-4">
        {options.map((opt) => {
          const isChecked = values.includes(opt.label);
          const wouldExceed = sum + opt.value > token;
          const shouldDisable =
            (!isChecked && (wouldExceed || token < opt.value)) || !canSelect;
          return (
            <label
              key={opt.label}
              title={shouldDisable ? `Needs ${opt.value} tokens — you have ${token}` : `${opt.value} tokens`}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md cursor-pointer transition-all
                ${
                  isChecked
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                }
                ${shouldDisable ? "opacity-50 cursor-not-allowed line-through" : ""}
              `}
            >
              <input
                type="checkbox"
                value={opt.label}
                checked={isChecked}
                onChange={() => handleCheckboxChange(opt.label, opt.value)}
                disabled={shouldDisable}
                className="form-checkbox accent-blue-500"
              />
              <span>{opt.label} · {opt.value}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default SelectFeatures;
