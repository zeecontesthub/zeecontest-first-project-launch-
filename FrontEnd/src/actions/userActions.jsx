import { sendSignInLinkToEmail } from "firebase/auth";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const sendOTPLink = async (email) => {
  const actionCodeSettings = {
    // Frontend route that handles the email-link sign-in
    url: `${import.meta.env.VITE_FRONTEND_URL}/login`,
    handleCodeInApp: true,
  };

  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem("emailForSignIn", email);
};
