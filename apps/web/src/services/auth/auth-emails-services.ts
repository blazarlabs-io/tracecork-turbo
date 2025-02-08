export const sendVerificationEmailService = async (email: string) => {
  try {
    await fetch("/api/send-verification-email", {
      method: "POST",
      body: JSON.stringify({
        email: email,
      }),
    });
  } catch (error) {
    console.error(error);
  }
};

export const sendPasswordRecoveryEmailService = async (email: string) => {
  try {
    await fetch("/api/password-recovery", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        templateId: "d-96f3802db81c4cafbdcf92822ef1ee61",
      }),
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};
