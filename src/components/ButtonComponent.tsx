import React from 'react';
import { Button, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface ButtonProps {
  label: string;
  onClick: () => void;
  loading?: boolean;
}

const ButtonComponent: React.FC<ButtonProps> = ({ label, onClick, loading = false }) => {
  const loadingIcon = <LoadingOutlined style={{ fontSize: 16 }} spin />;

  return (
    <Button
      className="w-full  py-5 bg-orange-400 text-black rounded-md text-lg font-medium hover:bg-orange-600"
      onClick={onClick}
      disabled={loading} // Disable the button when loading
    >
      {loading ?
        <>

          <Spin indicator={loadingIcon} />



        </>



        : label}

    </Button>
  );
};

export default ButtonComponent;