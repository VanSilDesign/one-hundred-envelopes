import { useRouteError } from "react-router-dom";
import Header from "../components/Header";
import errorImg from "../../src/assets/error_image.png";
import errorClasses from "./Error.module.css";
import BottomNavbar from "../components/navbar/BottomNavbar";

function ErrorPage() {
  const error = useRouteError();
  let title = "An error has occurred";
  let message = "Something went wrong";
  
  switch (error.status) {
    case 401:
      title = "Unauthorized";
      message = "Effettua il login per vedere questa pagina.";
      break;
    case 402:
      title = "Forbidden";
      message = "Non hai i permessi per accedere a questa risorsa.";
      break;
    case 404:
      title = "Not Found";
      message = "Mi spiace, la pagina che cerchi non esiste o non è disponibile.";
      break;
    case 500:
      title = "Forbidden";
      message = JSON.parse(error.data).message;
      break;
  
    default:
      break;
  }

  return (
    <>
      <Header />
      <main>
        <h1 className={errorClasses.error_title}>{title}</h1>
        <p>{message}</p>
        <img className={errorClasses.error_image} src={errorImg} alt="Envelope with a broken heart" />
      </main>
      <BottomNavbar />
    </>
  );
}

export default ErrorPage;
