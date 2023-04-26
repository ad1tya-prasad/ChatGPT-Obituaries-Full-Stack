import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Overlay from "./Overlay";

const Layout = () => {
  const navigate = useNavigate();
  const [inForm, setInForm] = useState(false);
  const [images, setImages] = useState([]);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);

  const createObituary = () => {
    setInForm(true);
  };

  const addImage = (newImage) => {
    setImages([...images, newImage]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://atljom7p67ty535xlh7ygxv24m0ntzyj.lambda-url.ca-central-1.on.aws/",
          {
            method: "GET",
          }
        );
        console.log(response.status); // check response status
        const data = await response.json();
        setData(data);
        setCount(data.length);
        console.log(data); // check data being returned
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [inForm]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://atljom7p67ty535xlh7ygxv24m0ntzyj.lambda-url.ca-central-1.on.aws/",
          {
            method: "GET",
          }
        );
        console.log(response.status); // check response status
        const data = await response.json();
        setData(data);
        setCount(data.length);
        console.log(data); // check data being returned
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

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
          {data.map((image, index) => (
            <div className="image" key={index}>
              <img src={image.img} alt={image.name} />
              <h2>{image.name}</h2>
              <div className="dates">
                <p className="birth-date">
                  {" "}
                  {new Date(image.born).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="death-date">
                  {"‎ - "}
                  {new Date(image.died).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <p className="desc" style={{fontFamily:"Satisfy"}}>{image.obituary}</p>
                <button
                  type="button"
                  value="sound"
                  className="play-button"
                  id="music-toggle"
                  onClick={() => {
                    let audio = new Audio(image.voice);
                    const btn = document.getElementById("music-toggle");
                    audio.play();
                  }}
                >
                  &#9658;
                </button>
            </div>
          ))}
        </div>
      )}
      {inForm && <Overlay setInForm={setInForm} addImage={addImage} />}
    </>
  );
};

export default Layout;
