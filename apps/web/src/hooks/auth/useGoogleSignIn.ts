import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useState } from "react";

export const useGoogleSignIn = () => {
  const [isGoogleLogin, setIsGoogleLogin] = useState(false);
  const provider = new GoogleAuthProvider();

  const handleSignInWithGoogle = async () => {
    try {
      setIsGoogleLogin(true);
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorCode, errorMessage, email, credential);
    } finally {
      setIsGoogleLogin(false);
    }
  };

  return { isGoogleLogin, handleSignInWithGoogle };
};
