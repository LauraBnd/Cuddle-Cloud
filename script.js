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
  window.onload = function() {
    toggleTabMenu('Day');
  };
  function toggleTabMenu(timePeriod) {
    var table = document.getElementById("calendar");
    var rows = table.getElementsByTagName("tr");
  
    for (var i = 0; i < rows.length; i++) {
      rows[i].style.display = "";
    }
  
    if (timePeriod === "Night") {
      for (var i = 11; i <= 24; i++) {
        rows[i].style.display = "none";
      }
    } else if (timePeriod === "Day") {
      for (var i = 1; i <= 10; i++) {
        rows[i].style.display = "none";
      }
    }
  }
  
  
  
  document.addEventListener("DOMContentLoaded", function() {
    var table = document.getElementById("calendar");
    var hours = 24; 
  
    for (var i = 0; i < hours; i++) {
      var row = table.insertRow();
      var timeCell = row.insertCell(0);
      timeCell.textContent = i.toString().padStart(2, "0") + ":00";
  
      for (var j = 1; j <= 7; j++) {
        var cell = row.insertCell(j);
        var input = document.createElement("input");
        input.type = "text";
        input.className = "event-input";
        cell.appendChild(input);
      }
    }
  });
  
  
