import React, { Component, CSSProperties, ReactNode } from "react";
import { WrapperClassName } from "./index";

/**
 * Sider
 */
interface PropsType {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}
interface StateType {}

class Sider extends Component<PropsType, StateType> {
  public name: string = "Sider";
  render() {
    const { className, style, children } = this.props;
    return (
      <div
        className={`${WrapperClassName}-sider${
          className ? ` ${className}` : ""
        }`}
        style={style}
      >
        {children}
      </div>
    );
  }
}

export default Sider;
