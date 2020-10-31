import React from "react";
import { Button, Ripple } from "../../Components";

const RipplePage = () => {
  return (
    <div className="demoBox">
      <h3>按钮</h3>
      <Button type="default">
        <Ripple
          overHidden
          centerMode={false}
          rippleColor="#f44336"
          size="default"
        />
        Button
      </Button>
    </div>
  );
};

export default RipplePage;
