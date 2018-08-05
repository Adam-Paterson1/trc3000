import React, { Component } from 'react';
import Chart from 'chart.js'
import { subscribeToTilt } from './Socket'

class ChartWrapper extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.tiltArr = [];
    this.desiredTiltArr = [];
    this.desiredTilt = 0;
    this.updateChart = this.updateChart.bind(this)
    //Desired tilt = this props desiredTilt
  }
  componentDidMount () {
    // Start listening to live datastream
    this.myChart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            label: 'Target',
            borderColor: "#000000",
            backgroundColor: "#000000",
          },
          {
            label: 'Actual',
            data: [],
            borderColor: "#8e5ea2",
            backgroundColor: "#8e5ea2",
          }
        ]
        
      },
      options: {
        showLines: false,
        scales: {
          xAxes: [{
            display: false,
          }]
        },
        animation: {
          duration: 0,
        },
        hover: {
          animationDuration: 0
        },
        responsiveAnimationDuration: 0
      }
    })
    subscribeToTilt(this.updateChart)
  }
  updateChart(currTilt) {
    this.myChart.data.labels.push(new Date());
    this.myChart.data.datasets[0].data.push({x: new Date(), y: this.props.target})
    this.myChart.data.datasets[1].data.push({x: new Date(), y: currTilt})
    if (this.myChart.data.datasets[0].data.length > 80) {
      this.myChart.data.labels.shift()
      this.myChart.data.datasets[0].data.shift()
      this.myChart.data.datasets[1].data.shift()
    }
    this.myChart.update()
  }

  render() {
    return (
      <div className="Box">
        <canvas id="myChart" ref={this.myRef}> </canvas>
      </div>
    );
  }
}

export default ChartWrapper;
