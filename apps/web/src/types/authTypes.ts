export type LoginStorage = {
  email: string;
};

export type ForgotPassStorage = {
  email: string;
};

export type ConfirmEmailParamsType = {
  mode: string;
  continueUrl: string;
  lang: string;
  oobCode: string;
};
