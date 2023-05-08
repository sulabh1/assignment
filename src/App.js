import { Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import "./App.css";
import PaginationData from "./helpers/Pagination";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home PaginationData={PaginationData} />} />
        {/* <Route path="/about" element={<h1>About</h1>} /> */}
      </Routes>
    </div>
  );
}

export default App;
