import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import pl from "date-fns/locale/pl";
import "react-datepicker/dist/react-datepicker.css";

function SearchPage() {
  const [airports, setAirports] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

  registerLocale("pl", pl);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          method: "get",
          url: "http://localhost:8000/api/airports",
        });
        setAirports(response.data);
      } catch (error) {
        alert("Error. Please try again.");
      }
    };

    fetchData();
  }, []);

  const options = airports.map((airport) => ({
    value: airport.airport_name,
    label: airport.airport_name,
  }));

  return (
    <div className="h-screen w-screen items-center flex justify-center bg-plane-bg  bg-no-repoeat bg-cover bg-fixed bg-center">
      <div className="bg-white rounded-3xl w-[60%] h-fit py-12 z-20 flex flex-col items-center justify-center gap-8 shadow-lg">
        <div className="w-[350px]">
          <label htmlFor="select1" className="text-gray-700">
            Odlot
          </label>
          <Select
            options={options}
            name="select1"
            placeholder="Lotnisko"
            className="w-full"
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
            locale="pl"
            className="w-full border border-gray-300 px-2 h-[40px] rounded-md text-gray-800"
          />
        </div>

        <button className="w-40 h-10 rounded-full border mt-4 border-gray-300 hover:border-gray-700 text-gray-800 focus:border-gray-300">
          Wyszukaj loty
        </button>
      </div>
    </div>
  );
}

export default SearchPage;
