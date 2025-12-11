const Logo = ({ className = "", size = "default" }: { className?: string; size?: "sm" | "default" | "lg" }) => {
  const sizes = {
    sm: { container: "w-10 h-10", icon: "w-5 h-5" },
    default: { container: "w-14 h-14", icon: "w-7 h-7" },
    lg: { container: "w-20 h-20", icon: "w-10 h-10" },
  };

  return (
    <div className={`${sizes[size].container} rounded-full bg-primary flex items-center justify-center ${className}`}>
      {/* Thumbs up icon */}
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        className={sizes[size].icon}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" className="text-primary-foreground" fill="none" stroke="white" />
        <path d="M7 22V11l5-10a1 1 0 0 1 1 1v4h5.5a2 2 0 0 1 2 2.4l-1.5 7.5a2 2 0 0 1-2 1.6H7z" className="text-primary-foreground" fill="white" stroke="white" />
      </svg>
    </div>
  );
};

export default Logo;
