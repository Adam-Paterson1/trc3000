import React, { Component } from 'react';
import Chart from 'chart.js'

const colours = ["#000000", "#00ff00", "#ff0000", "#0000ff"]
class ChartWrapper extends Component {
  constructor(props) {
    super(props);
    this.updateChart = this.updateChart.bind(this)
    this.id = this.props.labels.join('');
  }
  componentDidMount () {
    // Start listening to live datastream
    let datasets = this.props.labels.map((label, index) => {
      return {
        label: label,
        data: [],
        borderColor: colours[index],
        backgroundColor: colours[index],
      }
    })
    let yaxes = [{}];
    if (this.props.limits) {
      yaxes = [{
        ticks: {
          max: this.props.limits[1],
          min: this.props.limits[0]
        }
      }]
    }
    this.myChart = new Chart(this.id, {
      type: 'line',
      data: {
        labels: [],
        datasets: datasets
      },
      options: {
        responsive:true,
        maintainAspectRatio: false,
        showLines: false,
        scales: {
          xAxes: [{
            display: false,
          }],
          yAxes: yaxes
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
    this.props.registerInterest(this.updateChart, this.props.labels)
  }
  componentWillUnmount() {
    this.props.deregisterInterest(this.props.labels);
  }

  updateChart(newData) {
    this.myChart.data.labels.push(new Date());
    let newList = Object.keys(newData);
    newList.forEach((key, index) => {
      this.myChart.data.datasets[index].data.push(newData[key])
    })
    if (this.myChart.data.datasets[0].data.length > 40) {
      this.myChart.data.labels.shift()
      this.myChart.data.datasets.forEach((set) => {set.data.shift()})
    }
    this.myChart.update()
  }

  render() {
    return (
      <div className="BoxInner">
        <canvas id={this.id}> </canvas>
      </div>
    );
  }
}

export default ChartWrapper;
