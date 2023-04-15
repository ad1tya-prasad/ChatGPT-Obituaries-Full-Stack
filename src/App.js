import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Overlay from "./pages/Overlay";
import { useState } from "react";
import Layout from "./pages/Layout";

function App() {
  const [inForm, setInForm] = useState(false);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Layout setInForm={setInForm} inForm={inForm} />}
          />
          <Route path="/New-Obituary" element={<Overlay />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
