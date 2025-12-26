import { toast } from "react-toastify";

const defaultOptions = {
  position: "top-right",
  autoClose: 3000,
  pauseOnHover: true,
  closeOnClick: true,
};

const makeToastId = (msg, opts = {}) => opts.toastId ?? String(msg);

export const toastSuccess = (msg, opts = {}) =>
  toast.success(msg, {
    toastId: makeToastId(msg, opts),
    ...defaultOptions,
    ...opts,
  });
export const toastError = (msg, opts = {}) =>
  toast.error(msg || "Something went wrong", {
    toastId: makeToastId(msg, opts),
    ...defaultOptions,
    ...opts,
  });
export const toastInfo = (msg, opts = {}) =>
  toast.info(msg, {
    toastId: makeToastId(msg, opts),
    ...defaultOptions,
    ...opts,
  });

export default { toastSuccess, toastError, toastInfo };
