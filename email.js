// First add this script to your HTML:
// <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

async function sendEmail(event) {
    event.preventDefault();
    
    emailjs.init("mLNvxe2aQsvGkI-_k");

    // Get form values
    const userEmail = document.getElementById('email').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const duration = document.getElementById('duration').value;

    // Format the date and time nicely
    const meetingDate = new Date(`${date}T${time}`);
    const formattedDateTime = meetingDate.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Calculate end time
    const endTime = new Date(meetingDate.getTime() + duration * 60000);
    const formattedEndTime = endTime.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const templateParams = {
        to_name: "Roya",
        from_email: userEmail,
        meeting_time: formattedDateTime,
        end_time: formattedEndTime,
        duration: `${duration} minutes`,
        template_params: {
            from_email: userEmail,
            meeting_time: formattedDateTime,
            end_time: formattedEndTime,
            duration: `${duration} minutes`
        }
    };

    try {
        const response = await emailjs.send('service_8nud85j', 'template_gjgepwh', templateParams);
        console.log('SUCCESS!', response.status, response.text);
        
        // Get the current domain
        const domain = window.location.origin;
        window.location.replace(`${domain}/confirmation.html`);
    } catch (error) {
        console.log('FAILED...', error);
        document.getElementById('status-message').innerHTML = 
            "There was an error sending your request. Please try again.";
    }
}

// Add event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('meetingForm');
    if (form) {
        form.addEventListener('submit', sendEmail);
    }
});