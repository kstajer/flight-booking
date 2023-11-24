import { Routes, Route, BrowserRouter } from "react-router-dom";
import SearchPage from "./components/SearchPage";
import ResultsPage from "./components/ResultsPage";
import ChooseSeatsPage from "./components/ChooseSeatsPage";
import EnterDetailsPage from "./components/EnterDetailsPage";

function App() {
  return (
    <div className="h-screen w-screen items-center flex justify-center bg-plane-bg bg-no-repoeat bg-cover bg-fixed bg-center">
      <BrowserRouter>
        <Routes>
          <Route>
            <Route path="/" element={<SearchPage />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="seats" element={<ChooseSeatsPage />} />
            <Route path="details" element={<EnterDetailsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
