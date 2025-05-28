export const SummaryCard = ({ icon, label, value }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center gap-4">
      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
};
