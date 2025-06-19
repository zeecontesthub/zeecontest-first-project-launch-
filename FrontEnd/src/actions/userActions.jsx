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
    url: "https://zeecontest-first-project-launch.onrender.com/login", // your frontend page
    handleCodeInApp: true,
  };

  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem("emailForSignIn", email);
};
