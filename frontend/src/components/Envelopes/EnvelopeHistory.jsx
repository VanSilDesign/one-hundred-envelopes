import { useState, useEffect } from "react";
import EnvelopeNumbers from "./EnvelopeNumbers";
import ErrorPage from "../ErrorPage";
import { fetchAvailableNumbers } from "../../http.js";

function EnvelopesHistory({numbers, isFetching}) {
  const [error, setError] = useState();


  if (error) {
    return <ErrorPage title="An error occured" message={error.message} />;
  }

  return (
    <div id="envelopes-history">
      <EnvelopeNumbers
        title="Envelopes History"
        numbers={numbers}
        isLoading={isFetching}
        loadingText="Fetching numbers data..."
        fallbackText="No numbers available."
        //onSelectNumber={onSelectNumber}
      />
    </div>
  );
}

export default EnvelopesHistory;
