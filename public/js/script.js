function myFunction() {
    var passwordInput = document.getElementById('password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
}
function Open() {
  var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
}

function openPopup() {
  document.getElementById("searchPopup").style.display = "block";

}
function closePopup() {
  document.getElementById("searchPopup").style.display = "none";
  document.getElementById("myuser").value = '';
  document.getElementById("password").value = '';
  document.getElementById("profile_photo").value = '';
  document.getElementById("name").value = '';
  document.getElementById("birthday").value = '';
  document.getElementById("age").value = '';
  document.getElementById("description").value = '';

  document.getElementById("result").innerHTML = '';
}

function openPopup2() {
  document.getElementById("searchPopup2").style.display = "block";
  document.getElementById("friendRequests").style.display = "none";

}

function closePopup2() {
  document.getElementById("searchPopup2").style.display = "none";
  document.getElementById("searchInput").value = '';
  document.getElementById("result").innerHTML = '';
  document.getElementById("searchPopup2").style.display = "none";
}


function openFriendRequests() {
  document.getElementById("friendRequests").style.display = "block";
  document.getElementById("searchPopup2").style.display = "none";

}

function closeFriendRequests() {
    document.getElementById("friendRequests").style.display = "none";

}


  function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }
  
  document.getElementById("defaultOpen").click();

  document.getElementById('scheduleForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const date = document.getElementById('date').value;
    const day = document.getElementById('day').value;
    const hour = document.getElementById('hour').value;
    const endTime = document.getElementById('endTime').value;
    const program = document.getElementById('program').value;
    const details = document.getElementById('details').value;
    
    fetch('/saveSchedule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date, day, hour, endTime, program, details })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadSchedule();
        } else {
            alert('Failed to save schedule: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(error => {
        alert('Failed to save schedule: ' + error.message);
    });
});

function loadSchedule() {
  fetch('/getSchedule')
      .then(response => response.json())
      .then(data => {
          const scheduleDisplay = document.getElementById('scheduleDisplay');
          scheduleDisplay.innerHTML = '';

          data.schedule.forEach(item => {
              const scheduleItem = document.createElement('div');
              scheduleItem.className = 'schedule-item';

              const formattedDate = new Date(item.date).toISOString().split('T')[0];

              const dateDayInfo = document.createElement('div');
              dateDayInfo.className = 'date-day-info';
              dateDayInfo.innerHTML = `
                  <strong>Date:</strong> ${formattedDate}<br>
                  <strong>Day:</strong> ${item.day}`;

              const hourProgram = document.createElement('div');
              hourProgram.className = 'hour-program';
              hourProgram.innerHTML = `
                  <strong>Starting Time:</strong> ${item.hour}<br>
                  <strong>End Time:</strong> ${item.end_time}<br>
                  <strong>Program:</strong> ${item.program}<br>
                  <strong>Details:</strong> ${item.details}`;

              const deleteButton = document.createElement('button');
              deleteButton.className = 'delete-button';
              deleteButton.textContent = 'Delete';
              deleteButton.onclick = function() {
                  deleteSchedule(item.id);
              };

              scheduleItem.appendChild(dateDayInfo);
              scheduleItem.appendChild(hourProgram);
              scheduleItem.appendChild(deleteButton);
              scheduleDisplay.appendChild(scheduleItem);
          });
      });
}

