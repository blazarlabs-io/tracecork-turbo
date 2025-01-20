import { ContactForm } from "@/components/forms/contact-form";

export interface ContactPageProps {}

export const ContactPage = ({}: ContactPageProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-8 px-8 py-8">
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <h2 className="text-3xl font-bold">Contact us</h2>
        <p className="text-center">
          Discuss your requirements, learn about pricing, or request a
          demonstration.
        </p>
      </div>
      <div className="flex w-full items-center justify-center gap-8">
        <ContactForm />
      </div>
    </div>
  );
};
