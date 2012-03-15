(function() {
  var ajax, ui, utilities;

  $(function() {
    $.ajax({
      url: '/posts',
      type: 'GET',
      dataType: 'json',
      success: ui.parse_messages
    });
    $('#sendbtn').click(function() {
      var text;
      text = $('#message').val();
      if (!utilities.is_null_or_whitespace(text)) return ajax.send_message(text);
    });
    setTimeout(setInterval(ajax.get_latest, 5000), 5000);
  });

  ajax = {
    get_latest: function() {
      $.ajax({
        url: '/posts?last_id=' + ui.latest_id(),
        type: 'GET',
        dataType: 'json',
        success: ui.parse_messages
      });
    },
    send_message: function(text) {
      $.ajax({
        url: '/posts',
        type: 'POST',
        data: {
          Message: text
        },
        dataType: 'json',
        success: function() {
          ajax.get_latest();
          $('#message').val('');
        }
      });
    }
  };

  ui = {
    latest_id: function() {
      return $($('#message_container').children().first()).data('id');
    },
    parse_messages: function(json) {
      var len;
      if (json && json instanceof Array) {
        json.forEach(function(d) {
          ui.create_message(d.ID, d.Message);
        });
      }
      len = $('#message_container').children().length;
      if (len > 8) $($('#message_container').children().slice(8, len)).remove();
    },
    create_message: function(id, message) {
      $('<div class="alert alert-info">').attr('data-id', id).text(message).prependTo('#message_container');
    }
  };

  utilities = {
    is_null_or_whitespace: function(str) {
      return !str || !/\S/.test(str);
    }
  };

}).call(this);
