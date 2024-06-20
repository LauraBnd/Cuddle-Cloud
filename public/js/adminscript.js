document.getElementById('get-images-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    console.log(`Fetching images for username: ${username}`);
    
    fetch('/admin/getUserImages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Received response:', data);
        document.getElementById('image-gallery').innerHTML = data.imageGallery;
    })
    .catch(error => {
        console.error('Error fetching images:', error);
    });
});

document.getElementById('delete-account-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username-delete').value;
    console.log(`Deleting account for username: ${username}`);
    
    fetch('/admin/deleteAccount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Account successfully deleted');
        }
    })
    .catch(error => {
        console.error('Error deleting account:', error);
    });
});

function deleteImage(imageId) {
    console.log(`Request to delete image with ID: ${imageId}`);
    
    fetch('/admin/deleteImage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('image-' + imageId).remove();
        }
    })
    .catch(error => {
        console.error('Error deleting image:', error);
    });
}