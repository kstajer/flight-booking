import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment-with-locales-es6";
import { MdArrowRightAlt } from "react-icons/md";
import { LuPlaneLanding } from "react-icons/lu";
import { LuPlaneTakeoff } from "react-icons/lu";
import BeatLoader from "react-spinners/BeatLoader";
import { MdKeyboardBackspace } from "react-icons/md";
import config from "../axios.config";
import FlightsList from "./FlightsList";

function ResultsPage() {
  const [searchParams] = useSearchParams();
  const findFlightsParams = Object.fromEntries(searchParams);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  moment.locale("pl");

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
          baseURL: config.baseURL,
          url: "/api/find_flights/",
          params: findFlightsParams,
        });
        setFlights(response.data);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        alert("Coś poszło nie tak. Spróbuj ponownie później");
        navigate("/");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white relative rounded-3xl w-[90%] h-fit z-20 flex flex-col items-center justify-center shadow-lg text-gray-800">
      {loading ? (
        <div className="py-10 flex flex-col items-center justify-center gap-4">
          <BeatLoader
            color={"#0284be"}
            loading={loading}
            size={15}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : Array.isArray(flights) && flights.length > 0 ? (
        <FlightsList flights={flights}>
          {(flight) => (
            <button
              onClick={() => handleSubmit(flight.flight_id)}
              className="w-44 h-11 font-medium bg-sky-600 uppercase rounded-full border mt-4 border-gray-300 tracking-wider hover:border-sky-800 hover:border-2 shadow-lg text-white"
            >
              Wybierz
            </button>
          )}
        </FlightsList>
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
