//frontend.js
import PlaceCanvas from './place-canvas.js'
import { buildUrl } from './url-builder.js'

var socket

$(function () {
  let canvas = new PlaceCanvas(1000, 1000)
  socket = new WebSocket(`ws://${window.location.hostname}:8081`)
  socket.onopen = function () {
    $('#sendButton').removeAttr('disabled')

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
    canvas.displayBufferedDraws()

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
