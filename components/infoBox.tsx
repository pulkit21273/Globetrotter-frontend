import React from "react";
import clsx from "clsx";

interface InfoBoxProps {
  title: string;
  icon: string;
  items: string[];
  color: "blue"  | "green" | "purple"; 
}

const colorClasses = {
  blue: "bg-blue-100 text-blue-800 border-blue-300",
  green: "bg-green-100 text-green-800 border-green-300",
  purple: "bg-purple-100 text-purple-800 border-purple-300",
};

const InfoBox: React.FC<InfoBoxProps> = ({ title, icon, items, color }) => {
  return (
    <div className={clsx("p-4 rounded-lg", colorClasses[color])}>
      <h3 className="text-xl font-semibold flex items-center">
        {icon} <span className="ml-2">{title}</span>
      </h3>
      <ul className="mt-2 list-disc list-inside space-y-1">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default InfoBox;
