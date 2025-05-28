import { useEffect, useState, useCallback } from "react";
import {
  PlusCircle,
  Truck,
  MapPinned,
  LocateIcon,
  Route,
  CircleDot,
  DotSquare,
  LucideArrowDownNarrowWide,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddVehicleModal from "../components/AddVechileModal";
import { ToastContainer } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

const fallbackVehicles = [
  {
    id: 1,
    vehicle_id: "TN09AA1234",
    tid: "truck01",
    status: "on_the_way",
    destination_shop: {
      name: "Gandhi Nagar PDS",
      location: "Coimbatore",
    },
    waypoints: [
      { lat: 11.022, lng: 76.93 },
      { lat: 11.03, lng: 76.94 },
      { lat: 11.03, lng: 76.94 },
    ],
  },
  {
    id: 2,
    vehicle_id: "TN10BB5678",
    tid: "truck02",
    status: "at_inventory",
    destination_shop: null,
    waypoints: [],
  },
];

const statusColorMap = {
  at_inventory: "text-gray-500",
  on_the_way: "text-yellow-500",
  at_pds: "text-green-600",
};

const Transport = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  const fetchVehicles = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/transports`);
      setVehicles(res.data?.body?.length ? res.data.body : fallbackVehicles);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
      setVehicles(fallbackVehicles);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          Transport Managment
        </h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          <PlusCircle size={18} />
          Add Vehicle
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading vehicles...</p>
      ) : vehicles.length === 0 ? (
        <p className="text-gray-400 italic">No vehicles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white border rounded-xl shadow-sm p-5 flex flex-col justify-between gap-3 h-full hover:ring-1 hover:ring-gray-400"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Truck className="text-blue-600" />
                  <div>
                    <h2 className="font-bold text-gray-800">
                      {vehicle.vehicle_id}
                    </h2>
                    <p className="text-sm text-gray-500">TID: {vehicle.tid}</p>
                  </div>
                </div>
                <div
                  className={`text-sm font-medium ${
                    statusColorMap[vehicle.status] || "text-gray-400"
                  }`}
                >
                  <CircleDot className="inline mr-1" />
                  {vehicle.status.replace(/_/g, " ")}
                </div>
              </div>

              {vehicle.destination_shop ? (
                <div className="flex items-start gap-2 text-gray-700 text-sm">
                  <MapPinned size={16} />
                  <div>
                    <span className="font-medium">
                      {vehicle.destination_shop.name}
                    </span>{" "}
                    – {vehicle.destination_shop.location}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  Not assigned to any PDS shop
                </p>
              )}

              {vehicle.waypoints?.length > 0 && (
                <details className="mt-2 bg-gray-50 p-3 border rounded">
                  <summary className="text-sm font-semibold text-gray-600 cursor-pointer flex items-center justify-between gap-1">
                    <div className="flex">
                      <LocateIcon size={14} className="my-auto mr-1" />
                      Waypoints ({vehicle.waypoints.length})
                    </div>
                    <LucideArrowDownNarrowWide size={14} />
                  </summary>
                  <div className="grid grid-cols-3 gap-1 text-xs text-gray-500 mt-2">
                    {vehicle.waypoints.map((wp, idx) => (
                      <span key={idx} className="flex">
                        <DotSquare
                          size={12}
                          className="text-blue-500 mt-[1.5px] mr-1"
                        />{" "}
                        {wp.lat.toFixed(3)}, {wp.lng.toFixed(3)}
                      </span>
                    ))}
                  </div>
                </details>
              )}

              <button
                onClick={() => navigate(`/track/${vehicle.tid}`)}
                className="flex items-center gap-2 bg-green-600 text-white justify-center px-4 py-2 rounded shadow hover:bg-green-700 transition"
              >
                <Route size={18} />
                Track Vehicle
              </button>
            </div>
          ))}
        </div>
      )}

      <AddVehicleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onVehicleAdded={fetchVehicles}
      />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Transport;
