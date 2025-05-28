import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import Layout from "./layout/Layout";
import AskPage from "./pages/Ask";
import Shop from "./pages/Shop";
import Godown from "./pages/Godown";
import Transport from "./pages/Transport";
import TrackVehicleMap from "./pages/VechileMap";
import SetShopMap from "./pages/SetShopMap";
import Products from "./pages/Products";
import StockIn from "./pages/StockIn";
import StockOut from "./pages/StockOut";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/ask" element={<AskPage />} />
          <Route path="/shops" element={<Shop />} />
          <Route path="/godowns" element={<Godown />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/track/:tid" element={<TrackVehicleMap />} />
          <Route path="/set_track" element={<SetShopMap />} />
          <Route path="/products" element={<Products />} />
          <Route path="/stock_in" element={<StockIn />} />
          <Route path="/stock_out" element={<StockOut />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
