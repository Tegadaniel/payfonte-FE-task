interface PayfonteLogoProps {
  className?: string;
  width?: number;
}

export function PayfonteLogo({ className, width = 120 }: PayfonteLogoProps) {
  return (
    <img
      src="/payfonte.svg"
      alt="Payfonte"
      width={width}
      className={className}
      draggable={false}
    />
  );
}
