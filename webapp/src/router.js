import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink
} from "react-router-dom";

let json_files = [
  "S01E01.json",
  "S01E02.json",
  "S01E03.json",
  "S01E04.json",
  "S01E05.json",
  "S01E06.json",
  "S01E07.json",
  "S01E08.json",
  "S01E09.json",
  "S01E10.json",
  "S02E01.json",
  "S02E02.json",
  "S02E03.json",
  "S02E04.json",
  "S02E05.json",
  "S02E06.json",
  "S02E07.json",
  "S02E08.json",
  "S02E09.json",
  "S02E10.json",
];

export default function App() {
  let file_links = [];
  let file_routes = []
  json_files.forEach((file) => {
    let episode_name = file.split(".")[0];
    let episode_path = "/" + episode_name
    file_links.push(<li><NavLink to={episode_name} key={episode_name}>{episode_name}</NavLink></li>);
    file_routes.push(
      <Route exact path={episode_path}>
        <Episode name={episode_name} key={episode_name} />
        </Route>
     )
  });
  return (
    <Router>
      <div>
        <ul className="sidebar">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          {file_links}
        </ul>

        <hr />

        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          {file_routes}
        </Switch>
      </div>
    </Router>
  );
}

function Home(){
  return (
    <div>
      <h1>Home</h1>
      <p> Welcome to On Cinema Transcripts🍿🍿🍿🍿🍿! This is very much a work in progress. But enjoy what's here so far!</p>
    </div>
  );
}

class Line extends React.Component {
  render() {
    return (
      <div class="line">
      {this.props.person + ": " + this.props.line}
      </div>
    )
  }
}

class StageDirection extends React.Component {
  render() {
    return (
      <div class="stage_diraction">
      <em>{this.props.stage_direction}</em>
      </div>
    )
  }
}
class Episode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      name: props.name,
      transcript: null,
    }
  }
  componentDidMount() {
    fetch("http://192.168.1.169:3001/"+this.state.name+".json")
      .then( res => res.json())
      .then(
        (result) => {
          console.log(result)
          this.setState({
            transcript: result,
            isLoading: false,
          });
        }
      )
  }
  render() {
    if (this.state.isLoading){
      return (
        <p>loading!!!</p>
      )
    }
    let lines = [];
    console.log("---------");
    let transcript = this.state.transcript;
    this.state.transcript.transcript.forEach((item) => {
      if (item.type === 'line') {
        let line = <Line person={item.person} line={item.line} />;
        lines.push(line);
      } else if (item.type === 'stage_direction') {
        let stage_direction = <StageDirection stage_direction={item.stage_direction} />;
        lines.push(stage_direction);
      }
    });
    return (
      <div>
        <h1>{this.state.name}</h1>
        {lines}
      </div>
    );
  }
}
