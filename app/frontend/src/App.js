import { Routes, Route, BrowserRouter } from "react-router-dom";
import SearchPage from "./components/SearchPage";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route>
            <Route path="/" element={<SearchPage />} />
            <Route path="results" element={<SearchPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
