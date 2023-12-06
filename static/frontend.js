//frontend.js
import PlaceCanvas from './place-canvas.js'
import { buildUrl } from './url-builder.js'

var socket

$(function () {
  let canvas = new PlaceCanvas(1000, 1000)

  // socket = new WebSocket("ws://cslinux.utm.utoronto.ca:8001");
  // socket = new WebSocket("ws://localhost:8001");
  socket = new WebSocket('ws://' + window.location.hostname + ':8081')
  socket.onopen = function () {
    $('#sendButton').removeAttr('disabled')
    console.log('connected')

    // retrieve entire board
    console.log('requesting board from server')
    fetch(buildUrl('/api/board-bitmap'))
      .then((res) => res.arrayBuffer())
      .then((res) => {
        const bitmap = new Uint8Array(res)
        canvas.parseBinary(bitmap)
        canvas.displayBufferedDraws()
      })
  }
  socket.onclose = function (event) {
    alert('closed code:' + event.code + ' reason:' + event.reason + ' wasClean:' + event.wasClean)
  }
  socket.onmessage = function (event) {
    var o = JSON.parse(event.data)

    canvas.setColor(o.x, o.y, o.color)
    canvas.displayBufferedDraws() // TODO: see below

    /* TODO: for pixel updates
       periodically call displayBufferedDraws if buffer is dirty
		canvas.drawPixelToDisplay(o.x, o.y, 'rgb('+o.r+','+o.g+','+o.b+')');
		*/
  }

  $('#setForm').on('submit', function (event) {
    socket.send(
      JSON.stringify({
        x: parseInt($('#x').val()),
        y: parseInt($('#y').val()),
        color: parseInt($('#color').val()),
      })
    )
    event.preventDefault()
  })
})
