const wedGenConDate = "2024-7-31";
let lastTime = "";
let lastTimestamp = "";
let firstrunTable = true;
let firstrun_timestamp = true;
let alert_active = false;
let alert_active_skywalk = false;
let alert_active_blocks = false;
let alertAudio_active = false;
let alertAudio_active_quiet = false;
let alertAudio_active_loud = false;
let alertPortal_active = false;
let alertPortal_active_url = '';
let checkbox_alertsActive = document.getElementById("alerts_on");
let checkbox_alertsOnSkywalk = document.getElementById("alerts_skywalk");
let checkbox_alertsOnBlock = document.getElementById("alerts_blocks");
let checkbox_alertsAudioActive = document.getElementById("audio_alerts");
let radio_alertsAudioQuiet = document.getElementById("audio_quiet");
let radio_alertsAudioLoud = document.getElementById("audio_loud");
let checkbox_alertsPortalOpen = document.getElementById("alert_open_portal");
let text_alertsPortalUrl = document.getElementById("alert_open_portal_url");
let check_alertsPortalUrl = document.getElementById("alert_open_portal_url_check");
let portalurl_tip = document.getElementById("portal_url_tip");




// Function to format date as YYYY-M-D
function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1);
    const day = String(d.getDate());
    return `${year}-${month}-${day}`;
}

// Function to get remaining dates
function getRemainingDates(startingDate) {
    const startDate = new Date(startingDate);
    const thursday = new Date(startDate);
    const friday = new Date(startDate);
    const saturday = new Date(startDate);
    const sunday = new Date(startDate);

    thursday.setDate(startDate.getDate() + 1);
    friday.setDate(startDate.getDate() + 2);
    saturday.setDate(startDate.getDate() + 3);
    sunday.setDate(startDate.getDate() + 4);

    return {
        thursday: formatDate(thursday),
        friday: formatDate(friday),
        saturday: formatDate(saturday),
        sunday: formatDate(sunday)
    };
}

// Set the starting date
const startingDate = wedGenConDate;

// Get remaining dates
const remainingDates = getRemainingDates(startingDate);

// Construct the string
const remainingDatesString = `${remainingDates.thursday}, ${remainingDates.friday}, ${remainingDates.saturday}, ${remainingDates.sunday}`;


let tableData = null; // Initialize tableData as null

