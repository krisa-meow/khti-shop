const datepicker = document.querySelector(".datepicker");
const rangeInput = datepicker.querySelector("input");
const calendarContainer = datepicker.querySelector(".calendar");
const leftCalendar = datepicker.querySelector(".left-side");
const rightCalendar = datepicker.querySelector(".right-side");
const prevButton = datepicker.querySelector(".prev");
const nextButton = datepicker.querySelector(".next");

let leftDate = new Date();
let rightDate = new Date(leftDate);
rightDate.setMonth(rightDate.getMonth() + 1);

calendarContainer.hidden = false;

const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const createDateEl = (date, isDisabled, isToday) => {
    const span = document.createElement("span");
    span.textContent = date.getDate();
    span.classList.toggle("disabled", isDisabled);
    if (!isDisabled) {
        span.classList.toggle("today", isToday);
    }
    return span;
};

const renderCalendar = (calendar, year, month) => {
    const label = calendar.querySelector(".label");
    label.textContent = new Date(year, month).toLocaleString(
        navigator.language || "en-US",
        {
            year: "numeric",
            month: "long",
        }
    );

    const datesContainer = calendar.querySelector(".dates");
    datesContainer.innerHTML = "";

    const startDate = new Date(year, month, 1);
    startDate.setDate(startDate.getDate() - startDate.getDay() - 6);

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 42);

    const fragment = document.createDocumentFragment();
    while(startDate < endDate) {
        const isDisabled = startDate.getMonth() != month;
        const isToday = formatDate(startDate) == formatDate(new Date());
        const dateEl = createDateEl(startDate, isDisabled, isToday);
        fragment.appendChild(dateEl);
        startDate.setDate(startDate.getDate() + 1);
    }

    datesContainer.appendChild(fragment);
    // console.log(startDate.toDateString());
};

const updateCalendars = () => {
    renderCalendar(leftCalendar, leftDate.getFullYear(), leftDate.getMonth());
    renderCalendar(rightCalendar, rightDate.getFullYear(), rightDate.getMonth());
};

// show datepicker
rangeInput.addEventListener("focus", () => {
    calendarContainer.hidden = false;
});

// hide datepicker when clicked outside
document.addEventListener("click", (event) => {
    if(!datepicker.contains(event.target)) {
        calendarContainer.hidden = true;
    }
});

prevButton.addEventListener("click", () => {
    leftDate.setMonth(leftDate.getMonth() - 1);
    rightDate.setMonth(rightDate.getMonth() - 1);
    updateCalendars();
});

nextButton.addEventListener("click", () => {
    leftDate.setMonth(leftDate.getMonth() + 1);
    rightDate.setMonth(rightDate.getMonth() + 1);
    updateCalendars();
});

updateCalendars();