import React, { Component } from 'react';
import {subscribeToImage} from './Socket.js';

export default class VideoPlayer extends Component {
  constructor() {
    super()
    this.imageCanvas = React.createRef();
    this.imageCanvas2 = React.createRef();
  }
  componentDidMount() {
    this.ctx = this.imageCanvas.current.getContext('2d', { alpha: false })
    this.ctx2 = this.imageCanvas2.current.getContext('2d', { alpha: false })
    let img1 = new Image();
    let img2 = new Image();
    subscribeToImage((data) => {
      img1.src = 'data:image/jpeg;base64,' + data[0];
      img2.src = 'data:image/jpeg;base64,' + data[1];
      // let elem = document.getElementById('myImg')
      // elem.insertAdjacentElement('afterend', img)
      this.ctx.drawImage(img1, 0, 0);
      this.ctx2.drawImage(img2, 0,0);
    })
  }

  render() {
    return (
      <div>
         <canvas id="myImg" className='canvasBox' ref={this.imageCanvas} width={'300px'} height={'300px'}> </canvas>
         <canvas id="myImg2" className='canvasBox' ref={this.imageCanvas2} width={'300px'} height={'300px'}> </canvas>
      </div>
    )
  }
}