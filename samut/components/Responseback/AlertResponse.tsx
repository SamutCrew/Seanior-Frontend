// components/AlertResponse.tsx
import React from "react";
import PropTypes from "prop-types";
import { AlertType } from  "@/types/AlertTypes"

interface AlertResponseProps {
  message: string;
  type?: AlertType;
}

const AlertResponse: React.FC<AlertResponseProps> = ({ message, type = AlertType.INFO }) => {
  const baseStyle = "px-4 py-2 rounded-md text-sm font-medium";
  const typeStyles = {
    [AlertType.SUCCESS]: "bg-green-100 text-green-500",
    [AlertType.ERROR]: "bg-red-100 text-red-500",
    [AlertType.WARNING]: "bg-yellow-100 text-yellow-500",
    [AlertType.INFO]: "bg-blue-100 text-blue-500",
  };

  const alertStyle = `${baseStyle} ${typeStyles[type]}`;

  return <div className={alertStyle}>{message}</div>;
};

AlertResponse.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(Object.values(AlertType)),
};

export default AlertResponse;
