// Replace with your Google Calendar API credentials
const CLIENT_ID = 'YOUR_CLIENT_ID';
const API_KEY = 'YOUR_API_KEY';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.addEventListener('DOMContentLoaded', initializeGoogleAPI);

function initializeGoogleAPI() {
    gapi.load('client', initializeGapiClient);
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
}

async function createEvent(e) {
    e.preventDefault();

    // Get form values
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const duration = parseInt(document.getElementById('duration').value);

    // Create datetime strings
    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

    // Create event details
    const event = {
        'summary': 'Rescheduled Meeting',
        'description': 'Meeting rescheduled from previous cancellation.',
        'start': {
            'dateTime': startDateTime.toISOString(),
            'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        'end': {
            'dateTime': endDateTime.toISOString(),
            'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
        }
    };

    try {
        // Request authorization
        tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                throw resp;
            }
            // Call Google Calendar API
            try {
                const request = await gapi.client.calendar.events.insert({
                    'calendarId': 'primary',
                    'resource': event
                });
                
                window.location.href = 'confirmation.html';
            } catch (err) {
                document.getElementById('auth-status').textContent = 'Error: ' + err.message;
            }
        };

        if (gapi.client.getToken() === null) {
            tokenClient.requestAccessToken();
        } else {
            tokenClient.requestAccessToken();
        }
    } catch (err) {
        document.getElementById('auth-status').textContent = 'Error: ' + err.message;
    }
} 