function refreshTable() {
    let fetchInit = {
        cache: "no-store"
    };

    fetch('data.json', fetchInit)
        .then(response => response.json())
        .then(newData => {
            const table = document.getElementById('Gencon-Hotels');

            // Check if newData is different from existing data
            if (!isEqual(newData, tableData)) {
                // Clear existing table contents
                table.innerHTML = '';

                // Update tableData with the new data
                tableData = newData;

                // Rebuild the table with the new data
                if (tableData.length === 0) {
                    table.innerHTML = ` <thead role="rowgroup">
                        <tr role="row">
                            <th role="columnheader" scope="col">Room Name</th>
                            <th role="columnheader" scope="col">Rate</th>
                            <th role="columnheader" scope="col">Wed</th>
                            <th role="columnheader" scope="col">Thurs</th>
                            <th role="columnheader" scope="col">Fri</th>
                            <th role="columnheader" scope="col">Sat</th>
                            <th role="columnheader" scope="col">Su</th>
                        </tr>
                    </thead>`;
                    // If there is no data, create a single row with "No Data" message
                    const noDataRow = document.createElement('tr');
                    const noDataCell = document.createElement('td');
                    noDataCell.setAttribute('colspan', '7');
                    noDataCell.classList.add('no-data');
                    noDataCell.textContent = 'No Hotel Data Available';
                    noDataRow.appendChild(noDataCell);
                    const tbody = document.createElement('tbody');
                    tbody.appendChild(noDataRow);
                    table.appendChild(tbody);
                } else {
  // If there is data, create a thead for table headers
const thead = document.createElement('thead');
const headerRow = document.createElement('tr');
headerRow.innerHTML = `
    <th role="columnheader" scope="col">Room Name</th>
    <th role="columnheader" scope="col">Rate</th>
    <th role="columnheader" scope="col">Wed</th>
    <th role="columnheader" scope="col">Thurs</th>
    <th role="columnheader" scope="col">Fri</th>
    <th role="columnheader" scope="col">Sat</th>
    <th role="columnheader" scope="col">Su</th>
`;
thead.appendChild(headerRow);
table.appendChild(thead);

// Create a tbody for each hotel group and populate the table
let hotelGroups = {}; // Object to store hotel groups by hotel ID

newData.forEach(hotel => {
    // Check if the hotel ID exists in the groups object
    if (hotel.hotel_id in hotelGroups) {
        // If the hotel ID exists, add the room details to the existing group
        hotelGroups[hotel.hotel_id].rooms.push({
            room_name: hotel.room_name,
            room_rate: hotel.room_rate,
            wedGenConDate: hotel[startingDate] || '',
            thursGenConDate: hotel[remainingDates.thursday] || '',
            friGenConDate: hotel[remainingDates.friday] || '',
            satGenConDate: hotel[remainingDates.saturday] || '',
            sunGenConDate: hotel[remainingDates.sunday] || ''
        });
    } else {
        // If the hotel ID doesn't exist, create a new group
        hotelGroups[hotel.hotel_id] = {
            hotel_name: hotel.hotel_name,
            distance: hotel.distance,
            distance_unit: hotel.distance_unit,
            rooms: [{
                room_name: hotel.room_name,
                room_rate: hotel.room_rate,
                wedGenConDate: hotel[startingDate] || '',
                thursGenConDate: hotel[remainingDates.thursday] || '',
                friGenConDate: hotel[remainingDates.friday] || '',
                satGenConDate: hotel[remainingDates.saturday] || '',
                sunGenConDate: hotel[remainingDates.sunday] || ''
            }]
        };
    }
});
                    const sortedHotelGroups = Object.values(hotelGroups).sort((a, b) => a.distance - b.distance);
                    // Loop through each hotel group and populate the table
sortedHotelGroups.forEach(group => {
    const tbody = document.createElement('tbody');

    const hotelDetailsRow = document.createElement('tr');
    hotelDetailsRow.innerHTML = `
        <td role="cell" colspan="7" class="hotel-name">
            <div class="hotel-toggle"> <span class="expand-indicator">▼</span>
                ${group.hotel_name} (${getDistanceUnit(group.distance, group.distance_unit)})
                <!-- Add an arrow indicator -->
            </div>
        </td>
    `;
    // Apply different CSS classes based on the group index
    hotelDetailsRow.classList.add('detail-group');

    tbody.appendChild(hotelDetailsRow);

    group.rooms.forEach(room => {
        const newRow = document.createElement('tr');
        newRow.classList.add('hotel-details-row');
        newRow.innerHTML = `
            <td role="cell" data-label="Room Name" ${room.room_name ? '' : 'class="unavailable"'}>${room.room_name}</td>
            <td role="cell" data-label="Rate" ${room.room_rate ? '' : 'class="unavailable"'}>${room.room_rate}</td>
            <td role="cell" data-label="Wed" ${room.wedGenConDate ? '' : 'class="unavailable"'}>${room.wedGenConDate}</td>
            <td role="cell" data-label="Thurs" ${room.thursGenConDate ? '' : 'class="unavailable"'}>${room.thursGenConDate}</td>
            <td role="cell" data-label="Fri" ${room.friGenConDate ? '' : 'class="unavailable"'}>${room.friGenConDate}</td>
            <td role="cell" data-label="Sat" ${room.satGenConDate ? '' : 'class="unavailable"'}>${room.satGenConDate}</td>
            <td role="cell" data-label="Su" ${room.sunGenConDate ? '' : 'class="unavailable"'}>${room.sunGenConDate}</td>
        `;
        // Apply the same CSS class as the corresponding hotel details row
        // newRow.classList.add('detail-group');
        tbody.appendChild(newRow);

          // Incorporate the provided logic for setting background color based on distance_unit
          if (room.distance_unit === 0) {
            newRow.style.backgroundColor = "#008000";
            if (alert_active && alert_active_skywalk && !alert_fired) {
                alert_fire();
                alert_fired = true;
            }
        }
        if (room.distance_unit === 1) {
            newRow.style.backgroundColor = "#00008B";
            if (alert_active && alert_active_blocks && !alert_fired) {
                alert_fire();
                alert_fired = true;
            }
        }
    });

    table.appendChild(tbody);
});
                }
            }
            // If data hasn't changed, do nothing
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Function to check if two objects are equal
function isEqual(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}


refreshTable();
document.addEventListener('DOMContentLoaded', function() {
    // Event listener for collapsing/expanding all items
    const toggleAllButton = document.getElementById('toggle-all');
    toggleAllButton.addEventListener('click', function() {
        const detailsRows = document.querySelectorAll('.hotel-details-row');
        const expandIndicators = document.querySelectorAll('.expand-indicator');
        const isAnyRowCollapsed = Array.from(detailsRows).some(row => row.style.display === 'none');
        
        detailsRows.forEach(row => {
            row.style.display = isAnyRowCollapsed ? 'table-row' : 'none';
        });

        expandIndicators.forEach(indicator => {
            indicator.textContent = isAnyRowCollapsed ? '▼' : '▶';
        });
    });

    // Event listener for collapsing/expanding individual items
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('hotel-toggle')) {
            const parentRow = event.target.closest('tr');
            if (parentRow) {
                // Toggle the expand indicator
                const expandIndicator = parentRow.querySelector('.expand-indicator');
                if (expandIndicator.textContent === "▼") {
                    expandIndicator.textContent = "▶";
                } else {
                    expandIndicator.textContent = "▼";
                }
                let detailsRow = parentRow.nextElementSibling;
                while (detailsRow && detailsRow.classList.contains('hotel-details-row')) {
                    detailsRow.style.display = detailsRow.style.display === "none" ? "table-row" : "none";
                    detailsRow = detailsRow.nextElementSibling;
                }
            }
        }
    });
});

