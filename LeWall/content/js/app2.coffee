$ ->
	$.ajax
		url: '/posts'
		type: 'GET'
		dataType: 'json'
		success: ui.parse_messages

	$('#sendbtn').click ->
		text = $('#message').val()
		if !utilities.is_null_or_whitespace(text)
			ajax.send_message(text)

	setTimeout (setInterval ajax.get_latest, 5000), 5000
	return

ajax = 
	get_latest: ->
		$.ajax 
			url: '/posts?last_id=' + ui.latest_id()
			type: 'GET'
			dataType: 'json'
			success: ui.parse_messages
		return
	send_message: (text) ->
		$.ajax 
			url: '/posts'
			type: 'POST'
			data: { Message: text }
			dataType: 'json'
			success: ->
				ajax.get_latest()
				$('#message').val ''
				return
		return

ui = 
	latest_id: ->
		$($('#message_container').children().first()).data('id')
	parse_messages: (json) ->
		if json and json instanceof Array
			json.forEach( (d) -> 
				ui.create_message(d.ID, d.Message)
				return)
		len = $('#message_container').children().length
		if len > 8
			$($('#message_container').children().slice(8, len)).remove()
		return
	create_message: (id, message) ->
		$('<div class="alert alert-info">').attr('data-id', id).text(message).prependTo('#message_container');
		return

utilities = 
	is_null_or_whitespace: (str) ->
		!str || !/\S/.test(str)