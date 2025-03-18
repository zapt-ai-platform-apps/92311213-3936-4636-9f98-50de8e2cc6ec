import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaRocket, FaMoneyBillWave } from 'react-icons/fa';

const IncomePathway = () => {
  const steps = [
    { 
      id: 1, 
      label: "Starting", 
      income: "$0-1K", 
      icon: <FaMoneyBillWave />,
      color: "text-blue-600",
      bgColor: "bg-blue-100" 
    },
    { 
      id: 2, 
      label: "Building", 
      income: "$1K-5K", 
      icon: <FaChartLine />,
      color: "text-purple-600",
      bgColor: "bg-purple-100" 
    },
    { 
      id: 3, 
      label: "Scaling", 
      income: "$5K-10K+", 
      icon: <FaRocket />,
      color: "text-green-600",
      bgColor: "bg-green-100" 
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-3 bg-gray-50 border-b border-gray-200"
    >
      <p className="text-xs text-gray-600 mb-2">Your path to $10K monthly income:</p>
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div className={`${step.bgColor} w-10 h-10 rounded-full flex items-center justify-center ${step.color}`}>
                {step.icon}
              </div>
              <p className="text-xs font-medium mt-1">{step.label}</p>
              <p className="text-xs text-gray-600">{step.income}</p>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 flex items-center mx-1">
                <div className="h-0.5 bg-gray-300 w-full"></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="mt-2 text-xs text-center text-gray-500">
        Click any suggestion below to explore strategies for each income level
      </div>
    </motion.div>
  );
};

export default IncomePathway;