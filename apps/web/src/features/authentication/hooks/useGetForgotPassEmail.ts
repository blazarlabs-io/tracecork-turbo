import { ForgotPassStorage } from "~/src/features/authentication/types";
import { FORGOT_PASS_KEY } from "../utils";
import { useLocalStorage } from "../../../hooks/use-local-storage";
import { useEffect, useState } from "react";

export const useGetForgotPassEmail = () => {
  const [forgotPassEmail, setForgotPassEmail] = useState("");
  const { localState, deleteLocalStateHandler } =
    useLocalStorage<ForgotPassStorage>(FORGOT_PASS_KEY);

  /* Get Email from LS and deleted, to only volatil use */
  useEffect(() => {
    if (!localState) return;
    const timeoutId = setTimeout(() => {
      setForgotPassEmail(localState.email);
      deleteLocalStateHandler();
    }, 300);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [localState]);

  return { forgotPassEmail };
};
