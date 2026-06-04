import React from "react";
import { Shield } from "lucide-react";

export const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-4xl glass-card p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-3xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-bold gradient-text">Privacy Policy</h1>
        </div>

        <p className="text-gray-600 mb-6">
          Your privacy is important to us. Aloud avoids unnecessary storage of
          your text and only keeps data needed to power your experience.
        </p>

        <div className="space-y-6 text-gray-600">
          <div>
            <h2 className="text-2xl font-semibold mb-2">What we collect</h2>
            <p>
              We store authentication credentials and usage metadata. We do not
              store the full text of your readings unless explicitly required
              for analytics or support.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">How we use data</h2>
            <p>
              We use data to improve service quality, handle account access, and
              make your playback faster. We never sell your data.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              Third-party services
            </h2>
            <p>
              External providers may be used for analytics and hosting. We
              choose partners committed to privacy and security.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Your rights</h2>
            <p>
              You can request account deletion or data export by contacting
              support at support@aloud.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
