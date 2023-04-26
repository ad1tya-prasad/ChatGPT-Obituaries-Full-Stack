import { useNavigate } from "react-router-dom";

// Put the reg layout here bbg
const Layout = (props) => {
  const navigate = useNavigate();
  const createObituary = () => {
    console.log("createObituary");
    props.setInForm(true);
    console.log(props.inForm);
    navigate("/New-Obituary");
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
    </>
  );
};

export default Layout;
