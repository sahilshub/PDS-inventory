import { useEffect, useState } from "react";
import {
  PlusCircle,
  Store,
  PackageCheck,
  Calendar,
  Package,
  Archive,
  MapPin,
} from "lucide-react";
import axios from "axios";
import AddShopModal from "../components/AddShopModal";
import AddRequirementModal from "../components/AddRequirementModel";
import { ToastContainer } from "react-toastify";
import { SummaryCard } from "../components/SummaryCard";
import { useLocation, useSearchParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

const sampleData = [
  {
    shop_id: 1,
    shop_name: "Sai Baba colony PDS",
    location: "Coimbatore",
    owner: { name: "Ramesh" },
    allocations: [
      {
        allocation_id: 1,
        item_name: "Rice",
        batch_id: 101,
        quantity_allocated: 50,
        packs_allocated: 10,
        allocation_date: "2025-05-10 09:00:00",
      },
      {
        allocation_id: 2,
        item_name: "Sugar",
        batch_id: 102,
        quantity_allocated: 30,
        packs_allocated: 6,
        allocation_date: "2025-05-11 10:30:00",
      },
    ],
  },
  {
    shop_id: 2,
    shop_name: "Gadhi Nagar PDS",
    location: "Coimbatore",
    owner: { name: "Ramesh" },
    allocations: [
      {
        allocation_id: 1,
        item_name: "Rice",
        batch_id: 101,
        quantity_allocated: 50,
        packs_allocated: 10,
        allocation_date: "2025-05-10 09:00:00",
      },
      {
        allocation_id: 2,
        item_name: "Sugar",
        batch_id: 102,
        quantity_allocated: 30,
        packs_allocated: 6,
        allocation_date: "2025-05-11 10:30:00",
      },
    ],
  },
  {
    shop_id: 3,
    shop_name: "Kinathukadavu PDS",
    location: "Coimbatore",
    owner: { name: "Ramesh" },
    allocations: [
      {
        allocation_id: 1,
        item_name: "Rice",
        batch_id: 101,
        quantity_allocated: 50,
        packs_allocated: 10,
        allocation_date: "2025-05-10 09:00:00",
      },
      {
        allocation_id: 2,
        item_name: "Sugar",
        batch_id: 102,
        quantity_allocated: 30,
        packs_allocated: 6,
        allocation_date: "2025-05-11 10:30:00",
      },
    ],
  },
];

const Shop = () => {
  const [shops, setShops] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [showRequirementModal, setShowRequirementModal] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/pds_shops_details`);
        const data = res.data?.body || [];
        setShops(data);
      } catch (err) {
        console.log(err);
      }
    };

    // Open modal if is_open=true in query params
    if (searchParams.get("is_open") === "true") {
      setShowModal(true);
    }
    fetchShops();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          PDS Shops & Allocations
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          <PlusCircle size={20} />
          Add Shop
        </button>
      </div>

      {/* Summary */}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mx-auto my-6">
        <SummaryCard
          icon={<Store />}
          label="Total Shops"
          value={shops.length}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {shops.map((shop) => (
          <div
            key={shop.shop_id}
            className="bg-white rounded-lg shadow border border-gray-200 p-5 hover:ring-1 hover:ring-gray-400"
          >
            <div className="flex justify-between gap-3 mb-3">
              <div>
                <Store className="text-blue-600" />
                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {shop.shop_name}
                  </h2>
                  <p className="text-sm text-gray-500 flex gap-1">
                    <MapPin className="w-4 h-4 mt-[1.5px]" /> {shop.location}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedShopId(shop.shop_id);
                  setShowRequirementModal(true);
                }}
                className="mt-4 text-sm bg-green-600 text-white px-3 py-1 my-3 rounded hover:bg-green-700 transition"
              >
                Set Requirements
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              Owner:{" "}
              <span className="font-medium">{shop.owner || "Unknown"}</span>
            </p>

            <details className="mt-4 bg-gray-50 p-3 border rounded">
              <summary className="text-sm font-semibold text-gray-700 cursor-pointer">
                Requirements ({shop.requirements.length})
              </summary>
              <div className="space-y-3 mt-3">
                {shop.requirements.map((alloc) => (
                  <div
                    key={alloc.allocation_id}
                    className="bg-white border rounded p-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2 text-gray-700">
                      <div className="flex gap-x-1">
                        <PackageCheck size={16} className="mt-[2.5px]" />
                        <span className="font-medium capitalize">
                          {alloc.item_name}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span>Qty: {alloc.required_quantity}kg</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          </div>
        ))}
      </div>
      <AddShopModal isOpen={showModal} onClose={() => setShowModal(false)} />
      <AddRequirementModal
        isOpen={showRequirementModal}
        onClose={() => setShowRequirementModal(false)}
        shopId={selectedShopId}
      />
      <ToastContainer position="bottom-right" autoClose={4000} />
    </div>
  );
};

export default Shop;
