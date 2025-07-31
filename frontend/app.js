let currentAlarm = { hour: 6, minute: 0 };

// Fetch the alarm from the backend on page load
window.onload = async () => {
  const response = await fetch('http://localhost:5000/alarm');
  currentAlarm = await response.json();
  document.getElementById('alarm-time').textContent = `${currentAlarm.hour}:${currentAlarm.minute}`;
};
let isEditing = false;

function toggleEdit() {
  isEditing = !isEditing;
  document.getElementById('edit-section').style.display = isEditing ? 'block' : 'none';
}

function change(direction, type) {
  if (!isEditing) return;

  if (type === 'hour') {
    if (direction === 'up') {
      currentAlarm.hour = (currentAlarm.hour + 1) % 24; // Wrap around 24 hours
    } else if (direction === 'down') {
      currentAlarm.hour = (currentAlarm.hour - 1 + 24) % 24;
    }
    document.getElementById('hour').textContent = currentAlarm.hour;
  }

  if (type === 'minute') {
    if (direction === 'up') {
      currentAlarm.minute = (currentAlarm.minute + 1) % 60;
    } else if (direction === 'down') {
      currentAlarm.minute = (currentAlarm.minute - 1 + 60) % 60;
    }
    document.getElementById('minute').textContent = currentAlarm.minute;
  }
}
async function setAlarm() {
  const response = await fetch('http://localhost:5000/alarm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(currentAlarm),
  });

  if (response.ok) {
    alert('Alarm set!');
  } else {
    alert('Failed to set alarm');
  }
}
function checkAlarm() {
  const now = new Date();
  const currentTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  const alarmTime = `${currentAlarm.hour}:${currentAlarm.minute}:0`;

  if (currentTime === alarmTime) {
    const audio = new Audio('alarm.mp3');
    audio.loop = true;
    audio.play();
    alert("Time's up! Alarm is ringing!");
  }
}

setInterval(checkAlarm, 1000);
