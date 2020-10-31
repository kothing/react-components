import React, { FC, CSSProperties, ReactNode } from "react";
import { WrapperClassName } from "./index";

/**
 * Footer
 */
interface PropsType {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}
const Footer: FC<PropsType> = ({ className, style, children }) => {
  return (
    <div
      className={`${WrapperClassName}-footer${
        className ? ` ${className}` : ""
      }`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Footer;
