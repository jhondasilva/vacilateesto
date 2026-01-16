import { useEffect, useRef } from "react";

interface InstagramEmbedProps {
  postUrl: string;
  className?: string;
}

const InstagramEmbed = ({ postUrl, className = "" }: InstagramEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Instagram embed script
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    // Process embeds when script loads
    script.onload = () => {
      if (window.instgrm) {
        window.instgrm.Embeds.process();
      }
    };

    // Also try to process if script was already loaded
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }

    return () => {
      // Cleanup if needed
    };
  }, [postUrl]);

  return (
    <div ref={containerRef} className={className}>
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={postUrl}
        data-instgrm-version="14"
        style={{
          background: "#FFF",
          border: 0,
          borderRadius: "24px",
          boxShadow: "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
          margin: "0 auto",
          maxWidth: "540px",
          minWidth: "326px",
          padding: 0,
          width: "100%",
        }}
      />
    </div>
  );
};

// Extend Window interface for Instagram embed
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

export default InstagramEmbed;
