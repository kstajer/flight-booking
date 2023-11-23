import { Routes, Route, BrowserRouter } from "react-router-dom";
import SearchPage from "./components/SearchPage";
import ResultsPage from "./components/ResultsPage";

function App() {
  return (
    <div className="h-screen w-screen items-center flex justify-center bg-plane-bg bg-no-repoeat bg-cover bg-fixed bg-center">
      <BrowserRouter>
        <Routes>
          <Route>
            <Route path="/" element={<SearchPage />} />
            <Route path="results" element={<ResultsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
