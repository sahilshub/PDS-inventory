const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`rounded-2xl shadow-md border bg-white p-4 hover:ring-1 hover:ring-gray-400 ${className}`}
    >
      {children}
    </div>
  );
};

const CardContent = ({ children, className = "" }) => {
  return <div className={`text-sm ${className}`}>{children}</div>;
};

export { Card, CardContent };
