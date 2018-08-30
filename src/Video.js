import React, { Component } from 'react';
import videojs from 'video.js'
import 'video.js/dist/video-js.css';
import {subscribeToVid, subscribeToImage} from './Socket.js';

let framesList = [];
export default class VideoPlayer extends Component {
  constructor() {
    super()
    this.pktnum = 0;
}
  componentDidMount() {
    // instantiate Video.js
    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
      console.log('onPlayerReady', this)
    });
    subscribeToVid((data) => {
      this.pktnum++;
      var frame = new Uint8Array(data);
      //log("[Pkt " + this.pktnum + " (" + data.byteLength + " bytes)]");
      //this.decode(frame);
      framesList.push(frame);
    })
    subscribeToImage((data) => {
      console.log('data', data);
    })
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose()
    }
  }

  // wrap the player in a div with a `data-vjs-player` attribute
  // so videojs won't create additional wrapper in the DOM
  // see https://github.com/videojs/video.js/pull/3856
  render() {
    return (
      <div>    
        <div data-vjs-player>
          <video ref={ node => this.videoNode = node } className="video-js"></video>
        </div>
      </div>
    )
  }
}