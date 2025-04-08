export const Badge = ({ children, className }) => {
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-md ${className}`}
      >
        {children}
      </span>
    );
  };
  