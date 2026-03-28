// ---- CALENDAR ----

// Track current month/year being shown
let currentDate = new Date();
let currentMonth = currentDate.getMonth(); // 0 = Jan
let currentYear = currentDate.getFullYear();

// Store events: { "YYYY-MM-DD": "Event Name" }
let events = JSON.parse(localStorage.getItem("portfolioEvents")) || {};

// Month names
const monthNames = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

// Main function to render calendar
function renderCalendar(month, year) {
  const container = document.getElementById("calendarDays");
  container.innerHTML = "";

  // Header
  document.getElementById("monthYear").textContent = `${monthNames[month]} ${year}`;

  // 1st day of the month (0 = Sun, 6 = Sat)
  const firstDay = new Date(year, month, 1).getDay();

  // Number of days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Today's date
  const today = new Date();

  // Empty cells before 1st day
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("calendar-day", "empty");
    container.appendChild(emptyCell);
  }

  // Days
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement("div");
    cell.classList.add("calendar-day");
    cell.textContent = d;

    const mm = String(month + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    const dateKey = `${year}-${mm}-${dd}`;

    // Highlight today
    if (
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      cell.classList.add("today");
    }

    // Highlight events
    if (events[dateKey]) {
      cell.classList.add("has-event");
      cell.title = events[dateKey];
    }

    container.appendChild(cell);
  }

  renderEventList();
}

// Prev / Next month
document.getElementById("prevBtn").addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentMonth, currentYear);
});

document.getElementById("nextBtn").addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentMonth, currentYear);
});

// Add event
function addEvent() {
  const dateInput = document.getElementById("eventDate").value;
  const nameInput = document.getElementById("eventName").value.trim();

  if (!dateInput || !nameInput) {
    alert("Please fill in both date and event name!");
    return;
  }

  events[dateInput] = nameInput;
  localStorage.setItem("portfolioEvents", JSON.stringify(events));

  document.getElementById("eventDate").value = "";
  document.getElementById("eventName").value = "";

  renderCalendar(currentMonth, currentYear);
}

// Render event list
function renderEventList() {
  const ul = document.getElementById("eventItems");
  ul.innerHTML = "";

  const sorted = Object.entries(events).sort((a, b) => a[0].localeCompare(b[0]));

  if (sorted.length === 0) {
    ul.innerHTML = "<li style='color:var(--muted);font-size:0.85rem;'>No events yet.</li>";
    return;
  }

  sorted.forEach(([date, name]) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${name}</span>
      <span class="ev-date">${date}</span>
      <button class="ev-del" onclick="deleteEvent('${date}')" title="Delete">✕</button>
    `;
    ul.appendChild(li);
  });
}

// Delete event
function deleteEvent(dateKey) {
  delete events[dateKey];
  localStorage.setItem("portfolioEvents", JSON.stringify(events));
  renderCalendar(currentMonth, currentYear);
}

// Contact form
function handleContact(event) {
  event.preventDefault();
  alert("✅ Message sent!");
  event.target.reset();
}

// Init
renderCalendar(currentMonth, currentYear);