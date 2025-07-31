let currentAlarm = { hour: 6, minute: 0 };
let isEditing = false;
let alarmAudio = null;
let beepInterval = null;

// Initialize the app when the page loads
window.onload = async () => {
  // Load alarm from localStorage first
  loadAlarmFromStorage();
  
  // Try to load alarm from backend, fallback to default if backend is not available
  try {
    const response = await fetch('http://localhost:5000/alarm');
    if (response.ok) {
      currentAlarm = await response.json();
    }
  } catch (error) {
    console.log('Backend not available, using default alarm time');
  }
  
  // Initialize display
  updateClock();
  updateAlarmDisplay();
  
  // Start clock updates
  setInterval(updateClock, 1000);
  setInterval(checkAlarm, 1000);
  
  // Show clock tab by default
  showTab('clock');
};

// Tab switching functionality
function showTab(tabName) {
  // Hide all tabs
  document.getElementById('clock-tab').style.display = 'none';
  document.getElementById('alarm-tab').style.display = 'none';
  
  // Remove active class from all tab buttons
  document.querySelectorAll('#tabs button').forEach(btn => btn.classList.remove('active'));
  
  // Show selected tab and add active class
  if (tabName === 'clock') {
    document.getElementById('clock-tab').style.display = 'block';
    document.querySelector('button[onclick="showTab(\'clock\')"]').classList.add('active');
  } else if (tabName === 'alarm') {
    document.getElementById('alarm-tab').style.display = 'block';
    document.querySelector('button[onclick="showTab(\'alarm\')"]').classList.add('active');
  }
}

// Update the clock display
function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  
  // Format without leading zeros for hours, but with leading zeros for minutes and seconds
  const timeString = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  document.getElementById('clock').textContent = timeString;
}

// Update alarm display
function updateAlarmDisplay() {
  document.getElementById('alarm-time').textContent = `${currentAlarm.hour}:${currentAlarm.minute.toString().padStart(2, '0')}`;
  document.getElementById('hour').textContent = currentAlarm.hour;
  document.getElementById('minute').textContent = currentAlarm.minute.toString().padStart(2, '0');
}

// Toggle edit mode for alarm
function toggleEdit() {
  isEditing = !isEditing;
  const editSection = document.getElementById('edit-section');
  editSection.style.display = isEditing ? 'block' : 'none';
  
  // Update button text
  const editButton = document.querySelector('button[onclick="toggleEdit()"]');
  editButton.textContent = isEditing ? 'Cancel' : 'Edit';
}

// Change alarm time values
function change(direction, type) {
  if (!isEditing) return;

  if (type === 'hour') {
    if (direction === 'up') {
      currentAlarm.hour = (currentAlarm.hour + 1) % 24;
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
    document.getElementById('minute').textContent = currentAlarm.minute.toString().padStart(2, '0');
  }
}

// Set the alarm
async function setAlarm() {
  // Try to save to backend if available
  try {
    const response = await fetch('http://localhost:5000/alarm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentAlarm),
    });

    if (response.ok) {
      alert('Alarm set successfully!');
    } else {
      alert('Failed to save alarm to backend, but alarm is set locally');
    }
  } catch (error) {
    alert('Backend not available, alarm set locally');
  }
  
  // Save to localStorage as backup
  localStorage.setItem('alarm', JSON.stringify(currentAlarm));
  
  // Exit edit mode
  toggleEdit();
  updateAlarmDisplay();
}

// Check if alarm should go off
function checkAlarm() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  
  // Check if current time matches alarm time (ignoring seconds)
  if (currentHour === currentAlarm.hour && currentMinute === currentAlarm.minute && currentSecond === 0) {
    triggerAlarm();
  }
}

// Trigger the alarm
function triggerAlarm() {
  // Create alarm popup
  const popup = document.createElement('div');
  popup.id = 'alarm-popup';
  popup.innerHTML = `
    <div class="alarm-popup-content">
      <h2>⏰ ALARM! ⏰</h2>
      <p>Time's up! Your alarm is ringing!</p>
      <button onclick="dismissAlarm()">Dismiss</button>
    </div>
  `;
  document.body.appendChild(popup);
  
  // Play alarm sound
  try {
    alarmAudio = new Audio('Popular Alarm Clock Sound Effect.mp3');
    alarmAudio.loop = true;
    alarmAudio.play().catch(error => {
      console.log('Could not play alarm sound:', error);
      // Fallback: use browser's built-in beep
      playBeepSound();
    });
  } catch (error) {
    console.log('Audio not available, using beep sound');
    playBeepSound();
  }
}

// Dismiss the alarm
function dismissAlarm() {
  // Stop audio
  if (alarmAudio) {
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
    alarmAudio = null;
  }
  
  // Stop beep sound
  if (beepInterval) {
    clearInterval(beepInterval);
    beepInterval = null;
  }
  
  // Remove popup
  const popup = document.getElementById('alarm-popup');
  if (popup) {
    popup.remove();
  }
}

// Fallback beep sound using Web Audio API
function playBeepSound() {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    // Repeat beep every 2 seconds using setInterval for better control
    beepInterval = setInterval(playBeepSound, 2000);
  } catch (error) {
    console.log('Web Audio API not available');
  }
}

// Load alarm from localStorage on page load
function loadAlarmFromStorage() {
  const savedAlarm = localStorage.getItem('alarm');
  if (savedAlarm) {
    currentAlarm = JSON.parse(savedAlarm);
  }
}
