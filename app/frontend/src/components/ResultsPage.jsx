import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import moment from "moment-with-locales-es6";

function ResultsPage() {
  const [searchParams] = useSearchParams();
  const findFlightsParams = Object.fromEntries(searchParams);
  const [flights, setFlights] = useState([]);

  moment.locale("pl");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          method: "get",
          url: "http://localhost:8000/api/find_flights",
          params: findFlightsParams,
        });
        setFlights(response.data);
        console.log(response.data);
      } catch (error) {
        alert("Error. Please try again.");
      }
    };

    fetchData();
  }, []);

  const getTime = (date) => {
    return moment(date).utcOffset(0).format("HH:mm");
  };

  const getDate = (date) => {
    return moment(date).format("D MMMM");
  };

  return (
    <div className="bg-white rounded-3xl w-[90%] h-fit py-12 z-20 flex flex-col items-center justify-center gap-8 shadow-lg">
      {flights.map((flight) => (
        <div key={flight.flight_id} className="w-full flex flex-col">
          <span>{getDate(flight.arrival_time)}</span>
          <span>{getTime(flight.arrival_time)}</span>
          <span>{flight.seats}</span>
          <span>{flight.flight_id}</span>
          <hr className="text-gray-300 w-full" />
        </div>
      ))}
    </div>
  );
}

export default ResultsPage;
