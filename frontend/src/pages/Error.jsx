import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  let title = "An error has occurred";
  let message = "Something went wrong";

  if (error.status === 500) {
    message = JSON.parse(error.data).message;
  }
  if (error.status === 404) {
    title = "Not Found";
    message = "Could not find resource or page";
  }

  return (
    <>
      <h1>{title}</h1>
      <p>{message}</p>
    </>
  );
}

export default ErrorPage;
