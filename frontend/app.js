
// This variable stores the alarm time as an object with hour and minute properties
let currentAlarm = { hour: 6, minute: 0 };

// This variable keeps track of whether the user is editing the alarm time
let isEditing = false;

// This variable will hold the audio object for the alarm sound
let alarmAudio = null;

// This variable will hold the interval ID for the beep sound (used as a fallback alarm)
let beepInterval = null;

// This function runs automatically when the web page finishes loading
window.onload = async () => {
  // First, try to load the alarm time from the browser's local storage (saved settings)
  loadAlarmFromStorage();
  
  // Next, try to get the alarm time from the backend server (if available)
  try {
    // 'fetch' is a function that asks the server for data from the given URL
    const response = await fetch('http://localhost:5000/alarm');
    // If the server responds with a success code (status 200), update the alarm time
    if (response.ok) {
      // Convert the server's response from JSON text to a JavaScript object
      currentAlarm = await response.json();
    }
  } catch (error) {
    // If the server is not available, print a message to the browser's console
    console.log('Backend not available, using default alarm time');
  }
  
  // Show the current time on the clock and the alarm time on the display
  updateClock();
  updateAlarmDisplay();
  
  // Start two timers that run every second (1000 milliseconds)
  // One updates the clock display, the other checks if it's time for the alarm
  setInterval(updateClock, 1000);
  setInterval(checkAlarm, 1000);
  
  // Show the clock tab (the main view) by default when the page loads
  showTab('clock');
};


// This function switches between the "clock" and "alarm" tabs on the page
function showTab(tabName) {
  // Hide both the clock and alarm tab sections by setting their display to 'none'
  document.getElementById('clock-tab').style.display = 'none';
  document.getElementById('alarm-tab').style.display = 'none';
  
  // Remove the 'active' style from all tab buttons (so only the selected one is highlighted)
  document.querySelectorAll('#tabs button').forEach(btn => btn.classList.remove('active'));
  
  // If the user wants to see the clock tab...
  if (tabName === 'clock') {
    // Show the clock tab section
    document.getElementById('clock-tab').style.display = 'block';
    // Highlight the clock tab button
    document.querySelector('button[onclick="showTab(\'clock\')"]').classList.add('active');
  } else if (tabName === 'alarm') {
    // Show the alarm tab section
    document.getElementById('alarm-tab').style.display = 'block';
    // Highlight the alarm tab button
    document.querySelector('button[onclick="showTab(\'alarm\')"]').classList.add('active');
  }
}


// This function updates the clock display on the web page every second
function updateClock() {
  // Create a new Date object to get the current time
  const now = new Date();
  // Get the current hour (0-23)
  const hours = now.getHours();
  // Get the current minute (0-59)
  const minutes = now.getMinutes();
  // Get the current second (0-59)
  const seconds = now.getSeconds();
  
  // Format the time as "hour:minute:second" (e.g., 7:05:09)
  // padStart(2, '0') adds a leading zero if the number is only one digit
  const timeString = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  // Show the formatted time in the element with id 'clock'
  document.getElementById('clock').textContent = timeString;
}


// This function updates the alarm time shown on the web page
function updateAlarmDisplay() {
  // Show the alarm time in the format "hour:minute" (e.g., 6:00)
  document.getElementById('alarm-time').textContent = `${currentAlarm.hour}:${currentAlarm.minute.toString().padStart(2, '0')}`;
  // Show the hour and minute in their respective elements (for editing)
  document.getElementById('hour').textContent = currentAlarm.hour;
  document.getElementById('minute').textContent = currentAlarm.minute.toString().padStart(2, '0');
}


// This function turns the alarm edit mode on or off
function toggleEdit() {
  // Switch the value of isEditing: true becomes false, false becomes true
  isEditing = !isEditing;
  // Find the section for editing the alarm time
  const editSection = document.getElementById('edit-section');
  // Show or hide the edit section depending on isEditing
  editSection.style.display = isEditing ? 'block' : 'none';
  
  // Change the button text to 'Cancel' if editing, or 'Edit' if not
  const editButton = document.querySelector('button[onclick="toggleEdit()"]');
  editButton.textContent = isEditing ? 'Cancel' : 'Edit';
}


// This function changes the alarm time when the user clicks the up/down buttons
// 'direction' is either 'up' or 'down', 'type' is either 'hour' or 'minute'
function change(direction, type) {
  // Only allow changes if we are in edit mode
  if (!isEditing) return;

  // If the user wants to change the hour...
  if (type === 'hour') {
    if (direction === 'up') {
      // Increase the hour by 1, wrap around to 0 after 23
      currentAlarm.hour = (currentAlarm.hour + 1) % 24;
    } else if (direction === 'down') {
      // Decrease the hour by 1, wrap around to 23 if below 0
      currentAlarm.hour = (currentAlarm.hour - 1 + 24) % 24;
    }
    // Update the hour display
    document.getElementById('hour').textContent = currentAlarm.hour;
  }

  // If the user wants to change the minute...
  if (type === 'minute') {
    if (direction === 'up') {
      // Increase the minute by 1, wrap around to 0 after 59
      currentAlarm.minute = (currentAlarm.minute + 1) % 60;
    } else if (direction === 'down') {
      // Decrease the minute by 1, wrap around to 59 if below 0
      currentAlarm.minute = (currentAlarm.minute - 1 + 60) % 60;
    }
    // Update the minute display, always show two digits
    document.getElementById('minute').textContent = currentAlarm.minute.toString().padStart(2, '0');
  }
}


