import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment-with-locales-es6";
import { MdArrowRightAlt } from "react-icons/md";
import { LuPlaneLanding } from "react-icons/lu";
import { LuPlaneTakeoff } from "react-icons/lu";

function ResultsPage() {
  const [searchParams] = useSearchParams();
  const findFlightsParams = Object.fromEntries(searchParams);
  const [flights, setFlights] = useState([]);

  const navigate = useNavigate();
  moment.locale("pl");

  const getTime = (date) => {
    return moment(date).utcOffset(0).format("HH:mm");
  };

  const getDate = (date) => {
    return moment(date).utcOffset(0).format("D MMMM yyyy");
  };

  const handleSubmit = (clickedFlightId) => {
    const searchParams = {
      flight_id: clickedFlightId,
    };

    const queryString = new URLSearchParams(searchParams).toString();
    navigate(`/seats?${queryString}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          method: "get",
          url: "http://localhost:8000/api/find_flights",
          params: findFlightsParams,
        });
        setFlights(response.data);
      } catch (error) {
        alert("Something went wrong. Please try again.");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-3xl w-[90%] h-fit z-20 flex flex-col items-center justify-center shadow-lg text-gray-800">
      {flights.length > 0 ? (
        flights.map((flight, index) => (
          <div className="w-full" key={flight.flight_id}>
            <div
              key={flight.flight_id}
              className="w-full flex justify-between items-center p-8 px-12"
            >
              <img
                src={process.env.PUBLIC_URL + "/airline2.png"}
                className="w-20 h-20 opacity-95"
              />
              <div className="flex flex-col items-center ml-16">
                <span className="mb-4 text-gray-600">
                  {getDate(flight.departure_time)}
                </span>
                <div className="w-full flex text-3xl gap-6 justify-center items-center">
                  <LuPlaneTakeoff className="text-gray-300 text-xl" />
                  <span className="text-xl">
                    {getTime(flight.departure_time)}
                  </span>
                  <span>{flight.from_airport_code}</span>
                  <MdArrowRightAlt />
                  <span>{flight.to_airport_code}</span>
                  <span className="text-xl">
                    {getTime(flight.arrival_time)}
                  </span>
                  <LuPlaneLanding className="text-gray-300 text-xl" />
                </div>
              </div>
              <button
                onClick={() => handleSubmit(flight.flight_id)}
                className="w-44 h-11 font-medium bg-sky-600 uppercase rounded-full border mt-4 border-gray-300 tracking-wider hover:border-sky-800 hover:border-2 shadow-lg text-white"
              >
                Wybierz
              </button>
            </div>
            {index !== flights.length - 1 && (
              <hr className="text-gray-300 w-full" />
            )}
          </div>
        ))
      ) : (
        <div className="h-40 p-4 flex flex-col items-center justify-center gap-4">
          <span className="text-lg">
            {"Nie znaleziono lotów w podanym terminie :("}
          </span>
          <button
            onClick={() => navigate("/")}
            className="w-64 h-11 font-medium bg-sky-600 uppercase rounded-full border mt-4 border-gray-300 tracking-wider hover:border-sky-800 hover:border-2 shadow-lg text-white"
          >
            Wróć do wyszukiwarki
          </button>
        </div>
      )}
    </div>
  );
}

export default ResultsPage;
