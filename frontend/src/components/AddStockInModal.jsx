import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AddStockInModal({ onClose }) {
  const [godowns, setGodowns] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedGodown, setSelectedGodown] = useState("");
  const [stockItems, setStockItems] = useState([
    { item_id: "", quantity: "", num_of_packs: "" },
  ]);

  useEffect(() => {
    fetch(`${BASE_URL}/all_godowns`)
      .then((res) => res.json())
      .then((data) => setGodowns(data.godowns));

    fetch(`${BASE_URL}/items`)
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...stockItems];
    updated[index][field] = value;
    setStockItems(updated);
  };

  const handleAddItem = () => {
    setStockItems([
      ...stockItems,
      { item_id: "", quantity: "", num_of_packs: "" },
    ]);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/stock_in`, {
        godown_id: selectedGodown,
        items: stockItems,
      });

      const { message, file } = response.data;
      const status = response.status;

      if (status >= 200 && status < 300) {
        toast.success(
          message ||
            "Stock added successfully!\n Check Documents folder for generated pack codes"
        );
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

        <h2 className="text-lg font-semibold mb-4">Add Stock In</h2>

        <label className="block mb-2">Select Godown:</label>
        <select
          className="w-full mb-4 border rounded px-3 py-2"
          value={selectedGodown}
          onChange={(e) => setSelectedGodown(e.target.value)}
        >
          <option value="">-- Choose --</option>
          {godowns.map((g) => (
            <option key={g.id} value={g.id} className="capitalize">
              {g.name}
            </option>
          ))}
        </select>

        {stockItems.map((item, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 mb-4">
            <select
              className="border rounded px-3 py-2"
              value={item.item_id}
              onChange={(e) => handleChange(index, "item_id", e.target.value)}
            >
              <option value="">Select Item</option>
              {items.map((i) => (
                <option key={i.id} value={i.id} className="capitalize">
                  {i.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              className="border rounded px-3 py-2"
              placeholder="Quantity"
              value={item.quantity}
              onChange={(e) => handleChange(index, "quantity", e.target.value)}
            />

            <input
              type="number"
              className="border rounded px-3 py-2"
              placeholder="No. of Packs"
              value={item.num_of_packs}
              onChange={(e) =>
                handleChange(index, "num_of_packs", e.target.value)
              }
            />
          </div>
        ))}

        <button
          onClick={handleAddItem}
          className="text-blue-600 mb-4 hover:text-blue-800"
        >
          + Add More Item
        </button>

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
