let lastTime = "";
let tableData = "";
let firstrun_table = true;
let firstrun_timestamp = true;


function populateTable() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('hotel-data');
            // Clear existing rows
            tableBody.innerHTML = '';
            data.forEach(hotel => {
                const hotelDetailsRow = document.createElement('tr');
                hotelDetailsRow.innerHTML = `
                    <td colspan="7">
                        <div class="hotel-toggle"> <span class="expand-indicator">▼</span>
                            ${hotel.hotel_name} (${hotel.distance} ${getDistanceUnit(hotel.distance_unit)})
                            <!-- Add an arrow indicator -->
                        </div>
                    </td>
                `;
                tableBody.appendChild(hotelDetailsRow);

                const newRow = document.createElement('tr');
                newRow.classList.add('hotel-details-row');
                newRow.innerHTML = `
                    <td>${hotel.room_name}</td>
                    <td>${hotel.room_rate}</td>
                    <td>${hotel['2024-7-31'] || ''}</td>
                    <td>${hotel['2024-8-1'] || ''}</td>
                    <td>${hotel['2024-8-2'] || ''}</td>
                    <td>${hotel['2024-8-3'] || ''}</td>
                    <td>${hotel['2024-8-4'] || ''}</td>
                `;
                tableBody.appendChild(newRow);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

populateTable();

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('hotel-toggle')) {
        const parentRow = event.target.closest('tr');
        if (parentRow) {
            const detailsRow = parentRow.nextElementSibling;
            if (detailsRow && detailsRow.classList.contains('hotel-details-row')) {
                detailsRow.style.display = detailsRow.style.display === "none" ? "table-row" : "none";
                // Toggle the expand indicator
                const expandIndicator = parentRow.querySelector('.expand-indicator');
                expandIndicator.textContent = detailsRow.style.display === "none" ? "▶" : "▼";
            } else {
                console.error("Hotel details row not found.");
            }
        }
    }
});

// Function to get the distance unit
function getDistanceUnit(unit) {
    switch (unit) {
        case 0:
            return 'Skywalk';
        case 1:
            return 'Blocks';
        case 3:
            return 'Miles';
        default:
            return 'Unknown';
    }
}
function refreshTimestamp() {
    fetch("timestamp")
        .then(response => response.text())
        .then(response => {
            if (response !== lastTime) {
                populateTable();
                let timestampElement = document.getElementById("TimeStamp");
                timestampElement.textContent = response;
                if (!firstrun_timestamp) {
                    timestampElement.style.display = "none";
                    timestampElement.style.display = "block";
                }
                lastTime = response;
                firstrun_timestamp = false;
            }
        });
}

refreshTimestamp();
setInterval(refreshTimestamp, 2000);
// Function to toggle hotel details visibility
