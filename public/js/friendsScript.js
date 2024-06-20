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