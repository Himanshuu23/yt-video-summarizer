import React, { useState, useEffect } from "react";
import Error from "./Error";

const SelectFeatures = ({ token, setSelectedFeatures }: { token: number, setSelectedFeatures: (features: string[]) => void }) => {
  const [values, setValues] = useState<number[]>([]);

  const options = [
    { label: "Questions & Answers", value: 40 },
    { label: "Flowchart & Diagrams", value: 50 },
    { label: "Translation Options", value: 30 },
  ];

  const sum = values.reduce((acc, val) => acc + val, 0);
  const minOptionCost = Math.min(...options.map((o) => o.value));
  const canSelect = token >= minOptionCost;

  useEffect(() => {
    const selectedLabels = options.filter(opt => values.includes(opt.value)).map(opt => opt.label);
    setSelectedFeatures(selectedLabels);
  }, [values]);

  const handleCheckboxChange = (value: number) => {
    if (!values.includes(value)) {
      if (sum + value > token) return;
    }
    setValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <div style={{ transform: 'translateX(-2%)' }} className="flex flex-col mt-8 px-4 text-white">
      <div className="text-lg font-bold mb-2">What All To Include?</div>
      {!canSelect && (
        <Error message="You don't have enough tokens to select any feature!" />
      )}
      <div className="w-full my-4 md:w-2/3 flex flex-wrap gap-4">
        {options.map((opt) => {
          const isChecked = values.includes(opt.value);
          const wouldExceed = sum + opt.value > token;
          const shouldDisable =
            (!isChecked && (wouldExceed || token < opt.value)) || !canSelect;
          return (
            <label
              key={opt.value}
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
                value={opt.value}
                checked={isChecked}
                onChange={() => handleCheckboxChange(opt.value)}
                disabled={shouldDisable}
                className="form-checkbox accent-blue-500"
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default SelectFeatures;
