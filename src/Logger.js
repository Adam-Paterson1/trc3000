import React, { Component } from 'react';
import { subscribeToLogs } from './Socket'

class Logger extends Component {
  constructor(props) {
    super(props);
    this.boxRef = React.createRef();
    this.updateLogs = this.updateLogs.bind(this);
    this.state = {
      logs: []
    }
    //Desired tilt = this props desiredTilt
  }
  componentDidMount () {
    // Start listening to live datastream
    subscribeToLogs(this.updateLogs)
  }
  updateLogs(newLog) {
    this.setState((prevState, props) => {
      return {logs: prevState.logs.concat(newLog) }
    })
  }
  componentDidUpdate() {
    this.boxRef.current.scrollTop = this.boxRef.current.scrollHeight;
  }

  render() {
    return (
      <div ref={this.boxRef} className="Box" style={{overflowY: "scroll"}}>
        {this.state.logs.map((log, index) => {
          return <div className="log" key={index}> {log} </div>
        })}
      </div>
    );
  }
}

export default Logger;
