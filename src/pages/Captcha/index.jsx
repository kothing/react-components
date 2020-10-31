import React from "react";
import { Captcha } from "../../Components";

const CaptchaPage = () => {
  return (
    <div className="demoBox">
      <h3>验证码</h3>
      <Captcha placeholder="Enter captcha" />
    </div>
  );
};

export default CaptchaPage;
