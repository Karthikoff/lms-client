export const Button = ({ children, className, onClick }) => {
    return (
      <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 
        bg-black text-white hover:bg-gray-900 active:scale-95 ${className}`}
      >
        {children}
      </button>
    );
  };
  