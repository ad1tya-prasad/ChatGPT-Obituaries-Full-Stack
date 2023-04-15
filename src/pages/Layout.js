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
        <h1>Header</h1>
        <button type="button" onClick={createObituary}>
          + Create new obituary
        </button>
      </header>
      <h1>Layout</h1>
    </>
  );
};

export default Layout;
