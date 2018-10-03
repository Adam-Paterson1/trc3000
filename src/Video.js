import React, { Component } from 'react';
import {subscribeToImage, subscribeToThreshold, setHSV} from './Socket.js';

export default class VideoPlayer extends Component {
  constructor() {
    super()
    this.imageCanvas = React.createRef();
    this.imageCanvas2 = React.createRef();
    this.imageCanvas3 = React.createRef();
    this.imageCanvas4 = React.createRef();
    this.inputH1 = React.createRef();
    this.inputS1 = React.createRef();
    this.inputV1 = React.createRef();
    this.inputH2 = React.createRef();
    this.inputS2 = React.createRef();
    this.inputV2 = React.createRef();
    this.handleSubmitHsvLower = this.handleSubmitHsvLower.bind(this);
    this.handleSubmitHsvUpper = this.handleSubmitHsvUpper.bind(this);
  }
  componentDidMount() {
    this.ctx = this.imageCanvas.current.getContext('2d', { alpha: false })
    this.ctx2 = this.imageCanvas2.current.getContext('2d', { alpha: false })
    this.ctx3 = this.imageCanvas3.current.getContext('2d', {alpha :false})
    this.ctx4 = this.imageCanvas4.current.getContext('2d', {alpha :false})

    let img1 = new Image();
    img1.onload = () => {
      this.ctx.drawImage(img1, 0, 0);
    }
    let img2 = new Image();
    img2.onload = () => {
      this.ctx2.drawImage(img2, 0,0);
    }
    let img3 = new Image();
    img3.onload = () => {
      this.ctx3.drawImage(img3, 0, 0);
    }
    let img4 = new Image();
    img4.onload = () => {
      this.ctx4.drawImage(img4, 0,0);
    }

    subscribeToImage((data) => {
      img1.src = 'data:image/jpeg;base64,' + data[0];
      if (data[1]) {
        img2.src = 'data:image/jpeg;base64,' + data[1];
      }
    })
    subscribeToThreshold((data) => {
      if (data.lower) {
        this.inputH1.current.value = data.lower[0]
        this.inputS1.current.value = data.lower[1]
        this.inputV1.current.value = data.lower[2]
      }
      if (data.upper) {
        this.inputH2.current.value = data.upper[0]
        this.inputS2.current.value = data.upper[1]
        this.inputV2.current.value = data.upper[2]
      }
      img3.src = 'data:image/jpeg;base64,' + data[0];
      img4.src = 'data:image/jpeg;base64,' + data[1];
    })
  }

  handleSubmitHsvLower(event) {
    setHSV({lower: [this.inputH1.current.value, this.inputS1.current.value, this.inputV1.current.value]})
    event.preventDefault();
  }
  handleSubmitHsvUpper(event) {
    setHSV({upper: [this.inputH2.current.value, this.inputS2.current.value, this.inputV2.current.value]})
    event.preventDefault();
  }

  render() {
    return (
      <div  style={{display: 'flex'}}>
        <div style={{display: 'flex', flexGrow: '1'}}>
          <canvas id="myImg" className='canvasBox' ref={this.imageCanvas} width={'750px'} height={'50px'}> </canvas>
          <canvas id="myImg2" className='canvasBox' ref={this.imageCanvas2} width={'750px'} height={'50px'}> </canvas>
          <div>
            <canvas id="myImg3" className='canvasBox' ref={this.imageCanvas3} width={'100px'} height={'100px'}> </canvas>
            <canvas id="myImg4" className='canvasBox' ref={this.imageCanvas4} width={'100px'} height={'100px'}> </canvas>
          </div>
        </div>
        <div>
          <form className="formLike" onSubmit={this.handleSubmitHsvLower}>
              <label style={{width: '100%'}}>Colours Lower</label>
              <br />
              <label>H
                <input type="text" ref={this.inputH1} />
              </label>
              <label>S
                <input type="text" ref={this.inputS1} />
              </label>
              <label>V
                <input type="text" ref={this.inputV1} />
              </label>
              <input type="submit" style={{display: "none"}} />
            </form>
            <form className="formLike" onSubmit={this.handleSubmitHsvUpper}>
              <label style={{width: '100%'}}>Colours Upper</label>
              <br />
              <label>H
                <input type="text" ref={this.inputH2} />
              </label>
              <label>S
                <input type="text" ref={this.inputS2} />
              </label>
              <label>V
                <input type="text" ref={this.inputV2} />
              </label>
              <input type="submit" style={{display: "none"}} />
            </form>
          </div>
      </div>
    )
  }
}