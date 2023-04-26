import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Overlay = (props) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [dod, setDod] = useState("");
  const [dob, setDob] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!name || !dob || !dod || !file) {
      alert("Please fill all fields!");
      return;
    }
    const data = new FormData();
    data.append("file", file);
    data.append("name", name);
    data.append("dob", dob);
    data.append("dod", dod);

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://46ztutzdfa27mynq26mrqnfflu0vdjat.lambda-url.ca-central-1.on.aws/",
        {
          method: "POST",
          body: data,
        }
      );
      if (response.ok) {
        // handle success response here
      } else {
        // handle error response here
      }
    } catch (error) {
      // handle fetch error here
    } finally {
      setIsLoading(false);
    }
  };

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onCloseOverlay = () => {
    props.setInForm(false);
    navigate("/");
  };

  return (
    <div className="overlay">
      <div className="overlay-content">
        <button className="close-button" onClick={onCloseOverlay}>
          X
        </button>
        <form onSubmit={onSubmitForm} className="form">
          <h1>Create a New Obituary</h1>
          <img src="/obituary.png" alt="obituary" className="obituary-img" />
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>Select an image for the deceased:</span>
            <input
              type="file"
              required
              accept="images/*"
              onChange={(e) => onFileChange(e)}
              style={{ marginLeft: "10px" }}
            />
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name of the Deceased"
            style={{ fontSize: "20px" }}
          />

          <div>
            Born:
            <input
              type="datetime-local"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="date"
            />
            Died:
            <input
              type="datetime-local"
              value={dod}
              onChange={(e) => setDod(e.target.value)}
              className="date"
            />
          </div>
          <button
            className="submit-button"
            type="submit"
            onClick={onSubmitForm}
            disabled={isLoading} // disable the button if isLoading is true
          >
            {isLoading ? "Loading..." : "Write Obituary"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Overlay;
