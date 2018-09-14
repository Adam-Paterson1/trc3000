import React, { Component } from 'react';
import {setupSocket, setTarget, subscribeToTarget, subscribeToGains, setGains, stop} from './Socket.js';
import ChartWrapper from './ChartWrapper.js';
import './App.css';
import Logger from './Logger.js';
import VideoPlayer from './Video.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.input = React.createRef();
    this.inputTargetTilt = React.createRef();
    this.inputTargetLRPM = React.createRef();
    this.inputTargetRRPM = React.createRef();
    this.inputKp = React.createRef();
    this.inputKi = React.createRef();
    this.inputKd = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitTargetTilt = this.handleSubmitTargetTilt.bind(this);
    this.handleSubmitTargetLRPM = this.handleSubmitTargetLRPM.bind(this);
    this.handleSubmitTargetRRPM = this.handleSubmitTargetRRPM.bind(this);
    this.handleStop = this.handleStop.bind(this);

    this.handleSubmitGains = this.handleSubmitGains.bind(this);
  }
  state = {
    target: {}
  };
  componentDidMount() {
    subscribeToTarget((target) => {
      if (target.Tilt) {
        this.inputTargetTilt.current.value = target.Tilt
        this.setState((prevState) => {
          return {target: {...prevState.target, Tilt: target.Tilt}}
        });
      } 
      if (target.leftRPM) {
        this.inputTargetLRPM.current.value = target.leftRPM
        this.setState((prevState) => {
          return {target: {...prevState.target, leftRPM: target.leftRPM}}
        });
      }
      if (target.rightRPM) {
        this.inputTargetRRPM.current.value = target.rightRPM
        this.setState((prevState) => {
          return {target: {...prevState.target, rightRPM: target.rightRPM}}
        });

      }
    })
    subscribeToGains((gains) => {
      this.setState({gains})
      this.inputKp.current.value = gains.kp
      this.inputKi.current.value = gains.ki
      this.inputKd.current.value = gains.kd
    })
    this.input.current.value = window.location.hostname
    //setupSocket(this.input.current.value);
  }
  handleSubmit(event) {
    setupSocket(this.input.current.value)
    event.preventDefault()
  }
  handleSubmitTargetTilt(event) {
    setTarget({Tilt: this.inputTargetTilt.current.value});
    event.preventDefault()
  }
  handleSubmitTargetLRPM(event) {
    setTarget({leftRPM: this.inputTargetLRPM.current.value});
    event.preventDefault()
  }
  handleSubmitTargetRRPM(event) {
    setTarget({rightRPM: this.inputTargetRRPM.current.value});
    event.preventDefault()
  }
  handleSubmitGains(event) {
    setGains({
      kp: this.inputKp.current.value,
      ki: this.inputKi.current.value,
      kd: this.inputKd.current.value})
    event.preventDefault();
  }
  handleStop() {
    stop();
  }
  render() {
    return (
      <div className="App">
        <div className="banner">
          <form className="formLike" onSubmit={this.handleSubmit}>
            <label>IP
              <br />
              <input type="text" ref={this.input} />
            </label>
          </form>
          <div className="formLike">
            <label style={{width: '100%'}}>Target</label>
              <br />
            <form onSubmit={this.handleSubmitTargetTilt}>
              <label>Tilt
                <input type="text" ref={this.inputTargetTilt} />
              </label>
            </form>
            <form onSubmit={this.handleSubmitTargetLRPM}>

            <label>LRPM
              <input type="text" ref={this.inputTargetLRPM} />
            </label>
            </form>
            <form onSubmit={this.handleSubmitTargetRRPM}>

            <label>RRPM
              <input type="text" ref={this.inputTargetRRPM} />
            </label>
            </form>

          </div>
          <form className="formLike" onSubmit={this.handleSubmitGains}>
            <label style={{width: '100%'}}>Gains</label>
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
          <button id="stop" onClick={this.handleStop}>STOP</button>
        </div>
        <div style={{display: 'flex'}}>
          <ChartWrapper target={this.state.target} />
        </div>
        <div style={{display: 'flex'}}>
          <VideoPlayer />
        </div>
        <div style={{display: 'flex'}}>
          <Logger />
        </div>
      </div>
    );
  }
}

export default App;