function deleteSchedule(id) {
    fetch(`/deleteSchedule/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadSchedule();
        } else {
            alert('Failed to delete schedule: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(error => {
        alert('Failed to delete schedule: ' + error.message);
    });
}

document.addEventListener('DOMContentLoaded', loadSchedule);

function deleteImage(imageId) {
    if (confirm("Are you sure you want to delete this image?")) {
        fetch('/delete-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageId: imageId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const imageElement = document.getElementById(`image-${imageId}`);
                if (imageElement) {
                    imageElement.remove();
                }
            } else {
                alert("Error deleting image");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error deleting image");
        });
    }
}

document.getElementById('medicalForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const data = {
        start: document.getElementById('start').value,
        end: document.getElementById('end').value,
        symptoms: document.getElementById('symptoms').value,
        treatment: document.getElementById('Treatment').value,
        details: document.getElementById('detail').value
    };

    fetch('/saveMedicalInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Medical information saved successfully!');
            fetchMedicalRecords();
        } else {
            alert('Failed to save medical information: ' + data.error);
        }
    })
    .catch(error => console.error('Error:', error));
});

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function fetchMedicalRecords() {
    fetch('/getMedicalInfo')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const medicalDisplay = document.getElementById('medicalDisplay');
            medicalDisplay.innerHTML = '';
            data.medical.forEach(record => {
                const recordDiv = document.createElement('div');
                recordDiv.className = 'info1';
                recordDiv.innerHTML = `
                    <ul style="list-style-type: none;">
                        <li><strong>Symptoms: </strong> ${record.symptoms}</li>
                        <li><strong>Starting Date: </strong> ${formatDate(record.start_date)}</li>
                        <li><strong>Ending Date: </strong> ${formatDate(record.end_date)}</li>
                        <li><strong>Treatment: </strong> ${record.treatment}</li>
                        <li><strong>Details: </strong> ${record.details}</li>
                        <li><button onclick="deleteMedicalRecord(${record.id})">Delete</button></li>
                    </ul>
                `;
                medicalDisplay.appendChild(recordDiv);
            });
        } else {
            alert('Failed to fetch medical records: ' + data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}

function deleteMedicalRecord(id) {
    fetch(`/deleteMedicalInfo/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Medical record deleted successfully!');
            fetchMedicalRecords();
        } else {
            alert('Failed to delete medical record: ' + data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}

// Fetch medical records on page load
document.addEventListener('DOMContentLoaded', fetchMedicalRecords);

function openFamilyInfoPopup() {
  document.getElementById('familyInfoPopup').style.display = 'block';
}

function closeFamilyInfoPopup() {
  document.getElementById('familyInfoPopup').style.display = 'none';
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

document.getElementById('familyInfoForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = {
    full_name: formData.get('full_name'),
    birthday: formData.get('birthday'),
    parents_name: formData.get('parents_name'),
    blood_type: formData.get('blood_type')
  };

  fetch('/saveFamilyInfo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      alert('Family info saved successfully!');
      closeFamilyInfoPopup();
      displayFamilyInfo();
    } else {
      alert('Error saving family info: ' + result.error);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error saving family info.');
  });
});

function displayFamilyInfo() {
  fetch('/getFamilyInfo')
    .then(response => response.json())
    .then(result => {
      const familyInfoDisplay = document.getElementById('familyInfoDisplay');
      familyInfoDisplay.innerHTML = ''; // Clear previous info
      if (result.success && result.info) {
        const info = result.info;
        familyInfoDisplay.innerHTML = `
          <p><strong>Full Name:</strong> ${info.full_name}</p>
          <p><strong>Birthday:</strong> ${formatDate(info.birthday)}</p>
          <p><strong>Parent's Name:</strong> ${info.parents_name}</p>
          <p><strong>Blood Type:</strong> ${info.blood_type}</p>
        `;
        document.getElementById('full_name').value = info.full_name;
        document.getElementById('birthday').value = info.birthday;
        document.getElementById('parents_name').value = info.parents_name;
        document.getElementById('blood_type').value = info.blood_type;
      } else {
        familyInfoDisplay.innerHTML = '<p>No family info available.</p>';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('familyInfoDisplay').innerHTML = '<p>Error retrieving family info.</p>';
    });
}

// Fetch and display family info on page load
displayFamilyInfo();

function fetchMedicalImages() {
  fetch('/getMedicalImages')
      .then(response => response.json())
      .then(images => {
          const gallery = document.getElementById('medicalImageGallery');
          gallery.innerHTML = '';
          images.forEach(image => {
              const imageDiv = document.createElement('div');
              imageDiv.classList.add('posted-image');
              imageDiv.innerHTML = `
                  <img src="/images/medical/${image.filename}" alt="${image.title}">
                  <div class="posted-image-description">
                      <div class="upload-info">
                          <h3>${image.title}</h3>
                          <p>${image.description}</p>
                      </div>
                      <p class="upload-date"><span>Uploaded at: </span>${image.upload_date}</p>
                      <button class="delete-button" onclick="deleteMedicalImage(${image.id})">Delete</button>
                  </div>
              `;
              gallery.appendChild(imageDiv);
          });
      });
}

function deleteMedicalImage(imageId) {
  fetch('/deleteMedicalImage', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ imageId })
  })
  .then(response => response.json())
  .then(result => {
      if (result.success) {
          alert('Image deleted successfully');
          fetchMedicalImages();
      } else {
          alert('Error deleting image: ' + result.error);
      }
  })
  .catch(error => {
      console.error('Error:', error);
      alert('Error deleting image.');
  });
}

document.getElementById('medicalPhotoForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  fetch('/uploadMedicalPhoto', {
      method: 'POST',
      body: formData
  })
  .then(response => response.json())
  .then(result => {
      if (result.success) {
          alert('Photo uploaded successfully');
          event.target.reset();
          fetchMedicalImages();
      } else {
          alert('Error uploading photo: ' + result.error);
      }
  })
  .catch(error => {
      console.error('Error:', error);
      alert('Error uploading photo.');
  });
});

// Fetch medical images on page load
fetchMedicalImages();