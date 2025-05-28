import { useEffect, useState } from "react";
import AddStockInModal from "../components/AddStockInModal";
import {
  Warehouse,
  Boxes,
  PackageCheck,
  PlusCircle,
  PackageOpen,
  History,
  Package,
  ArrowDownCircle,
} from "lucide-react";
import { SummaryCard } from "../components/SummaryCard";
import { ToastContainer } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function StockIn() {
  const [stockData, setStockData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [remaining, setRemaining] = useState(0);

  const fetchStock = async () => {
    try {
      const res = await fetch(`${BASE_URL}/stock_in_details`);
      const data = await res.json();
      setStockData(data.body);
      setCompleted(data.completed_batches);
      setRemaining(data.remaining_batches);
      setTotal(data.total_batches);
    } catch (err) {
      console.error("Failed to fetch stock data", err);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Stock In Details
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          <ArrowDownCircle size={20} />
          Add Stock
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mx-auto my-3 mb-6">
        <SummaryCard icon={<Boxes />} label="Total Batches" value={total} />
        <SummaryCard
          icon={<PackageCheck />}
          label="Fully Disbatched Batches"
          value={completed}
        />
        <SummaryCard
          icon={<PackageOpen />}
          label="Remaining Batches"
          value={remaining}
        />
      </div>
      <h2 className="text-xl font-medium mb-2 flex items-center gap-2 text-gray-700">
        <History size={20} /> Latest Batches
      </h2>

      {/* Loop batch-wise */}
      {stockData.map((batch) => (
        <div key={batch.batch_id} className="mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-700 my-2">
              Batch #{batch.batch_number}
            </h2>
            <p className="bg-blue-200 px-2 py-1 rounded-lg inline text-xs text-blue-600">
              Completed: {batch.completion_percenatge || 0} %
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Arrival Date: {batch.arrival_date || "N/A"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {batch.stock_items.map((stock) => (
              <div
                key={stock.stock_item_id}
                className="bg-white shadow rounded-xl p-4 space-y-2 hover:ring-1 hover:ring-gray-400"
              >
                <div className="flex items-center gap-2">
                  <Package className="text-blue-500 w-5 h-5" />
                  <span className="text-lg font-semibold text-gray-800">
                    {stock.item_name}
                  </span>
                </div>
                <div className="text-sm text-gray-600 my-auto flex gap-1">
                  <Warehouse
                    className="w-4 h-4 mr-1 text-green-600 mt-[1.5px]"
                    size={20}
                  />
                  {stock.godown_name}
                </div>
                <div className="bg-gray-100 p-4 mb-1 rounded border flex justify-between gap-x-2">
                  <div>
                    <p className="text-sm text-gray-600">
                      Total Quantity: {stock.total_quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      Remaining: {stock.remaining_quantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Packs: {stock.current_num_of_packs}/{stock.num_of_packs}
                    </p>
                    <p className="text-sm text-gray-600 break-all">
                      Pack Codes: {stock.pack_codes}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Departure Date: {stock.departure_date || "N/A"}
                </p>

                <details className="mt-4 bg-gray-50 p-3 border rounded">
                  <summary className="text-sm font-semibold text-gray-700 cursor-pointer">
                    Allocations ({stock.allocations.length})
                  </summary>
                  <div className="space-y-3 mt-3">
                    {stock.allocations.map((alloc) => (
                      <div
                        key={alloc.allocation_id}
                        className="bg-white border rounded p-3 shadow-sm"
                      >
                        <div className="flex items-center gap-2 text-gray-700">
                          <PackageCheck size={16} />
                          <span className="font-medium capitalize">
                            {alloc.shop_name}
                          </span>
                          <span className="text-xs text-gray-400 ml-auto">
                            {alloc.shop_location}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1 flex justify-between">
                          <span>Qty: {alloc.quantity_allocated}kg</span>
                          <span>Packs: {alloc.packs_allocated}</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          Pack Codes: {alloc.allocated_pack_codes?.join(", ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      ))}

      {showModal && (
        <AddStockInModal
          onClose={() => {
            setShowModal(false);
            fetchStock(); // refresh list after adding
          }}
        />
      )}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
