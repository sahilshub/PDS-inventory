import { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { format } from "date-fns";

const BASE_URL = import.meta.env.VITE_API_URL;

const ScheduleStockOutModal = ({ onClose }) => {
  const [runDate, setRunDate] = useState(new Date());
  const [frequency, setFrequency] = useState("daily");
  const [shopId, setShopId] = useState("");
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchShops = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/all_shops`);
      setShops(res.data.shops);
    } catch (err) {
      console.error("Failed to fetch shops", err);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleSubmit = async () => {
    if (!runDate || !frequency || !shopId) {
      toast.error("All fields are required");
      return;
    }

    alert("Please Confirm to continue!");
    const run_date = format(runDate, "yyyy-MM-dd HH:mm:ss");

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/schedule_stock_out`, {
        run_date: run_date,
        frequency,
        shop_id: shopId,
      });
      toast.success(res.data.message || "Scheduled successfully");
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to schedule stock out."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
          onClick={onClose}
          disabled={loading}
        >
          <X />
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Schedule Stock Out
        </h2>

        <label className="text-sm font-medium text-gray-700 block mb-1">
          Select Shop
        </label>
        <select
          value={shopId}
          onChange={(e) => setShopId(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        >
          <option value="">-- Choose --</option>
          {shops.map((shop) => (
            <option key={shop.id} value={shop.id}>
              {shop.name}
            </option>
          ))}
        </select>

        <label className="text-sm font-medium text-gray-700 block mb-1">
          Run Date & Time
        </label>
        <DatePicker
          selected={runDate}
          onChange={(date) => setRunDate(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="Pp"
          className="w-full border px-3 py-2 rounded mb-4"
        />

        <label className="text-sm font-medium text-gray-700 block mb-1">
          Frequency
        </label>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-4"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
          disabled={loading}
        >
          Schedule
        </button>
      </div>
    </div>
  );
};

export default ScheduleStockOutModal;
