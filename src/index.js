import ReactDOM from "./react-dom";
import { Component } from "./Component";

class App extends Component {
  render() {
    return {
      type: "div",
      props: { children: `We are building ${this.props.title}` }
    };
  }
}

ReactDOM.render(
  { type: App, props: { title: "React.js" } },
  document.getElementById("root")
);
