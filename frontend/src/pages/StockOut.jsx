import { useEffect, useState } from "react";
import {
  PackageCheck,
  Warehouse,
  MapPin,
  User,
  Calendar,
  ArrowDownCircle,
  PlusCircle,
  ArrowUpCircle,
} from "lucide-react";
import { ToastContainer } from "react-toastify";
import AddStockOutModal from "../components/AddStockOutModal";
import ScheduleStockOutModal from "../components/ScheduleStockModal";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function StockOut() {
  const [allocations, setAllocations] = useState([]);
  const [scheduledJobs, setScheduledJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const fetchAllocations = async () => {
    try {
      const res = await fetch(`${BASE_URL}/stock_allocations`);
      const data = await res.json();
      setAllocations(data.body);
    } catch (err) {
      console.error("Failed to fetch allocations", err);
    }
  };

  const fetchScheduledJobs = async () => {
    try {
      const res = await fetch(`${BASE_URL}/scheduled_allocations`);
      const data = await res.json();
      setScheduledJobs(data.scheduled_allocations);
    } catch (err) {
      console.error("Failed to fetch scheduled jobs", err);
    }
  };

  useEffect(() => {
    fetchAllocations();
    fetchScheduledJobs();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Stock Out</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            <ArrowUpCircle size={20} />
            Allocate
          </button>
          <button
            onClick={() => setShowScheduleModal(true)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
          >
            <Calendar size={20} />
            Schedule
          </button>
        </div>
      </div>

      {/* Allocated Stock Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {allocations.map((shop) => (
          <div
            key={shop.shop_id}
            className="bg-white rounded-xl shadow p-4 space-y-3 hover:ring-1 hover:ring-gray-400"
          >
            <div className="flex items-center gap-2 text-gray-800 text-lg font-semibold">
              <Warehouse size={20} />
              {shop.shop_name}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="mr-1 w-4 h-4" />
              {shop.location}
            </div>

            <details className="mt-2 bg-gray-50 p-3 border rounded">
              <summary className="text-sm font-semibold text-gray-700 cursor-pointer">
                Allocations ({shop.allocations.length})
              </summary>
              <div className="space-y-3 mt-3">
                {shop.allocations.map((alloc) => (
                  <div
                    key={alloc.allocation_id}
                    className="bg-white border rounded p-3 shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-gray-700">
                      <PackageCheck size={16} />
                      <span className="font-medium capitalize">
                        {alloc.item_name}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">
                        Batch #{alloc.batch_id}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1 flex justify-between">
                      <span>Qty: {alloc.quantity_allocated}kg</span>
                      <span>Packs: {alloc.packs_allocated}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <ArrowDownCircle size={14} />
                      {alloc.allocated_pack_codes}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        ))}
      </div>

      {/* Scheduled Jobs */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Scheduled Stock Outs</h2>
        {scheduledJobs.length === 0 ? (
          <p className="text-gray-500">No schedules yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {scheduledJobs.map((job) => (
              <div
                key={job.job_id}
                className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-xl shadow-sm"
              >
                <div className="flex items-center gap-2 text-yellow-800 font-semibold">
                  <Calendar size={18} />
                  Scheduled Job #{job.job_id}
                </div>
                <div className="text-sm text-gray-700 mt-2">
                  <Warehouse size={14} className="inline-block mr-1" />
                  {job.shop_name} ({job.shop_location})
                </div>
                <div className="text-sm mt-1">
                  <span className="font-medium">Frequency:</span> {job.frequency}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Next Run:</span>{" "}
                  {new Date(job.run_date).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <AddStockOutModal
          onClose={() => {
            setShowModal(false);
            fetchAllocations();
            fetchScheduledJobs();
          }}
        />
      )}
      {showScheduleModal && (
        <ScheduleStockOutModal
          onClose={() => {
            setShowScheduleModal(false);
            fetchAllocations();
            fetchScheduledJobs();
          }}
        />
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
