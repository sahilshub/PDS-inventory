// pages/SetShopMap.jsx
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  Popup,
} from "react-leaflet";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const SetShopMap = () => {
  const [destination, setDestination] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const navigate = useNavigate();

  // Custom marker events
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        if (!destination) {
          setDestination({ lat, lng });
        } else {
          setWaypoints((prev) => [...prev, { lat, lng }]);
        }
      },
    });
    return null;
  };

  const handleConfirm = () => {
    const data = {
      destination,
      waypoints,
    };
    localStorage.setItem("shopMapSelection", JSON.stringify(data));
    navigate("/shops?is_open=true"); // Go back to Add Shop popup
  };

  // Source icon
  const sourceIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // Use a different icon if needed
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });

  // Waypoint icon
  const waypointIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png", // Different icon
    iconSize: [25, 25],
    iconAnchor: [12, 25],
  });

  // Custom vehicle icon
  const vehicleIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [35, 35],
    iconAnchor: [17, 35],
  });

  // Destination icon
  const destinationIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [40, 40],
    iconAnchor: [15, 30],
  });

  const source = {
    lat: 11.018,
    lng: 76.925,
    name: "Main Warehouse",
    location: "Coimbatore",
  };

  return (
    <div className="h-screen w-full p-4">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">
        Select Destination & Waypoints
      </h2>
      <div className="gap-y-3 my-6">
        <p className="text-md text-blue-600 flex">
          <CheckCircle size={16} className="text-green-500 mr-2 mt-[5.5px]" />
          Step 1: Select the Desination{" "}
          <span className="ml-2 text-gray-400 text-sm mt-[3.5px]">
            (PDS shop)
          </span>
        </p>
        <p className="text-md text-blue-600 flex mt-1">
          <CheckCircle size={16} className="text-green-500 mr-2 mt-[5.5px]" />
          Step 2: Select the Waypoints to Source
          <span className="ml-2 text-gray-400 text-sm mt-[3.5px]">
            (Inventory)
          </span>
        </p>
      </div>
      <MapContainer
        center={[11.0168, 76.9558]} // Default center
        zoom={13}
        scrollWheelZoom
        className="h-[75vh] w-full rounded shadow"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />
        {destination && (
          <Marker
            position={[destination.lat, destination.lng]}
            icon={destinationIcon}
          >
            <Popup>Destination</Popup>
          </Marker>
        )}
        {waypoints.map((point, idx) => (
          <Marker
            key={idx}
            position={[point.lat, point.lng]}
            icon={waypointIcon}
          >
            <Popup>Waypoint {idx + 1}</Popup>
          </Marker>
        ))}
        {source && (
          <Marker position={[source.lat, source.lng]}>
            <Popup>
              🏭 Source: {source.name}, {source.location}
            </Popup>
          </Marker>
        )}
        {waypoints.length > 0 && (
          <Polyline
            positions={[...waypoints.map((p) => [p.lat, p.lng])]}
            color="blue"
          />
        )}
      </MapContainer>

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleConfirm}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Confirm Selection
        </button>
        <button
          onClick={() => {
            setDestination(null);
            setWaypoints([]);
          }}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default SetShopMap;
