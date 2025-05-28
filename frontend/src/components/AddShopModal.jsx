import { useState, useEffect } from "react";
import axios from "axios";
import { X, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

const AddShopModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [owner, setOwner] = useState("");
  const [users, setUsers] = useState([]);

  const [destination, setDestination] = useState(null);
  const [waypoints, setWaypoints] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      axios.get(`${BASE_URL}/users`).then((res) => {
        setUsers(res.data.users || []);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const mapData = localStorage.getItem("shopMapSelection");
    if (mapData) {
      const parsed = JSON.parse(mapData);
      setDestination(parsed.destination);
      setWaypoints(parsed.waypoints);
      localStorage.removeItem("shopMapSelection");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/add_shop`, {
        name,
        location,
        owner,
        destination,
        waypoints,
      });

      const { message } = response.data;
      const status = response.status;

      if (status >= 200 && status < 300) {
        toast.success(message || "Shop added successfully!");
        onClose();
      } else {
        toast.error(message || "Something went wrong!");
      }

      setName("");
      setLocation("");
      setOwner("");
      setDestination(null);
      setWaypoints([]);
      navigate("/shops");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-900"
        >
          <X />
        </button>
        <h2 className="text-xl font-semibold mb-4">Add New PDS Shop</h2>

        {/* Step 1: Set Waypoints */}
        <h3 className="text-sm font-semibold text-gray-600 mb-1">
          Step 1: Set Destination & Waypoints
        </h3>
        <button
          onClick={() => {
            navigate("/set_track");
          }}
          className="w-full bg-green-500 text-white my-2 py-2 rounded hover:bg-green-600 flex justify-center"
        >
          Set Track{" "}
          {waypoints.length > 0 && (
            <CheckCircle size={20} className="mt-1 ml-1" />
          )}
        </button>
        {destination && (
          <div className="text-sm text-green-700 mt-1 mb-3">
            Map data selected: {waypoints.length} waypoint
            {waypoints.length !== 1 ? "s" : ""}
          </div>
        )}

        {/* Step 2: Shop Name & Location */}
        <h3 className="text-sm font-semibold text-gray-600 mb-1">
          Step 2: Enter Shop Details
        </h3>
        <div className="mb-3">
          {/* <label className="block mb-1 text-sm font-medium">Shop Name</label> */}
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={name}
            placeholder="Shop Name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City"
          />
        </div>

        {/* Step 3: Select Owner */}
        <h3 className="text-sm font-semibold text-gray-600 mb-1">
          Step 3: Select Owner
        </h3>
        <div className="mb-4">
          <select
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
          >
            <option value="">--Choose--</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddShopModal;
