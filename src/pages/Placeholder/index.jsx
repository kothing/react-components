import React, { useState, useEffect } from "react";
import { Placeholder } from "../../Components";

const PlaceholderPage = () => {
  const [placeholderReady, setPlaceholderReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setPlaceholderReady(true);
    }, 1000);
  }, []);

  return (
    <div className="demoBox">
      <h3>Placeholder</h3>
      <Placeholder type="media" rows={7} ready={placeholderReady}>
        MyComponent
      </Placeholder>
    </div>
  );
};

export default PlaceholderPage;
