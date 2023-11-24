import {foo} from "./thing.js"
import PlaceCanvas from "./place-canvas.js"

foo()

var socket

$(function () {
	// socket = new WebSocket("ws://cslinux.utm.utoronto.ca:8001");
	// socket = new WebSocket("ws://localhost:8001");
	socket = new WebSocket('ws://' + window.location.hostname + ':8081')
	socket.onopen = function (event) {
		$('#sendButton').removeAttr('disabled')
		console.log('connected')
	}
	socket.onclose = function (event) {
		alert(
			'closed code:' + event.code + ' reason:' + event.reason + ' wasClean:' + event.wasClean
		)
	}
	socket.onmessage = function (event) {
		var o = JSON.parse(event.data)

		var context = document.getElementById('canvas').getContext('2d')
		context.fillStyle = 'rgb(' + o.r + ',' + o.g + ',' + o.b + ')'
		context.fillRect(o.x, o.y, 1, 1)
	}

	// Comment out the event handler below when in production
	// $('#canvas').mousemove(function (event) {
	// 	var x = event.pageX - this.offsetLeft
	// 	var y = event.pageY - this.offsetTop
	// 	var o = { x: x, y: y, r: 0, g: 0, b: 0 }
	// 	socket.send(JSON.stringify(o))
	// })
	$('#setForm').submit(function (event) {
		var o = {
			x: $('#x').val(),
			y: $('#y').val(),
			r: $('#r').val(),
			g: $('#g').val(),
			b: $('#b').val(),
		}

		for (var key in o) {
			o[key] = parseInt(o[key])
		}
		socket.send(JSON.stringify(o))
		event.preventDefault()
	})
})