// src/components/AddVehicleModal.jsx
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_URL;

const AddVehicleModal = ({ isOpen, onClose, onVehicleAdded }) => {
  const [vehicleId, setVehicleId] = useState("");
  const [tid, setTid] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/add_vechile`, {
        vehicle_id: vehicleId,
        tid,
      });

      const { message } = response.data;
      const status = response.status;

      if (status >= 200 && status < 300) {
        toast.success(message || "Vechile added successfully!");
        onClose();
      } else {
        toast.error(message || "Something went wrong!");
      }

      onVehicleAdded(); // Refresh list
      onClose(); // Close modal
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="scale-95 opacity-0"
              enterTo="scale-100 opacity-100"
              leave="ease-in duration-150"
              leaveFrom="scale-100 opacity-100"
              leaveTo="scale-95 opacity-0"
            >
              <Dialog.Panel className="w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all relative">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-900"
                >
                  <X />
                </button>
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Add New Vehicle
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Vehicle ID
                    </label>
                    <input
                      type="text"
                      value={vehicleId}
                      onChange={(e) => setVehicleId(e.target.value)}
                      className="mt-1 w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Transport ID (TID)
                    </label>
                    <input
                      type="text"
                      value={tid}
                      onChange={(e) => setTid(e.target.value)}
                      className="mt-1 w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 w-full"
                  >
                    Add
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddVehicleModal;