var x = window.matchMedia("(max-width: 700px)")


// Function to get the distance unit
function getDistanceUnit(distance, unit) {
    switch (unit) {
        case null:
        case "":
            return 'Distance Unknown - See Portal';
        case 0:
            return 'Skywalk';
        case 1:
            return `${distance} Blocks`;
        case 3:
            return `${distance} Miles`;
        default:
            return 'Distance Unknown - See Portal';
    }
}
function refreshTimestamp() {
    fetch("timestamp")
        .then(function (response) {
            return response.text();
        })
        .then(function (response) {
            if (response !== lastTimestamp) {
                refreshTable();
                if (firstrunTable) {
                    $("#TimeStamp").text(response);
                } else {
                    $("#TimeStamp").fadeOut("slow", function () {
                        $("#TimeStamp").text(response);
                    });
                    refreshTable();
                    $("#TimeStamp").fadeIn("slow");
                    lastTimestamp = response;
                }
                firstrunTable = false;
            }
        });
}

refreshTimestamp();
setInterval(refreshTimestamp, 2000);


// Function to handle alerts enabling/disabling
function alertsEnabled() {
    alert_active = checkbox_alertsActive.checked;
    alert_active_skywalk = checkbox_alertsOnSkywalk.checked;
    alert_active_blocks = checkbox_alertsOnBlock.checked;
    alertAudio_active = checkbox_alertsAudioActive.checked;
    alertPortal_active = checkbox_alertsPortalOpen.checked;

    checkbox_alertsOnSkywalk.disabled = !alert_active;
    checkbox_alertsOnBlock.disabled = !alert_active;
    checkbox_alertsAudioActive.disabled = !alert_active_skywalk && !alert_active_blocks;
    checkbox_alertsPortalOpen.disabled = !alert_active_skywalk && !alert_active_blocks;
    text_alertsPortalUrl.disabled = !alertPortal_active;

    if (!alert_active_skywalk && !alert_active_blocks) {
        checkbox_alertsAudioActive.checked = false;
        checkbox_alertsPortalOpen.checked = false;
        radio_alertsAudioQuiet.checked = false;
        radio_alertsAudioLoud.checked = false;
        check_alertsPortalUrl.innerHTML = "";
    }

    // Enable/disable radio buttons based on audio alerts checkbox state
    radio_alertsAudioQuiet.disabled = !alertAudio_active;
    radio_alertsAudioLoud.disabled = !alertAudio_active;

    if (alertPortal_active) {
        check_alertsPortalUrl.innerHTML = "Inactive - Valid Link Required";
        check_alertsPortalUrl.style.color = "Red";
        portalurl_tip.style.display = "block";
        text_alertsPortalUrl.style.color = "Red";
    } else {
        check_alertsPortalUrl.innerHTML = "";
        portalurl_tip.style.display = "none";
    }
}


// Function to handle audio alert type selection
function handleAudioAlertType(event) {
    alertAudio_active_quiet = event.target.id === "audio_quiet" && event.target.checked;
    alertAudio_active_loud = event.target.id === "audio_loud" && event.target.checked;
}

// Event listener for audio alert type selection
checkbox_alertsAudioActive.addEventListener("change", handleAudioAlertType);

// Function to validate portal URL
function alertPortalUrl() {
    const test_string = text_alertsPortalUrl.value;
    const regex_check1 = /https:\/\/book.passkey.com/i;
    if (regex_check1.test(test_string)) {
        check_alertsPortalUrl.innerHTML = "Link - Enabled";
        check_alertsPortalUrl.style.color = "Green";
        alertPortal_active_url = test_string;
        alertPortal_active = true;
    } else {
        alertPortal_active = false;
        check_alertsPortalUrl.innerHTML = "Invalid Link - Disabled";
        check_alertsPortalUrl.style.color = "Red";
    }
}

// Event listener for portal URL input
text_alertsPortalUrl.addEventListener("change", alertPortalUrl);

// Function to trigger alerts
function alert_fire() {
    if (alertAudio_active) {
        const audioSrc = alertAudio_active_quiet ? "audio/alert_subtle.wav" : "audio/alert_loud.wav";
        const audio = new Audio(audioSrc);
        audio.play();
    }
    if (alertPortal_active) {
        window.open(alertPortal_active_url);
    }
}
