import { useState, useCallback } from "react";

import EnvelopeCounter from "./EnvelopeCounter.jsx";
import IconButton from "../UI/IconButton.jsx";

function EnvelopesContainer() {
  const [count, setCount] = useState(0);

  const handleChoose = useCallback(function handleChoose() {
    setCount(Math.floor(Math.random() * 100));
  });

  function handleSave(count) {}

  return (
    <div id="envelopes-container">
      <h2>Choose your envelope</h2>
      <EnvelopeCounter count={count} />
      <div className="envelopes-button">
        <IconButton onClick={handleChoose}>Choose</IconButton>
        <IconButton onClick={() => handleSave(count)}>Save</IconButton>
      </div>
    </div>
  );
}

export default EnvelopesContainer;
