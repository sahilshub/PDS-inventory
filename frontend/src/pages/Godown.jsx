import { useState, useEffect } from "react";
import {
  PlusCircle,
  Package,
  Archive,
  Warehouse,
  MapPin,
  Boxes,
} from "lucide-react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { SummaryCard } from "../components/SummaryCard";
import { AddGodownModal } from "../components/AddGodownModal";

const BASE_URL = import.meta.env.VITE_API_URL;

const Godown = () => {
  const [godowns, setGodowns] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchGodowns = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/godowns_details`);
      const data = Array.isArray(res.data?.body) ? res.data.body : [];
      setGodowns(data);
    } catch (err) {
      console.error("Failed to fetch godowns:", err);
    }
  };

  useEffect(() => {
    fetchGodowns();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-800">Godowns</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <PlusCircle size={18} /> Add Godown
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mx-auto my-6">
        <SummaryCard
          icon={<Warehouse />}
          label="Total Godowns"
          value={godowns.length}
        />
        <SummaryCard
          icon={<Boxes />}
          label="Total Packs Allocated"
          value={godowns.reduce((acc, g) => acc + g.total_packs, 0)}
        />
        <SummaryCard
          icon={<Archive />}
          label="Total Quantity Allocated"
          value={`${godowns.reduce((acc, g) => acc + g.total_quantity, 0)} kg`}
        />
      </div>

      {/* Godown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {godowns.map((godown) => (
          <div
            key={godown.godown_id}
            className="bg-white p-4 rounded-xl shadow space-y-2 hover:ring-1 hover:ring-gray-400"
          >
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
              <Warehouse className="text-blue-500" /> {godown.name}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {godown.location}
            </div>
            <div className="text-sm mt-2 text-gray-700 bg-gray-50 border rounded p-3">
              <p className="text-gray-400">
                Total Quantity: {godown.total_quantity} kg
              </p>
              <p>Remaining Quantity: {godown.remaining_quantity} kg</p>
            </div>
            <div className="text-sm mt-2 text-gray-700 bg-gray-50 border rounded p-3">
              <p className="text-gray-400">Total Packs: {godown.total_packs}</p>
              <p>Remaining Packs: {godown.remaining_packs}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <AddGodownModal
          onClose={() => setShowModal(false)}
          onGodownAdded={fetchGodowns}
        />
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Godown;
