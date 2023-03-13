import React from "react";
import {
  HashRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";
import AppLayout from "./Layout";
import Home from "./pages/Home";
import Audio from "./pages/Audio";
import Button from "./pages/Button";
import Captcha from "./pages/Captcha";
import Dialog from "./pages/Dialog";
import Modal from "./pages/Modal";
import Placeholder from "./pages/Placeholder";
import Ripple from "./pages/Ripple";
import StarRating from "./pages/StarRating";
import Tabs from "./pages/Tabs";
import Toast from "./pages/Toast";
import TreeTransfer from "./pages/TreeTransfer";
import NotFound from "./pages/NotFound";
import "./App.css";

const { Header, Sider, Content } = AppLayout;

const menus = [
  {
    path: "/button",
    name: "Button",
    component: Button,
  },
  {
    path: "/dialog",
    name: "Dialog",
    component: Dialog,
  },
  {
    path: "/modal",
    name: "Modal",
    component: Modal,
  },
  {
    path: "/captcha",
    name: "Captcha",
    component: Captcha,
  },
  {
    path: "/placeholder",
    name: "Placeholder",
    component: Placeholder,
  },
  {
    path: "/starRating",
    name: "StarRating",
    component: StarRating,
  },
  {
    path: "/tabs",
    name: "Tabs",
    component: Tabs,
  },
  {
    path: "/ripple",
    name: "Ripple",
    component: Ripple,
  },
  {
    path: "/toast",
    name: "Toast",
    component: Toast,
  },
  {
    path: "/treeTransfer",
    name: "TreeTransfer",
    component: TreeTransfer,
  },
  {
    path: "/audio",
    name: "Audio",
    component: Audio,
  },
];

function App() {
  return (
    <Router>
      <div className="App">
        <AppLayout>
          <Header>
            <header className="app-header">Kothing React components</header>
          </Header>
          <Sider>
            <ul className="app-menu">
              <li>
                <NavLink exact to="/">
                  Home
                </NavLink>
              </li>
              {menus.map((item) => (
                <li key={item.name}>
                  <NavLink
                    {...(item.path === "/" ? { exact: true } : "")}
                    to={item.path}
                    activeClassName="active"
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </Sider>
          <Content>
            <main className="app-main">
              <Switch>
                <Route exact path="/" component={Home} />
                {menus.map((item) => (
                  <Route
                    key={item.name}
                    path={item.path}
                    component={item.component}
                  />
                ))}
                <Route component={NotFound} />
                <Redirect to="/" />
              </Switch>
            </main>
          </Content>
        </AppLayout>
      </div>
    </Router>
  );
}

export default App;
