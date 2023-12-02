import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import pl from "date-fns/locale/pl";
import "react-datepicker/dist/react-datepicker.css";
import { IoIosSearch } from "react-icons/io";
import config from "../axios.config";

function SearchPage() {
  const [airports, setAirports] = useState([]);
  const [options, setOptions] = useState([]);
  const [departureAirport, setDepartureAirport] = useState(null);
  const [arrivalAirport, setArrivalAirport] = useState(null);
  const [startDate, setStartDate] = useState(new Date());

  const isAdmin = localStorage.getItem("user_id") === "1";

  const navigate = useNavigate();
  registerLocale("pl", pl);

  const handleSubmit = (e) => {
    e.preventDefault();

    const searchParams = {
      from_airport_id: departureAirport ? departureAirport.value : null,
      to_airport_id: arrivalAirport ? arrivalAirport.value : null,
      date: startDate.toISOString(),
    };

    const queryString = new URLSearchParams(searchParams).toString();
    navigate(`/results?${queryString}`);
  };

  const onLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_id')
    navigate('/login')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          method: "get",
          baseURL: config.baseURL,
          url: "api/airports/",
        });
        setAirports(response.data);
      } catch (error) {
        alert("Coś poszło nie tak. Spróbuj ponownie później");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (airports && Array.isArray(airports) && airports.length > 0) {
      const airportOptions = airports.map((airport) => ({
        value: airport.airport_id,
        label: airport.airport_full_name,
      }));

      setOptions(airportOptions);
    }
  }, [airports]);

  return (
    <>
      <div className="absolute right-5 top-2 flex gap-4">
        {isAdmin && (
          <button
            onClick={() => navigate("/admin")}
            className="w-[210px] h-10 font-medium bg-green-500 uppercase rounded-full border mt-4 border-green-500 tracking-wider hover:border-green-600 hover:border-2 shadow-lg text-white"
          >
            Zarządzaj lotami
          </button>
        )}
        <button
          onClick={() => navigate("/client")}
          className="w-[210px] h-10 font-medium bg-sky-600 uppercase rounded-full border mt-4 border-sky-600 tracking-wider hover:border-sky-800 hover:border-2 shadow-lg text-white"
        >
          Moje rezerwacje
        </button>
        <button
          onClick={onLogout}
          className="w-[180px] h-10 font-medium bg-sky-600 uppercase rounded-full border mt-4 border-sky-600 tracking-wider hover:border-sky-800 hover:border-2 shadow-lg text-white"
        >
          Wyloguj
        </button>
      </div>
      <div className="bg-white rounded-3xl w-[60%] h-fit py-12 z-20 flex flex-col items-center justify-center gap-8 shadow-lg">
        <form
          className="flex flex-col gap-8 items-center"
          onSubmit={handleSubmit}
        >
          <div className="w-[350px]">
            <label htmlFor="select1" className="text-gray-700">
              Odlot
            </label>
            <Select
              options={options}
              name="select1"
              placeholder="Lotnisko"
              className="w-full"
              onChange={setDepartureAirport}
              required
            />
          </div>
          <div className="w-[350px]">
            <label htmlFor="select2" className="text-gray-700">
              Przylot
            </label>
            <Select
              options={options}
              placeholder="Lotnisko"
              name="select2"
              className="w-full"
              onChange={setArrivalAirport}
              required
            />
          </div>

          <div className="w-[350px] flex flex-col">
            <label htmlFor="select2" className="text-gray-700">
              Data
            </label>
            <DatePicker
              selected={startDate}
              minDate={new Date()}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              locale="pl"
              className="w-full border border-gray-300 px-2 h-[40px] rounded-md text-gray-800"
              required
            />
          </div>

          <button
            type="submit"
            className="w-[240px] h-11 font-medium bg-sky-600 uppercase rounded-full border mt-4 border-gray-300 tracking-wider hover:border-sky-800 hover:border-2 shadow-lg text-white"
          >
            <div className="w-full h-full items-center flex justify-center">
              <IoIosSearch className="pr-2 text-3xl" />
              <span>Wyszukaj loty</span>
            </div>
          </button>
        </form>
      </div>
    </>
  );
}

export default SearchPage;
