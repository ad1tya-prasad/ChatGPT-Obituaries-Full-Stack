import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Overlay from "./Overlay";

const Layout = () => {
  const navigate = useNavigate();
  const [inForm, setInForm] = useState(false);
  const [images, setImages] = useState([]);

  const createObituary = () => {
    setInForm(true);
  };

  const addImage = (newImage) => {
    setImages([...images, newImage]);
  };
  return (
    <>
      <header>
        <h1>The Last Show</h1>
        <button type="button" onClick={createObituary}>
          + New Obituary
        </button>
      </header>
      {count == 0 ? (
        <h1 className="noObituary">No Obituary Yet.</h1>
      ) : (
        <div className="image-container">
          {images.map((image, index) => (
            <div className="image" key={index}>
              <img src={URL.createObjectURL(image.file)} alt={image.name} />
              <h2>{image.name}</h2>
              <p>Born: {image.dob}</p>
              <p>Died: {image.dod}</p>
            </div>
          ))}
        </div>
      )}
      {inForm && <Overlay setInForm={setInForm} addImage={addImage} />}
    </>
  );
};

export default Layout;
