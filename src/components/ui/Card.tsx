import { clsx } from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "bg-[#1e2130] border border-[#2a2d3e] rounded-2xl",
        hover &&
          "cursor-pointer hover:border-[#6c63ff] hover:shadow-[0_0_20px_rgba(108,99,255,0.15)] transition-all duration-200",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={clsx("p-6 pb-0", className)}>{children}</div>;
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={clsx("p-6", className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("px-6 pb-6 pt-0 flex items-center", className)}>
      {children}
    </div>
  );
}
