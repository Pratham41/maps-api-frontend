import React, { useState } from "react";
import Modal from "./components/Modal";
import Map from "./components/Map";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { MdOutlineLocationOn } from "react-icons/md";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");

  const handleLocationSelect = (location, address) => {
    setSelectedLocation(location);
    setSelectedAddress(address);
    setIsModalOpen(false);
  };

  const handleLocationChange = async (location) => {
    const response = await fetch(
      `https://maps-backend.vercel.app/api/v1/address/get-address`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lat: location.lat, lng: location.lng }),
      }
    );
    const data = await response.json();
    const address = data.results[0].formatted_address;
    setSelectedLocation(location);
    setSelectedAddress(address);
  };

  return (
    <div className="App bg-gray-100 min-h-screen h-full px-12 py-6">
      <span className="flex items-center gap-x-3 mb-2 text-gray-500">
        <AiOutlineArrowLeft />
        <span>Back to main</span>
      </span>
      <div
        className="bg-white px-6 py-4 rounded-lg"
        style={{ minHeight: "80vh" }}
      >
        <h1 className="text-2xl font-bold mb-4">New farm</h1>
        <hr className="w-full" />
        <div className="flex flex-col w-full">
          <label className="my-2">Farm name</label>
          <input
            type="text"
            placeholder="e.g. Banana house"
            className="w-1/5 px-1.5 py-2 rounded-lg outline-none border border-gray-200"
            readOnly
          />
          <label className="my-2">How much area your farm covers?</label>
          <div className="flex">
            <input
              type="text"
              placeholder="e.g. 2acre"
              className="w-1/5 px-1.5 py-2 rounded-lg outline-none border border-gray-200"
              readOnly
            />
            <button className="px-1.5 py-2 rounded-lg outline-none border border-gray-200 mx-2">sqft</button>
            <button className="px-1.5 py-2 rounded-lg outline-none border border-gray-200">acre</button>
            <button className="px-1.5 py-2 rounded-lg outline-none border border-gray-200 mx-2">hectare</button>
            <button className="px-1.5 py-2 rounded-lg outline-none border border-gray-200">sqmt</button>

          </div>

          <label className="my-2">Where is your farm located?</label>
          {!selectedAddress && (
            <button
              className="py-3 rounded-lg w-1/3 border border-gray-200 flex items-center justify-center font-semibold"
              onClick={() => setIsModalOpen(true)}
            >
              <MdOutlineLocationOn className="text-lg" />
              Add Location
            </button>
          )}
          {!selectedAddress && <hr className="w-full mt-4" />}

          {selectedAddress && (
            <div className="flex items-center border border-gray-200 w-2/5 justify-between px-2.5 py-3 rounded-lg">
              <p>{selectedAddress}</p>
              <button
                className="text-green-600 font-semibold"
                onClick={() => setIsModalOpen(true)}
              >
                Change
              </button>
            </div>
          )}
        </div>

        {selectedLocation && (
          <Map
            location={selectedLocation}
            onLocationChange={handleLocationChange}
          />
        )}
        {isModalOpen && (
          <Modal
            onClose={() => setIsModalOpen(false)}
            onLocationSelect={handleLocationSelect}
          />
        )}
      </div>
    </div>
  );
}

export default App;
