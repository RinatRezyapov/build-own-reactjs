import ReactDOM from "./react-dom";
import { Component } from "./Component";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clickCount: 0,
    }
    window.addEventListener('click', () => {
      this.setState({clickCount: this.state.clickCount + 1});
    })
  }
  render() {
    return {
      type: "div",
      props: {
        children: this.state.clickCount
      }
    };
  }
}

ReactDOM.render(
  { type: App, props: { title: "React.js" } },
  document.getElementById("root")
);
