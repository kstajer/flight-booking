import React from "react";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment-with-locales-es6";
import { MdArrowRightAlt } from "react-icons/md";
import { LuPlaneLanding } from "react-icons/lu";
import { LuPlaneTakeoff } from "react-icons/lu";
import Select from "react-select";

function ChooseSeatsPage() {
  const [searchParams] = useSearchParams();
  const flightId = Object.fromEntries(searchParams);

  const [ticketsQuantity, setTicketsQuantity] = useState(null);
  const [availableSeats, setAvailableSeats] = useState(null);
  const [flight, setFlight] = useState();

  const navigate = useNavigate();
  moment.locale("pl");

  const getTime = (date) => {
    return moment(date).utcOffset(0).format("HH:mm");
  };

  const getDate = (date) => {
    return moment(date).utcOffset(0).format("D MMMM yyyy");
  };

  const options = [
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
    { label: "4", value: 4 },
    { label: "5", value: 5 },
  ];

  const fetchData = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "http://localhost:8000/api/get_flight_details",
        params: flightId,
      });
      setFlight(response.data);
      setAvailableSeats(response.data.available_seats);
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  const postData = async () => {
    try {
      const createBookingParams = {
        flight_id: flight.flight_id,
        seats: ticketsQuantity.value,
        client_id: 1,
      };

      const response = await axios({
        method: "post",
        url: "http://localhost:8000/api/create_booking/",
        params: createBookingParams,
      });
      setFlight(response.data);
      setAvailableSeats(response.data.available_seats);
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  };

  const handleSubmit = () => {
    fetchData().then(() => {
      if (ticketsQuantity.value <= availableSeats) {
        postData();
        navigate("/details");
      } else console.log("za malo biletow");
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-3xl w-[70%] h-fit z-20 p-12 flex flex-col items-center justify-center shadow-lg text-gray-800">
      {flight && (
        <div
          key={flight.flight_id}
          className="w-full flex items-center justify-center px-12"
        >
          <div className="flex flex-col items-center">
            <span className="mb-4 text-gray-600">
              {getDate(flight.departure_time)}
            </span>
            <div className="w-full flex text-3xl gap-6 justify-center items-center">
              <LuPlaneTakeoff className="text-gray-300 text-xl" />
              <span className="text-xl">{getTime(flight.departure_time)}</span>
              <span>{flight.from_airport_code}</span>
              <MdArrowRightAlt />
              <span>{flight.to_airport_code}</span>
              <span className="text-xl">{getTime(flight.arrival_time)}</span>
              <LuPlaneLanding className="text-gray-300 text-xl" />
            </div>
          </div>
        </div>
      )}
      <div className="mt-12">
        <label htmlFor="select2" className="text-gray-700">
          Ilość biletów
        </label>
        <Select
          options={options}
          placeholder="Ilość"
          name="select2"
          className="w-[100px]"
          onChange={setTicketsQuantity}
          required
        />
      </div>
      <button
        onClick={handleSubmit}
        className="w-44 h-11 mt-8 font-medium bg-sky-600 uppercase rounded-full border border-gray-300 tracking-wider hover:border-sky-800 hover:border-2 shadow-lg text-white"
      >
        Rezerwuj
      </button>
    </div>
  );
}

export default ChooseSeatsPage;
