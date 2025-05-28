import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import L from "leaflet";
import { io } from "socket.io-client";
import {
  Truck,
  Clock,
  LocateIcon,
  LocateFixed,
  StampIcon,
  LoaderCircle,
} from "lucide-react";
import { SummaryCard } from "../components/SummaryCard";

const BASE_URL = import.meta.env.VITE_API_URL;

// Icons
const sourceIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});
const waypointIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [25, 25],
  iconAnchor: [12, 25],
});
const destinationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const TrackVehicleMap = () => {
  const { tid } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!tid) {
      toast.error("Invalid tracking ID");
      return;
    }

    const socket = io(BASE_URL);

    socket.on("connect", () => {
      socket.emit("track_vehicle", tid);
    });

    const fallback = setTimeout(() => {
      toast.warn("No live data received. Using fallback data.");
      setLoading(false);
    }, 4000);

    socket.on("vehicle_update", (data) => {
      if (data?.tid === tid) {
        clearTimeout(fallback);
        setVehicle(data);
        setLoading(false);
      }
    });

    socket.on("connect_error", () => {
      toast.error("Could not connect to tracking server.");
      setLoading(false);
    });

    socket.on("disconnect", () => {
      toast.warn("Disconnected from tracking server.");
    });

    return () => {
      socket.disconnect();
      clearTimeout(fallback);
    };
  }, [tid]);

  const goToCurrentLocation = () => {
    if (isMapReady && vehicle?.current_location) {
      const { lat, lng } = vehicle.current_location;
      mapRef.current.flyTo([lat, lng], 15, {
        animate: true,
        duration: 1.0,
      });
    }
  };

  const current = vehicle?.current_location;
  const source = vehicle?.source;
  const waypoints = vehicle?.waypoints || [];
  const destination = vehicle?.destination;
  const route = [
    ...(source ? [source] : []),
    ...waypoints,
    ...(destination ? [destination] : []),
  ];

  return (
    <div className="h-screen w-full p-4 relative">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-3xl font-semibold text-gray-800 mb-2">
        Transport Track
      </h2>

      {loading && (
        <div className="flex justify-center items-center h-[70vh]">
          <div className="flex flex-col items-center">
            <LoaderCircle size={80} className="animate-spin text-blue-600" />
            <p className="text-gray-500 mt-3">Searching for vehicle data...</p>
          </div>
        </div>
      )}

      {!loading && !vehicle && (
        <div className="text-center text-red-600 mt-10">
          Vehicle data not found.
        </div>
      )}

      {!loading && vehicle && (
        <>
          <div className="text-gray-600 mb-5 flex gap-x-3 mt-4">
            <SummaryCard
              icon={<Truck />}
              value={vehicle.vehicle_id}
              label="Vehicle No"
            />
            <SummaryCard
              icon={<LocateIcon />}
              value={vehicle.tid}
              label="Tracking ID"
            />
            <SummaryCard
              icon={<StampIcon />}
              value={vehicle.status}
              label="Status"
            />
            <SummaryCard
              icon={<Clock />}
              value={new Date(
                vehicle.estimated_arrival_time
              ).toLocaleTimeString()}
              label="ETA"
            />
            <SummaryCard
              icon={<LocateFixed />}
              value={`${vehicle.distance_remaining} km`}
              label="Distance Left"
            />
          </div>

          <MapContainer
            center={[11.0, 76.9]}
            zoom={12}
            scrollWheelZoom
            className="h-[80vh] w-full rounded shadow"
            whenCreated={(mapInstance) => {
              mapRef.current = mapInstance;
              setIsMapReady(true);
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {route.length > 1 && (
              <Polyline
                positions={route.map((p) => [p.lat, p.lng])}
                color="blue"
                weight={4}
                opacity={0.7}
              />
            )}

            {source && (
              <Marker position={[source.lat, source.lng]} icon={sourceIcon}>
                <Popup>
                  🏭 Source: {source.name}, {source.location}
                </Popup>
              </Marker>
            )}

            {waypoints.map((point, idx) => (
              <Marker
                key={idx}
                position={[point.lat, point.lng]}
                icon={waypointIcon}
              >
                <Popup>🛣 Waypoint {idx + 1}</Popup>
              </Marker>
            ))}

            {current && (
              <Marker position={[current.lat, current.lng]}>
                <Popup>🚚 Current Location</Popup>
              </Marker>
            )}

            {destination && (
              <Marker
                position={[destination.lat, destination.lng]}
                icon={destinationIcon}
              >
                <Popup>
                  🎯 Destination: {destination.name}, {destination.location}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </>
      )}
    </div>
  );
};

export default TrackVehicleMap;
