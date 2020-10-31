import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "../../Components";

const Demo = () => {
  return (
    <div className="demoBox">
      <h3>选项卡</h3>
      <Tabs>
        <TabList>
          <Tab>Title 1</Tab>
          <Tab>Title 2</Tab>
        </TabList>
        <TabPanel>
          <h2>content 1</h2>
        </TabPanel>
        <TabPanel>
          <h2>content 2</h2>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Demo;
