# Dialog
A dialog displays content that temporarily blocks interactions with the main view of a site.

**Usage**
```
import React from "react";

import Dialog from "./Dialog";

export default class DialogDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  toggleShow() {
    this.setState({
      visible: !this.state.visible
    });
  }

  onCancel() {
    this.setState({
      visible: false
    });
  }

  render() {
    let { visible } = this.state;
    return (
      <div className="dialog-demo">

        <Dialog
          key="dialog"
          visible={visible}
          title="Dialog Title"
          onOK={() => {}}
          onCancel={() => this.onCancel()}
        >
          <p>Dialog Content</p>
        </Dialog>
        <button
          className="x-button" 
          onClick={
            () => this.toggleShow()
          }
        >
          Dialog {visible ? "Hide" : "Show"}
        </button>
      </div>
    );
  }
}

```
