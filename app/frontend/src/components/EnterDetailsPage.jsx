import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ExpandingContent from "./ExpandingContent";
import Timer from "./Timer";

function EnterDetailsPage() {
  const [openIds, setOpenIds] = useState([0]);
  const [formData, setFormData] = useState([]);
  const [searchParams] = useSearchParams();
  const bookingInfo = Object.fromEntries(searchParams);

  const amount = bookingInfo.seats;

  const navigate = useNavigate();

  const handleToggle = (id) => {
    setOpenIds((prevOpenIds) => {
      if (prevOpenIds.includes(id)) {
        return prevOpenIds.filter((openId) => openId !== id);
      } else {
        return [id];
      }
    });
  };

  const postConfirmationData = async () => {
    try {
      const confirmBookingParams = {
        booking_id: bookingInfo.booking_id,
      };

      const response = await axios({
        method: "post",
        url: "/api/confirm_booking/",
        params: confirmBookingParams,
      });
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  const postCancellationData = async () => {
    try {
      const cancelBookingParams = {
        booking_id: bookingInfo.booking_id,
      };

      const response = await axios({
        method: "post",
        url: "/api/cancel_booking/",
        params: cancelBookingParams,
      });
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleFormDataChange = (id, data) => {
    setFormData((prevFormData) => {
      const updatedFormData = [...prevFormData];
      updatedFormData[id] = { ...updatedFormData[id], ...data };
      return updatedFormData;
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
      postConfirmationData();
      navigate("/booking-successful");
    } else {
      alert("Wszystkie pola muszą być wypełnione.");
    }
  };

  const handleCancel = () => {
    postCancellationData();
    navigate("/");
  };

  const handleTimerExpired = () => {
    handleCancel();
  };

  return (
    <div className="bg-white rounded-3xl w-[70%] h-fit z-20 p-12 shadow-lg items-center flex flex-col text-gray-800">
      <Timer
        bookingId={bookingInfo.booking_id}
        onTimerExpired={handleTimerExpired}
      />
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
      <div className="flex">
        <button
          onClick={handleConfirm}
          className="w-64 h-11 mt-8 font-medium bg-sky-600 uppercase rounded-full border border-gray-300 tracking-wider hover:border-sky-800 hover:border-2 shadow-lg text-white"
        >
          Potwierdź i kup
        </button>
        <button
          onClick={handleCancel}
          className="w-36 h-11 mt-8 ml-2 font-medium bg-gray-600 uppercase rounded-full border border-gray-300 tracking-wider hover:border-gray-800 hover:border-2 shadow-lg text-white"
        >
          Anuluj
        </button>
      </div>
    </div>
  );
}

export default EnterDetailsPage;
