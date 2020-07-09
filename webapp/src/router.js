import React from "react";
import './index.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink
} from "react-router-dom";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      json_files: null,
    }
  }

  componentDidMount() {
    if (this.state.isLoading){
      fetch("json/list.json")
        .then( res => res.json())
        .then(
          (result) => {
            this.setState({
              json_files: result.files,
              isLoading: false,
            });
          }
        )
    }
  }
  render() {
    if (this.state.isLoading){
      return (
        <p>loading!!!</p>
      )
    }
    let file_links = [];
    let file_routes = []
    this.state.json_files.forEach((file) => {
      let episode_name = file.split(".")[0];
      let episode_path = "/" + episode_name
      file_links.push(<NavLink to={episode_name} key={episode_name}>{episode_name}</NavLink>);
      file_routes.push(
        <Route exact path={episode_path}>
          <Episode name={episode_name} key={episode_name} />
          </Route>
       )
    });
    return (
      <Router>
        <div className="sidebar">
          <NavLink to="/">Home</NavLink>
          {file_links}
          <hr />
        </div>
        <div className="main">
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
}

function Home(){
  return (
    <div>
      <h2>Home</h2>
      <p> Welcome to On Cinema Transcripts🍿🍿🍿🍿🍿! This is very much a work in progress. But enjoy what's here so far!</p>
    </div>
  );
}

class Line extends React.Component {
  render() {
    return (
      <div className="linecontainer">
        <span className="person gregg">{this.props.person}</span>
        <span>: </span>
        <span className="line gregg">{this.props.line}</span>
      </div>
    )
  }
}

class StageDirection extends React.Component {
  render() {
    return (
      <div class="stage_direction">
      <em><strong>{this.props.stage_direction}</strong></em>
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
    fetch("json/"+this.state.name+".json")
      .then( res => res.json())
      .then(
        (result) => {
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
