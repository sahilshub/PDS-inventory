import { useEffect, useState } from "react";
import axios from "axios";
import {
  PlusCircle,
  PackageSearch,
  AlertCircle,
  History,
  Layers,
  Warehouse,
  Boxes,
  PackageMinus,
  PackagePlus,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import AddItemModal from "../components/AddItemModal"; // modal component you'll create
import { ToastContainer, toast } from "react-toastify";
import { SummaryCard } from "../components/SummaryCard";

const BASE_URL = import.meta.env.VITE_API_URL;

const sampleData = {
  item_counts: [
    {
      item_id: 1,
      item_name: "Rice",
      total_remaining: 1200,
    },
    {
      item_id: 2,
      item_name: "Sugar",
      total_remaining: 800,
    },
    {
      item_id: 3,
      item_name: "Wheat",
      total_remaining: 600,
    },
  ],

  latest_added: [
    {
      stock_id: 21,
      item_id: 1,
      item_name: "Rice",
      quantity: 500,
      godown_id: 1,
      batch_id: 101,
    },
    {
      stock_id: 20,
      item_id: 2,
      item_name: "Sugar",
      quantity: 300,
      godown_id: 2,
      batch_id: 102,
    },
    {
      stock_id: 19,
      item_id: 3,
      item_name: "Wheat",
      quantity: 200,
      godown_id: 1,
      batch_id: 103,
    },
    {
      stock_id: 18,
      item_id: 4,
      item_name: "Oil",
      quantity: 400,
      godown_id: 2,
      batch_id: 104,
    },
    {
      stock_id: 17,
      item_id: 5,
      item_name: "Dal",
      quantity: 200,
      godown_id: 3,
      batch_id: 105,
    },
  ],

  needed_items: [
    {
      item_id: 4,
      item_name: "Oil",
      total_needed: 1500,
    },
    {
      item_id: 5,
      item_name: "Dal",
      total_needed: 900,
    },
  ],
};

const Products = () => {
  const [summary, setSummary] = useState({
    item_counts: [],
    latest_added: [],
    needed_items: [],
  });

  const [showAddModal, setShowAddModal] = useState(false);

  const fetchProductDetails = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/product_details`);
      setSummary(res.data);
    } catch (err) {
      console.error(err);
      setSummary(sampleData);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-800">Products</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <PlusCircle size={18} />
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mx-auto my-6">
        <SummaryCard
          icon={<Boxes size={20} />}
          value={summary.item_counts.length}
          label="Total Item"
        />
        <SummaryCard
          icon={<PackagePlus size={20} />}
          value="Rice"
          label="Highly Needed"
        />
        <SummaryCard
          icon={<PackageMinus size={20} />}
          value="Wheat"
          label="Less Needed"
        />
      </div>

      {/* Remaining Items */}
      <div className="my-6">
        <h2 className="text-xl font-medium mb-2 flex items-center gap-2 text-gray-700">
          <PackageSearch size={20} /> Item Stock Summary
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {summary.item_counts.map((item) => (
            <Card key={item.item_id}>
              <CardContent className="p-3">
                <p className="font-semibold text-gray-800 capitalize">
                  {item.item_name}
                </p>
                <p className="text-sm text-gray-600">
                  Remaining: {item.total_remaining} kg
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Latest Added */}
      <div className="my-6">
        <h2 className="text-xl font-medium mb-2 flex items-center gap-2 text-gray-700">
          <History size={20} /> Latest Added Items
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {summary.latest_added.map((item) => (
            <Card key={item.stock_id}>
              <CardContent className="p-2 space-y-2">
                <p className="font-semibold text-gray-800 capitalize">
                  {item.item_name}
                </p>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity} kg
                </p>
                <div className="text-xs text-gray-500 flex gap-x-2">
                  <p className="flex gap-x-[5.5px] bg-gray-100 rounded px-3 py-1">
                    <Layers size={14} className="mt-[2px] text-blue-600" />
                    Batch:<span>{item.batch_id}</span>
                  </p>
                  <p className="flex gap-x-[5.5px] bg-gray-100 rounded px-3 py-1">
                    <Warehouse size={14} className="mt-[1px] text-green-400" />
                    Godown:<span>{item.godown_id}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Needed Items */}
      <div className="my-6">
        <h2 className="text-xl font-medium mb-2 flex items-center gap-2 text-red-600">
          <AlertCircle size={20} /> Needed Items
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {summary.needed_items.map((item) => (
            <Card key={item.item_id} className="bg-red-50 border-red-200">
              <CardContent className="p-3 space-y-1">
                <p className="font-semibold text-red-800 capitalize">
                  {item.item_name}
                </p>
                <p className="text-sm text-red-600">
                  Needed: {item.total_needed} kg
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <AddItemModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onItemAdded={fetchProductDetails}
        />
      )}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Products;
