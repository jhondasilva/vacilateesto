import logoVacilateEsto from "@/assets/logo-vacilate-esto.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "default" | "lg" | "xl";
}

const Logo = ({ className = "", size = "default" }: LogoProps) => {
  const sizes = {
    sm: "h-10",
    default: "h-14",
    lg: "h-24",
    xl: "h-40",
  };

  return (
    <img 
      src={logoVacilateEsto} 
      alt="Vacílate Esto" 
      className={`${sizes[size]} w-auto object-contain ${className}`}
    />
  );
};

export default Logo;
