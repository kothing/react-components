import React, { Component, CSSProperties, ReactNode } from "react";
import { WrapperClassName } from "./index";

/**
 * Content
 */
interface PropsType {
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
}
interface StateType {}

class Content extends Component<PropsType, StateType> {
  render() {
    const { className, style, children } = this.props;
    return (
      <div
        className={`${WrapperClassName}-content${
          className ? ` ${className}` : ""
        }`}
        style={style}
      >
        {children}
      </div>
    );
  }
}

export default Content;
