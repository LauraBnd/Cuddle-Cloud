$(document).ready(function() {
    $('#searchInput').on('input', function() {
        var query = $(this).val();
        if (query !== '') {
            $.ajax({
                url: '/search?query=' + query,
                method: 'GET',
                success: function(data) {
                    $('#result').html(data);
                    attachSendFriendRequestEvents();
                }
            });
        } else {
            $('#result').html('');
        }
    });

    $('#showFriendRequestsButton').on('click', function() {
        $('#friendRequests').show();
        loadFriendRequests();
    });
});

function loadFriendRequests() {
    $.ajax({
        url: '/friendRequests',
        method: 'GET',
        success: function(data) {
            $('#friendRequests').html(data);
            attachAcceptFriendRequestEvents();
            attachDeclineFriendRequestEvents();
        }
    });
}




function attachSendFriendRequestEvents() {
    document.querySelectorAll('button.send-friend-request').forEach(button => {
        button.removeEventListener('click', handleSendFriendRequest); // Remove existing listener
        button.addEventListener('click', handleSendFriendRequest); // Add new listener
    });
}

function attachAcceptFriendRequestEvents() {
    document.querySelectorAll('button.accept-friend-request').forEach(button => {
        button.removeEventListener('click', handleAcceptFriendRequest); // Remove existing listener
        button.addEventListener('click', handleAcceptFriendRequest); // Add new listener
    });
}

function attachDeclineFriendRequestEvents() {
    document.querySelectorAll('button.decline-friend-request').forEach(button => {
        button.removeEventListener('click', handleDeclineFriendRequest); // Remove existing listener
        button.addEventListener('click', handleDeclineFriendRequest); // Add new listener
    });
}


function handleSendFriendRequest(event) {
    event.preventDefault(); // Prevent default behavior
    const friendId = this.getAttribute('data-friend-id');
    sendFriendRequest(friendId);
}

function handleAcceptFriendRequest(event) {
    event.preventDefault(); // Prevent default behavior
    const friendId = this.getAttribute('data-friend-id');
    acceptRequest(friendId);
}

function handleDeclineFriendRequest(event) {
    event.preventDefault(); // Prevent default behavior
    const friendId = this.getAttribute('data-friend-id');
    declineRequest(friendId);
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
    // return false; // Prevent default behavior

}



function acceptRequest(friendId) {
    console.log('Accepting friend request from ID:', friendId);
    
    $.ajax({
        url: '/acceptRequest',
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: { friendId: friendId },
        success: function(response) {
            alert('Friend request accepted successfully!');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Failed to accept friend request:', textStatus, errorThrown);
            alert('Failed to accept friend request.');
        }
    });
    // return false; // Prevent default behavior

}

function declineRequest(friendId) {
    console.log('Declining friend request from ID:', friendId);
    
    $.ajax({
        url: '/declineRequest',
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: { friendId: friendId },
        success: function(response) {
            alert('Friend request declined!');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Failed to decline friend request:', textStatus, errorThrown);
            alert('Failed to decline friend request.');
        }
    });
    // return false; // Prevent default behavior

}
