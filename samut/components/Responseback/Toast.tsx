import { toast } from "react-hot-toast";

export const Toast = {
  success: (message: string, options = {}) => {
    toast.success(message, options);
  },
  error: (message: string, options = {}) => {
    toast.error(message, options);
  },
  promise: (
    func: Promise<any>,
    loading: string,
    success: string,
    error: string,
    options = {}
  ) => {
    toast.promise(func, {
      loading: loading,
      success: success,
      error: error,
    });
  },
  custom: (message: string, options = {}) => {
    toast(message, options);
  },
};
