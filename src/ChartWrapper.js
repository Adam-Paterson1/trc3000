import React, { Component } from 'react';
import Chart from './Chart.js'
import { subscribeToTilt } from './Socket'

class ChartWrapper extends Component {
  constructor(props) {
    super(props);
    this.listeners = [];
    this.updateCharts = this.updateCharts.bind(this)
    this.registerInterest = this.registerInterest.bind(this)
    this.deregisterInterest = this.deregisterInterest.bind(this)
  }
  componentDidMount () {
    // Start listening to live datastream
    subscribeToTilt(this.updateCharts)
  }
  registerInterest(cb, fields) {
    this.listeners.push({cb:cb, fields: fields})
  }
  deregisterInterest(fields) {
    let popIndex = this.listeners.findIndex((listener) => {return listener.fields = fields})
    this.listeners.splice(popIndex, 1);
  }
  updateCharts(newData) {
    let newState = {
      Target: {x: new Date(), y: this.props.target.Tilt},
      leftRPMTarget: {x: new Date(), y: this.props.target.leftRPM},
      rightRPMTarget: {x: new Date(), y: this.props.target.rightRPM}
    }
    let newList = Object.keys(newData);
    newList.forEach((key, index) => {
      newState[key] = {x: new Date(), y:newData[key]}
    })
    this.listeners.forEach((el) => {
      let result = {};
      el.fields.forEach((field) => {
        if (newState[field]) {
          result[field] = newState[field]

        } else {
          result[field] = {x: new Date(), y:0}
        }
      })
      el.cb(result)
    })
  }

  render() {
    return (
      <div className="Box">
        <Chart 
          labels={['Target', 'Tilt']}
          registerInterest={this.registerInterest}
          deregisterInterest={this.deregisterInterest}
          limits={[-30, 30]}>
        </Chart>
        <Chart 
          labels={['leftErr', 'rightErr']}
          registerInterest={this.registerInterest}
          deregisterInterest={this.deregisterInterest}>
        </Chart>
        {/* <Chart 
          labels={['leftRPM', 'rightRPM']}
          registerInterest={this.registerInterest}
          deregisterInterest={this.deregisterInterest}>
        </Chart> */}
        {/* <Chart 
          labels={['leftRPMTarget', 'rightRPMTarget']}
          registerInterest={this.registerInterest}
          deregisterInterest={this.deregisterInterest}>
        </Chart> */}
        <Chart 
          labels={['leftPWM', 'rightPWM']}
          registerInterest={this.registerInterest}
          deregisterInterest={this.deregisterInterest}
          limits={[-240, 240]}>
        </Chart>
      </div>
    );
  }
}

export default ChartWrapper;
