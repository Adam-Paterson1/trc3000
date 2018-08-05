import React, { Component } from 'react';
import {setupSocket, subscribeToTimer, setTarget, subscribeToTarget, subscribeToGains, setGains} from './Socket.js';
import ChartWrapper from './Chart.js';
import './App.css';
import Logger from './Logger.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.inputTarget = React.createRef();
    this.inputKp = React.createRef();
    this.inputKi = React.createRef();
    this.inputKd = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitTarget = this.handleSubmitTarget.bind(this);
    this.handleSubmitGains = this.handleSubmitGains.bind(this);
  }
  state = {
    timestamp: 'no timestamp yet'
  };
  componentDidMount() {
    subscribeToTimer((err, timestamp) => this.setState({ 
      timestamp 
    }));
    subscribeToTarget((target) => {
      this.inputTarget.current.value = target
      this.setState({target})
    })
    subscribeToGains((gains) => {
      this.setState({gains})
      this.inputKp.current.value = gains.kp
      this.inputKi.current.value = gains.ki
      this.inputKd.current.value = gains.kd
    })
  }
  handleSubmit(event) {
    setupSocket(this.input.current.value)
    event.preventDefault()
  }
  handleSubmitTarget(event) {
    setTarget(this.inputTarget.current.value);
    event.preventDefault()
  }
  handleSubmitGains(event) {
    setGains({
      kp: this.inputKp.current.value,
      ki: this.inputKi.current.value,
      kd: this.inputKd.current.value})
    event.preventDefault();
  }
  render() {
    return (
      <div className="App">
        <div className="banner">
          <form onSubmit={this.handleSubmit}>
            <label>IP
              <br />
              <input type="text" ref={this.input} />
            </label>
          </form>
          <form onSubmit={this.handleSubmitTarget}>
            <label>Target
              <br />
              <input type="text" ref={this.inputTarget} />
            </label>
          </form>
          <form onSubmit={this.handleSubmitGains}>
            <label>Gains</label>
            <br />
            <label>P
              <input type="text" ref={this.inputKp} />
            </label>
            <label>I
              <input type="text" ref={this.inputKi} />
            </label>
            <label>D
              <input type="text" ref={this.inputKd} />
            </label>
            <input type="submit" style={{display: "none"}} />
          </form>
        </div>
        <div style={{display: 'flex'}}>
          <ChartWrapper target={this.state.target} />
          <Logger />
        </div>
      </div>
    );
  }
}

export default App;