// This function saves the alarm time when the user clicks the 'Set' button
async function setAlarm() {
  // Try to send the alarm time to the backend server (if available)
  try {
    // Send a POST request to the server with the alarm time as JSON
    const response = await fetch('http://localhost:5000/alarm', {
      method: 'POST', // HTTP method for sending data
      headers: {
        'Content-Type': 'application/json', // Tell the server we're sending JSON
      },
      body: JSON.stringify(currentAlarm), // Convert the alarm object to a JSON string
    });

    // If the server responds with success, show a message
    if (response.ok) {
      alert('Basic Web Alarm set successfully!');
    } else {
      // If the server responds with an error, show a different message
      alert('Failed to save alarm to backend, but Basic Web Alarm is set locally');
    }
  } catch (error) {
    // If the server is not available, show a message
    alert('Backend not available, Basic Web Alarm set locally');
  }
  
  // Always save the alarm time to the browser's local storage as a backup
  localStorage.setItem('alarm', JSON.stringify(currentAlarm));
  
  // Exit edit mode and update the alarm display
  toggleEdit();
  updateAlarmDisplay();
}


// This function checks every second if it's time for the alarm to go off
function checkAlarm() {
  // Get the current time
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentSecond = now.getSeconds();
  
  // If the current hour and minute match the alarm time, and the seconds are 0 (start of the minute)...
  if (currentHour === currentAlarm.hour && currentMinute === currentAlarm.minute && currentSecond === 0) {
    // ...then trigger the alarm
    triggerAlarm();
  }
}


// This function is called when the alarm time is reached
function triggerAlarm() {
  // Create a new popup window (a div) to show the alarm message
  const popup = document.createElement('div');
  popup.id = 'alarm-popup'; // Set the id so we can find it later
  // Set the HTML content of the popup: a message and a Dismiss button
  popup.innerHTML = `
    <div class="alarm-popup-content">
      <h2>⏰ ALARM! ⏰</h2>
      <p>Time's up! Your alarm is ringing!</p>
      <button onclick="dismissAlarm()">Dismiss</button>
    </div>
  `;
  // Add the popup to the web page
  document.body.appendChild(popup);
  
  // Try to play the alarm sound (an mp3 file)
  try {
    alarmAudio = new Audio('Popular Alarm Clock Sound Effect.mp3'); // Create an audio object
    alarmAudio.loop = true; // Make the sound repeat
    // Try to play the sound. If it fails (e.g., browser blocks it), use a beep instead
    alarmAudio.play().catch(error => {
      console.log('Could not play alarm sound:', error);
      // If the sound can't play, use a simple beep sound
      playBeepSound();
    });
  } catch (error) {
    // If creating the audio object fails, use a beep sound
    console.log('Audio not available, using beep sound');
    playBeepSound();
  }
}


// This function is called when the user clicks the Dismiss button on the alarm popup
function dismissAlarm() {
  // If the alarm sound is playing, stop it and reset to the beginning
  if (alarmAudio) {
    alarmAudio.pause(); // Pause the sound
    alarmAudio.currentTime = 0; // Go back to the start of the sound
    alarmAudio = null; // Remove the audio object
  }
  
  // If the beep sound is playing (fallback), stop it
  if (beepInterval) {
    clearInterval(beepInterval); // Stop the repeated beep
    beepInterval = null;
  }
  
  // Remove the alarm popup from the page
  const popup = document.getElementById('alarm-popup');
  if (popup) {
    popup.remove();
  }
}


// This function makes a simple beep sound using the Web Audio API (if the mp3 can't play)
function playBeepSound() {
  try {
    // Create a new audio context (the system for making sounds in the browser)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // Create an oscillator (makes a tone)
    const oscillator = audioContext.createOscillator();
    // Create a gain node (controls the volume)
    const gainNode = audioContext.createGain();
    
    // Connect the oscillator to the gain node, and the gain node to the speakers
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set the beep frequency to 800 Hz (a high-pitched tone)
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'sine'; // Use a smooth sine wave
    
    // Set the volume to 0.3 (not too loud), then fade out quickly
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    // Start the beep now, and stop it after 0.5 seconds
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    // Repeat the beep every 2 seconds by calling this function again
    beepInterval = setInterval(playBeepSound, 2000);
  } catch (error) {
    // If the browser doesn't support the Web Audio API, print a message
    console.log('Web Audio API not available');
  }
}


// This function loads the alarm time from the browser's local storage (if it was saved before)
function loadAlarmFromStorage() {
  // Get the saved alarm time (as a string) from local storage
  const savedAlarm = localStorage.getItem('alarm');
  // If there is a saved alarm, convert it from a string to an object and use it
  if (savedAlarm) {
    currentAlarm = JSON.parse(savedAlarm);
  }
}
