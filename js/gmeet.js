
// set the target element of the input field
const $datepickerEl = document.getElementById('datepicker-meeting-date');

// optional options with default values and callback functions
const options = {
    defaultDatepickerId: 'datepicker-selected-date',
    autohide: false,
    format: 'dd/mm/yyyy',
    maxDate: null,
    minDate: new Date(),
    orientation: 'bottom',
    buttons: true,
    autoSelectToday: true,
    title: null,
    rangePicker: false,
    onShow: () => {},
    onHide: () => {},
};

const instanceOptions = {
  id: 'datepicker-meeting-date',
  override: true
};

/*
 * $datepickerEl: required
 * options: optional
 */
const datepicker = new Datepicker($datepickerEl, options, instanceOptions);

//const availableSlots = ["08:00", "08:20", "08:40", "09:00", "09:20", "09:40"]
const timetableList = document.getElementById('timetable'); 
const selectedDateFmt = document.getElementById('selected-date-fmt')
const noSlotElt = document.getElementById("no-slot");

// Add an event listener for the changeDate event
// https://github.com/themesberg/flowbite-datepicker/blob/658b8cc5b84aec732e60f59044b35d4769c00294/js/Datepicker.js#L110
$datepickerEl.addEventListener('changeDate', async (event) => {
    // console.log('event info:', event); // event.detail.date
    let selectedDate = datepicker.getDate()
 
    // reset content everytime we change date
    noSlotElt.textContent = '';

    // dont allow saturday and sunday
    if (!selectedDate || selectedDate.getDay() == 0 || selectedDate.getDay() == 6 || selectedDate < new Date()) {
        datepicker.setDate({clear: true})
        selectedDateFmt.innerText = "Select a Date First"
        timetableList.innerHTML = '';
        return
    }

    selectedDateFmt.innerText = selectedDate.toLocaleDateString() 

    // Show loading spinner
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = "flex flex-col justify-center items-center h-32";
    loadingSpinner.innerHTML = `
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        <p class="ml-2 justify-center items-center">Loading...</p>
    `;
    timetableList.innerHTML = ''; // Clear existing timetable entries
    timetableList.appendChild(loadingSpinner); // Add loading spinner

    const availableSlots = await fetchAvailableSlots(selectedDate);
    // Clear existing timetable entries
    timetableList.innerHTML = '';
    // Loop through availableSlots and add entries to the timetable
    if (availableSlots && availableSlots.length > 0) {
        availableSlots.forEach(slot => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input
                    type="radio"
                    id="${slot}"
                    value="${slot}"
                    class="hidden peer"
                    name="timetable"
                />
                <label
                    for="${slot}"
                    class="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-white border rounded-lg cursor-pointer text-blue-600 border-blue-600 dark:hover:text-white dark:border-blue-500 dark:peer-checked:border-blue-500 peer-checked:border-blue-600 peer-checked:bg-blue-600 hover:text-white peer-checked:text-white hover:bg-blue-500 dark:text-blue-500 dark:bg-gray-900 dark:hover:bg-blue-600 dark:hover:border-blue-600 dark:peer-checked:bg-blue-500"
                >
                    ${slot} AM CET
                </label>
            `;
            timetableList.appendChild(li);
        });
    } else {
        noSlotElt.textContent = 'No Time Available';
    }
});

async function fetchAvailableSlots(selectedDate) {
    try {
        const response = await fetch(`http://localhost:8787/gmeet-api/available-slots?date=${selectedDate}`);
        const data = await response.json();
        return data.availableSlots;
    } catch (error) {
        console.error('Error fetching available slots:', error);
        return [];
    }
}

document.getElementById('meeting-invitation-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    console.log(datepicker.getDate());

    const formData = new FormData(this);
    formData.append('selectedDate', datepicker.getDate().toLocaleDateString());
    const responseMessage = document.getElementById('response-message');

    try {
        const response = await fetch('http://localhost:8787/gmeet-api/create-meeting', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        responseMessage.textContent = result.message;

        // Clear the form after submission
        this.reset();

        // Hide the message after 5 seconds
        setTimeout(() => {
            responseMessage.textContent = '';
        }, 5000);
    } catch (error) {
        console.error('Error:', error);
        responseMessage.textContent = 'An error occurred. Please try again.';
    }
});
