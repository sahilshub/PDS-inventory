import { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddRequirementModal = ({ isOpen, onClose, shopId }) => {
  const [items, setItems] = useState([]);
  const [requirements, setRequirements] = useState({});

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isOpen) {
      axios
        .get(`${BASE_URL}/items`) // Adjust this endpoint based on your actual item list API
        .then((res) => setItems(res.data || []))
        .catch((err) => console.error("Failed to fetch items", err));
    }
  }, [isOpen]);

  const handleChange = (itemId, quantity) => {
    setRequirements((prev) => ({
      ...prev,
      [itemId]: quantity,
    }));
  };

  const handleSubmit = async () => {
    const reqList = Object.entries(requirements).map(([item_id, quantity]) => ({
      item_id: parseInt(item_id),
      required_quantity: parseInt(quantity),
    }));

    try {
      const response = await axios.post(`${BASE_URL}/add_shop_requirement`, {
        shop_id: shopId,
        requirements: reqList,
      });

      const { message } = response.data;
      const status = response.status;

      if (status >= 200 && status < 300) {
        toast.success(message || "Requirements added successfully!");
        onClose();
      } else {
        toast.error(message || "Something went wrong!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md mt-16 shadow-lg relative">
        <button
          onClick={onClose}
          className="text-gray-500 absolute top-3 right-3 hover:text-gray-900"
        >
          <X />
        </button>
        <h2 className="text-lg font-semibold mb-4">
          Set Requirements{" "}
          <span className="text-gray-400 text-sm">(in Kg)</span>
        </h2>
        {items.map((item) => (
          <div key={item.id} className="mb-3">
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {item.name}
            </label>
            <input
              type="number"
              className="w-full border rounded p-2 mt-1"
              min={0}
              value={requirements[item.id] || ""}
              onChange={(e) => handleChange(item.id, e.target.value)}
            />
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 w-full mt-1 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddRequirementModal;
