import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Overlay from "./pages/Overlay";
import { useState } from "react";
import Layout from "./pages/Layout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/New-Obituary" element={<Overlay />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}


export default App;
