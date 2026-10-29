import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div>
      <h1>Oh no, something went wrong!</h1>
      
        You can go back to the home page by <Link to="/">clicking here</Link>, though!
      
    </div>
  );
};

export default ErrorPage;