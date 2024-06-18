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
}

function openPopup2() {
  document.getElementById("searchPopup2").style.display = "block";
}

function closePopup2() {
  document.getElementById("searchPopup2").style.display = "none";
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
                  <strong>Hour:</strong> ${item.hour}<br>
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
