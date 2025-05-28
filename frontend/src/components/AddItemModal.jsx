import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL;

const AddItemModal = ({ isOpen, onClose, onItemAdded }) => {
  const [form, setForm] = useState({
    name: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/add_item`, form);

      const { message } = response.data;
      const status = response.status;

      if (status >= 200 && status < 300) {
        toast.success(message || "Shop added successfully!");
        onClose();
      } else {
        toast.error(message || "Something went wrong!");
      }
      onItemAdded();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="text-gray-500 absolute top-3 right-3 hover:text-gray-900"
        >
          <X />
        </button>
        <h2 className="text-lg font-bold mb-4">Add Item</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Item Name"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full border border-gray-300 px-3 py-2 rounded"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 w-full mt-4"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddItemModal;
