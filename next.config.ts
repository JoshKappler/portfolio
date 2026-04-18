import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async headers() {
    return [
      {
        source: "/resume.pdf",
        headers: [
          { key: "Content-Type", value: "application/pdf" },
          {
            key: "Content-Disposition",
            value: 'inline; filename="Joshua_Kappler_Resume.pdf"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
