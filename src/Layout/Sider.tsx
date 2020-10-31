import React, { FC, CSSProperties, ReactNode } from "react";
import { WrapperClassName } from "./index";

/**
 * Sider
 */
interface PropsType {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}
const Sider: FC<PropsType> = ({ className, style, children }) => {
  return (
    <div
      className={`${WrapperClassName}-sider${className ? ` ${className}` : ""}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Sider;
