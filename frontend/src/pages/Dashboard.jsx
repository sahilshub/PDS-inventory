import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  Boxes,
  Users,
  ShoppingCart,
  Store,
  CalendarClock,
  Layers,
  PercentCircle,
  Info,
  Battery,
} from "lucide-react";
import axios from "axios";
import { SummaryCard } from "../components/SummaryCard";

const BASE_URL = import.meta.env.VITE_API_URL;

const sampleData = {
  summary: {
    total_shops: 5,
    total_items: 10,
    total_users: 15,
    total_stocks: 20,
    total_allocations: 8,
    total_scheduled_jobs: 3,
  },
  stock_status: {
    total_quantity_in: 400,
    total_quantity_remaining: 250,
    total_quantity_out: 150,
  },
  total_capacity: 1000,
  inventory_fill_percentage: "25%",
  item_details: [
    {
      item_id: 1,
      item_name: "Rice",
      remaining_quantity: 120,
      remaining_packs: 12,
      status: "Low Stock",
    },
    {
      item_id: 2,
      item_name: "Wheat",
      remaining_quantity: 180,
      remaining_packs: 18,
      status: "In Stock",
    },
  ],
};

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchdetails = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/dashboard`);
        const responseData = res.data ?? sampleData;
        setData(responseData);

        const res2 = await axios.get(`${BASE_URL}/item_quantity_summary`);
        setChartData(res2.data?.body ?? []);
      } catch (error) {
        console.error("API error, using fallback sample data", error);
        setData(sampleData);
      }
    };
    fetchdetails();
  }, []);

  const summary = data?.summary ?? sampleData.summary;
  const stockStatus = data?.stock_status ?? sampleData.stock_status;
  const itemDetails = data?.item_details ?? sampleData.item_details;
  const response = data ?? sampleData;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-2">Overview</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-auto">
        <SummaryCard
          icon={<Store />}
          label="Total Shops"
          value={summary.total_shops}
        />
        <SummaryCard
          icon={<Boxes />}
          label="Total Items"
          value={summary.total_items}
        />
        <SummaryCard
          icon={<Users />}
          label="Total Users"
          value={summary.total_users}
        />
        <SummaryCard
          icon={<ShoppingCart />}
          label="Total Stocks"
          value={summary.total_stocks}
        />
        <SummaryCard
          icon={<Layers />}
          label="Allocations"
          value={summary.total_allocations}
        />
        <SummaryCard
          icon={<CalendarClock />}
          label="Scheduled Jobs"
          value={summary.total_scheduled_jobs}
        />
        <SummaryCard
          icon={<Battery />}
          label="Total Capacity"
          value={`${response.total_capacity} Kg`}
        />
        <SummaryCard
          icon={<PercentCircle />}
          label="Filled Percentage"
          value={response.inventory_fill_percentage}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow rounded-xl">
          <h2 className="font-medium mb-2">Stock Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                dataKey="value"
                data={[
                  { name: "In", value: stockStatus.total_quantity_in },
                  {
                    name: "Remaining",
                    value: stockStatus.total_quantity_remaining,
                  },
                  { name: "Out", value: stockStatus.total_quantity_out },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
                isAnimationActive={true}
                animationDuration={1000}
              >
                {[
                  stockStatus.total_quantity_in,
                  stockStatus.total_quantity_remaining,
                  stockStatus.total_quantity_out,
                ].map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 shadow rounded-xl">
          <h2 className="font-medium mb-2">Item Stock Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={itemDetails}>
              <XAxis dataKey="item_name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="remaining_quantity"
                fill="#8884d8"
                name="Remaining Quantity"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparative Graph Chart */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4 text-gray-800">
          Item Quantity Summary
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="item_name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="required_quantity"
              stroke="#8884d8"
              name="Required"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="allocated_quantity"
              stroke="#82ca9d"
              name="Allocated"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="remaining_quantity"
              stroke="#ffc658"
              name="Remaining"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800 flex gap-x-2">
            <Info size={20} className="mt-[3.5px]" /> Item Details
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                <th className="px-6 py-3">Item</th>
                <th className="px-6 py-3">Remaining Quantity</th>
                <th className="px-6 py-3">Remaining Packs</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {itemDetails.map((item) => (
                <tr
                  key={item.item_id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {item.item_name}
                  </td>
                  <td className="px-6 py-4">{item.remaining_quantity}</td>
                  <td className="px-6 py-4">{item.remaining_packs}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        item.status === "Low Stock"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
