import React, { useState } from "react";
import ExpandingContent from "./ExpandingContent";
import Timer from "./Timer";

function EnterDetailsPage() {
  const [openIds, setOpenIds] = useState([0]);
  const [formData, setFormData] = useState([]);

  const amount = 3;

  const handleToggle = (id) => {
    setOpenIds((prevOpenIds) => {
      if (prevOpenIds.includes(id)) {
        return prevOpenIds.filter((openId) => openId !== id);
      } else {
        return [id];
      }
    });
  };

  const handleConfirm = () => {
    const isFormValid = Array.from({ length: amount }, (_, index) => {
      const inputData = formData[index];
      return (
        inputData &&
        inputData.name.trim() !== "" &&
        inputData.surname.trim() !== "" &&
        inputData.documentNumber.trim() !== ""
      );
    }).every(Boolean);

    if (isFormValid) {
      alert("Confirmation successful!");
    } else {
      alert("Wszystkie pola muszą być wypełnione.");
    }
  };

  const handleFormDataChange = (id, data) => {
    setFormData((prevFormData) => {
      const updatedFormData = [...prevFormData];
      updatedFormData[id] = { ...updatedFormData[id], ...data };
      return updatedFormData;
    });
  };

  return (
    <div className="bg-white rounded-3xl w-[70%] h-fit z-20 p-12 shadow-lg items-center flex flex-col text-gray-800">
      <Timer booking_id={10} />
      <div className="border border-gray-300 rounded shadow w-[60%]">
        {Array.from({ length: amount }, (_, index) => (
          <ExpandingContent
            key={index}
            id={index}
            open={openIds.includes(index)}
            onToggle={() => handleToggle(index)}
            formData={formData[index] || {}}
            onFormDataChange={(data) => handleFormDataChange(index, data)}
          />
        ))}
      </div>
      <button
        onClick={handleConfirm}
        className="w-64 h-11 mt-8 font-medium bg-sky-600 uppercase rounded-full border border-gray-300 tracking-wider hover:border-sky-800 hover:border-2 shadow-lg text-white"
      >
        Potwierdź i kup
      </button>
    </div>
  );
}

export default EnterDetailsPage;
