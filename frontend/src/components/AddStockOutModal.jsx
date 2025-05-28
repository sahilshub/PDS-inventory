import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AddStockInModal({ onClose }) {
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/all_shops`)
      .then((res) => res.json())
      .then((data) => setShops(data.shops));
  }, []);

  const handleSubmit = async () => {
    alert("Please Confirm to Allocate the Stocks!");
    try {
      const response = await axios.post(
        `${BASE_URL}/stock_out/${selectedShop}`
      );
      const { message } = response.data;
      const status = response.status;

      if (status >= 200 && status < 300) {
        toast.success(message || "Stock Allocated successfully!");
        onClose();
      } else {
        toast.error(message || "Something went wrong!");
      }

      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-xl relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
          onClick={onClose}
        >
          <X />
        </button>

        <h2 className="text-lg font-semibold mb-4">Allocate Stock</h2>

        <label className="block mb-2">Select Shop:</label>
        <select
          className="w-full mb-4 border rounded px-3 py-2"
          value={selectedShop}
          onChange={(e) => setSelectedShop(e.target.value)}
        >
          <option value="">-- Choose --</option>
          {shops.map((s, idx) => (
            <option key={s.id || idx} value={s.id} className="capitalize">
              {s.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
