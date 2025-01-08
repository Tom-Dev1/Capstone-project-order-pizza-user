import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

const ButtonEdit: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      className="w-full max-w-sm px-4 py-2 bg-orange-500 text-black rounded-md text-lg font-medium hover:bg-orange-600"
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default ButtonEdit;
