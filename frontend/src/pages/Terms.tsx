import React from "react";
import { ShieldCheck } from "lucide-react";

export const Terms: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-4xl glass-card p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-3xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-bold gradient-text">Terms of Service</h1>
        </div>

        <p className="text-gray-600 mb-6">
          Welcome to Aloud. By using this service, you agree to our terms, which
          are designed to keep the app fast, safe, and delightful.
        </p>

        <div className="space-y-6 text-gray-600">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Use of the Service</h2>
            <p>
              Aloud is provided for personal and educational use. You may not
              use the service for unlawful activity or to reproduce content you
              do not own.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              Account Responsibility
            </h2>
            <p>
              Keep your account secure. You are responsible for activity that
              occurs through your account.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Privacy and Content</h2>
            <p>
              We treat your text privately. We do not publish your content
              without consent, and we only store minimal data required to
              improve your experience.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Changes to Terms</h2>
            <p>
              We may update these terms as we grow. Continued use of Aloud means
              you accept the new terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
