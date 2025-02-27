import {
  ChangePasswordForm,
  SignUpForm,
  LoginForm,
  ForgotPasswordForm,
  ResetPasswordForm,
} from "./components";

import { useAuth, AuthProvider } from "./context/auth-provider";

import {
  useCaptcha,
  useGoogleSignIn,
  useConfirmResetPassword,
  useResetPasswordForm,
  useGetForgotPassEmail,
  useConfirmEmailHandler,
} from "./hooks";

import {
  ConfirmEmailPage,
  LoginPage,
  PasswordResetSentPage,
  PasswordResetPage,
  SignUpPage,
  ForgotPasswordPage,
  VerifyEmailPage,
} from "./pages";

export {
  ChangePasswordForm,
  SignUpForm,
  LoginForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  useAuth,
  AuthProvider,
  useCaptcha,
  useGoogleSignIn,
  useConfirmResetPassword,
  useResetPasswordForm,
  useGetForgotPassEmail,
  useConfirmEmailHandler,
  ConfirmEmailPage,
  LoginPage,
  PasswordResetSentPage,
  PasswordResetPage,
  SignUpPage,
  ForgotPasswordPage,
  VerifyEmailPage,
};
