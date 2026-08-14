"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function StudioPage() {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-forest p-8 text-cream">
        <div className="max-w-md space-y-4 text-center">
          <h1 className="text-2xl">Sanity Studio</h1>
          <p className="text-parchment">
            Add <code className="text-gold">NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
            <code className="text-gold">NEXT_PUBLIC_SANITY_DATASET</code> to{" "}
            <code className="text-gold">.env.local</code> to enable the content studio.
          </p>
          <p className="text-sm text-parchment/80">
            The live site uses built-in default content until Sanity is connected.
          </p>
        </div>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
