# Alarm Clock App

A simple, elegant alarm clock application with a dark minimalist design. Features a real-time clock display and alarm functionality with persistence across browser sessions.

## Features

- **Real-time Clock**: Displays current time in 24-hour format without leading zeros
- **Alarm Setting**: Set custom alarm times with up/down controls
- **Alarm Persistence**: Alarm settings are saved locally and persist across browser sessions
- **Backend Integration**: Optional backend support for enhanced persistence
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Modern dark interface with smooth animations

## File Structure

```
alarm-app/
├── frontend/
│   ├── index.html      # Main HTML file
│   ├── app.js          # JavaScript functionality
│   ├── style.css       # Styling and animations
│   └── Popular Alarm Clock Sound Effect.mp3  # Alarm sound file
└── backend/
    ├── server.js       # Express.js server
    ├── package.json    # Node.js dependencies
    └── alarm.json      # Alarm data storage
```

## Setup Instructions

### Frontend Only (Recommended for testing)

1. **Alarm Sound**: An alarm sound file (`Popular Alarm Clock Sound Effect.mp3`) has been added to the `frontend/` folder
   - The app will use this sound when the alarm triggers
   - If you want to change the sound, replace the existing file or update the filename in `app.js`
   - You can find free alarm sounds on websites like [Freesound.org](https://freesound.org/)

2. **Run with Live Server**: 
   - Open the `frontend/` folder in VS Code
   - Right-click on `index.html` and select "Open with Live Server"
   - Or use any local development server

### Full Stack (Optional)

1. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Start Backend Server**:
   ```bash
   node server.js
   ```

3. **Start Frontend**: Use Live Server or any local server

## How to Use

### Clock Tab
- Displays the current time in 24-hour format
- Updates every second
- No leading zeros (e.g., 9:5:7 instead of 09:05:07)

### Alarm Tab
1. **View Current Alarm**: Shows the currently set alarm time
2. **Edit Alarm**: Click "Edit" to enter edit mode
3. **Adjust Time**: Use ↑ and ↓ buttons to change hours and minutes
4. **Set Alarm**: Click "Set" to save the alarm
5. **Alarm Trigger**: When the current time matches the alarm time, a popup will appear with sound

## Features Explained

### Alarm Persistence
- Alarm settings are automatically saved to browser localStorage
- Settings persist even when you close and reopen the browser
- If backend is available, settings are also saved there

### Alarm Sound
- The app tries to play `alarm.mp3` when the alarm triggers
- If the MP3 file is not available, it falls back to a beep sound using Web Audio API
- The alarm will continue until you click "Dismiss"

### Backend Integration
- The app works without a backend (frontend-only mode)
- If a backend is running on `localhost:5000`, it will sync alarm settings
- Backend provides additional persistence and potential for future features

## Browser Compatibility

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers supported

## Troubleshooting

### "Loading..." Issue
- This was fixed in the updated code
- The app now properly initializes the clock display
- Make sure you're using the latest version of the files

### Alarm Not Playing
- Ensure `alarm.mp3` is in the `frontend/` folder
- Check browser console for audio-related errors
- The app includes a fallback beep sound if MP3 fails

### Backend Connection Issues
- The app works fine without a backend
- Backend errors are handled gracefully
- Check that the backend server is running on port 5000 if you want to use it

## Customization

### Changing Colors
Edit `style.css` to modify the color scheme:
- `#121212` - Background color
- `#00ff88` - Clock color
- `#ff6b6b` - Alarm color

### Adding Features
The modular JavaScript structure makes it easy to add new features:
- Add new tabs by extending the `showTab()` function
- Modify alarm logic in `checkAlarm()` and `triggerAlarm()`
- Enhance styling in `style.css`

## License

This project is open source and available under the MIT License. 