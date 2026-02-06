import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";

const ContactSection = () => {
  const [showMessage, setShowMessage] = useState(false);

  const handleClick = () => {
    setShowMessage(true);
  };

  return (
    <section className="section-container text-center fade-in" style={{ animationDelay: '0.3s' }}>
      <h2 className="section-title">Contact Me</h2>
      <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
        {!showMessage ? (
          <>
            <p className="text-muted-foreground mb-6">
              Want to get in touch? I'd love to hear from you!
            </p>
            <button onClick={handleClick} className="contact-button inline-flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Me
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <p className="text-xl font-medium text-foreground">
              Thanks for visiting my website!
            </p>
            <p className="text-muted-foreground">
              I appreciate your interest in connecting with me.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
