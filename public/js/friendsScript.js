  $(document).ready(function() {
      $('#searchInput').on('input', function() {
          var query = $(this).val();
          if (query !== '') {
              $.ajax({
                  url: '/search?query=' + query,
                  method: 'GET',
                  success: function(data) {
                      $('#result').html(data);
                  }
              });
          } else {
              $('#result').html('');
          }
      });
  });


  function attachSendFriendRequestEvents() {
    document.querySelectorAll('button[onclick^="sendFriendRequest"]').forEach(button => {
        button.onclick = function() {
            sendFriendRequest(button.getAttribute('onclick').match(/\d+/)[0]);
        };
    });
}

function sendFriendRequest(friendId) {
    console.log('Sending friend request to ID:', friendId);
    
    $.ajax({
        url: '/sendFriendRequest',
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: { friendId: friendId },
        success: function(response) {
            alert('Friend request sent successfully!');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Failed to send friend request:', textStatus, errorThrown);
            alert('Failed to send friend request.');
        }
    });
}