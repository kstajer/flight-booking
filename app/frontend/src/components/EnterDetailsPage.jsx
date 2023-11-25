import React, { useState } from "react";
import ExpandingContent from "./ExpandingContent";

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
    <div className="bg-white rounded-3xl w-[70%] h-fit z-20 p-12 shadow-lg flex flex-col text-gray-800">
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
      <button onClick={handleConfirm}>Confirm</button>
    </div>
  );
}

export default EnterDetailsPage;
