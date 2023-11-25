import React from "react";
import { useNavigate } from "react-router-dom";

function BookingSuccessfulPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl w-[70%] h-fit z-20 p-12 flex flex-col items-center justify-center shadow-lg text-gray-800 gap-4">
      <span>Bilety zarezerwowane {":)"}</span>
      <button
        onClick={() => navigate("/")}
        className="w-64 h-11 font-medium bg-sky-600 uppercase rounded-full border mt-4 border-gray-300 tracking-wider hover:border-sky-800 hover:border-2 shadow-lg text-white"
      >
        Wróć do wyszukiwarki
      </button>
    </div>
  );
}

export default BookingSuccessfulPage;
