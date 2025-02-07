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
