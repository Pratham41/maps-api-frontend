import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

function Modal({ onClose, onLocationSelect }) {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (searchText.trim() === "") {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      const response = await fetch(
        "https://maps-backend.vercel.app/api/v1/address/get-places",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input: searchText }),
        }
      );
      const data = await response.json();
      setResults(data.predictions);
    };

    fetchResults();
  }, [searchText]);

  const handleSelect = async (placeId) => {
    const response = await fetch(
      `https://maps-backend.vercel.app/api/v1/address/get-place-details`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ place_id: placeId }),
      }
    );
    const data = await response.json();
    const location = data.result.geometry.location;
    const address = data.result.formatted_address;
    onLocationSelect(location, address);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded flex flex-col p-1 w-1/4  lg:min-h-96">
        <button className="text-red-500 self-end text-xl" onClick={onClose}>
          <IoMdClose />
        </button>
        <div className="p-4 flex flex-col items-center">
          <h2 className="font-semibold mb-2">Where is your farm located?</h2>
          <div className="flex justify-start items-center my-4 w-full">
            <div className="relative w-full  max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-green-600" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-10 py-2 border-2 bg-transparent focus:text-black border-green-600 rounded-lg shadow-sm outline-none sm:text-sm"
                placeholder="Search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
          <ul className="max-h-56 overflow-y-scroll">
            {results.map((result) => (
              <>
                <li
                  key={result.place_id}
                  onClick={() => handleSelect(result.place_id)}
                  className="cursor-pointer self-start py-4 "
                >
                  {result.description}
                </li>
                <hr />
              </>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Modal;
