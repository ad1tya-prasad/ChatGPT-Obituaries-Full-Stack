import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Overlay from "./Overlay";

const Layout = () => {
  const navigate = useNavigate();
  const [inForm, setInForm] = useState(false);
  
  const createObituary = () => {
    setInForm(true);
  };
  
  return (
    <>
      <header>
        <h1>The Last Show</h1>
        <button type="button" onClick={createObituary}>
          + New Obituary
        </button>
      </header>
      <h1 className="noObituary">No Obituary Yet.</h1>
      {inForm && <Overlay setInForm={setInForm} />}
    </>
  );
  
};

export default Layout;
