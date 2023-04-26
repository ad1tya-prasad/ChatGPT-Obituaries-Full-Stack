import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Overlay from "./Overlay";

const Layout = () => {
  const navigate = useNavigate();
  const [inForm, setInForm] = useState(false);
  const [images, setImages] = useState([]);
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [showContent, setShowContent] = useState(false);

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
  }, [inForm === false]);

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
            <div className="image" key={index} id={index}>
              <img
                src={image.img}
                alt={image.name}
                onClick={() => setShowContent(!showContent)}
              />
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
              <div className={showContent ? "content" : "hidden"}>
                <p className="desc" style={{ fontFamily: "Satisfy" }}>
                  {image.obituary}
                </p>
                <div className="play-button">
                  <button
                    type="button"
                    value="sound"
                    className="play-button"
                    id="music-toggle"
                    src={image.audio}
                    onClick={() => {
                      let parent = document.getElementById(index);
                      let audio = parent.children[4];
                      let audiobtn = audio.children[0];
                      let audiotag = new Audio(image.voice);
                      console.log(audio);
                      if (audio.classList.contains("play-button")) {
                        audio.classList.remove("play-button");
                        audio.classList.add("pause-button");
                        audiobtn.innerHTML = "| |";
                        console.log("playing");
                        audiotag.play();
                      } else {
                        audio.classList.remove("pause-button");
                        audio.classList.add("play-button");
                        audiobtn.innerHTML = "&#9658;";
                        console.log("pausing");
                        audiotag.pause();
                      }
                    }}
                  >
                    &#9658;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {inForm && <Overlay setInForm={setInForm} addImage={addImage} />}
    </>
  );
};

export default Layout;
