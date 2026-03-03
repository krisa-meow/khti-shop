const datepicker = document.querySelector(".datepicker");
const rangeInput = datepicker.querySelector("input");
const calendarContainer = datepicker.querySelector(".calendar");
const leftCalendar = datepicker.querySelector(".left-side");
const centerCalendar = datepicker.querySelector(".center-side");
const rightCalendar = datepicker.querySelector(".right-side");
const prevButton = datepicker.querySelector(".prev");
const nextButton = datepicker.querySelector(".next");
const selectionEl = datepicker.querySelector(".selection");
const applyButton = datepicker.querySelector(".apply");
const cancelButton = datepicker.querySelector(".cancel");

let start = null;
let end = null;
let originalStart = null;
let originalEnd = null;

let leftDate = new Date();
leftDate.setDate(1);
let centerDate = new Date(leftDate);
let rightDate = new Date(centerDate);
centerDate.setMonth(centerDate.getMonth() + 1);
rightDate.setMonth(rightDate.getMonth() + 2);

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
        span.setAttribute("data-date", formatDate(date));
    }

    span.addEventListener("click", handleDateClick);
    span.addEventListener("mouseover", handleDateMouseover);

    return span;
};

const displaySelection = () => {
    if (start && end) {
        const startDate = start.toLocaleDateString("ru");
        const endDate = end.toLocaleDateString("ru");

        let countDays = (end.getTime() - start.getTime()) / (3600000 * 24) + 1;
        let discountCost = 1;

        if (countDays >= 30) {
            selectionEl.textContent = `${startDate} - ${endDate} = ${countDays} дня(дней) = ${(countDays * 450) * 0.85} Руб. - 15%`;
        }
        else {
            selectionEl.textContent = `${startDate} - ${endDate} = ${countDays} дня(дней) = ${(countDays * 450) * 1} Руб.`;
        }

        
    }
};

const applyHighlighting = () => {
    const dateElements = datepicker.querySelectorAll("span[data-date]");
    for(const dateEl of dateElements) {
        dateEl.classList.remove("range-start", "range-end", "in-range");
    }

    if (start) {
        const startDate = formatDate(start);
        const startEl = datepicker.querySelector(`span[data-date="${startDate}" ]`);
        if(startEl) {
            startEl.classList.add("range-start");
            if (!end) startEl.classList.add("range-end");  
        }
    }
    
    if (end) {
        const endDate = formatDate(end);
        const endEl = datepicker.querySelector(`span[data-date="${endDate}" ]`);
        if (endEl) endEl.classList.add("range-end");
    }

    if (start && end) {
        for (const dateEl of dateElements) {
            const date = new Date(dateEl.dataset.date);
            if (date > start && date < end) {
                dateEl.classList.add("in-range");
            }
        }
    }
};

const handleDateMouseover = (event) => {
    const hoverEl = event.target;
    if (start && !end) {
        applyHighlighting();
        const hoverDate = new Date(hoverEl.dataset.date);
        datepicker.querySelectorAll("span[data-date]").forEach((dateEl) => {
            const date = new Date(dateEl.dataset.date);
            if (date > start && date < hoverDate && start < hoverDate) {
                dateEl.classList.add("in-range");
            }
        })
    }
};

const handleDateClick = (event) => {
    const dateEl = event.target;
    const selectedDate = new Date(dateEl.dataset.date); 

    if(!start || (start && end)) {
        start = selectedDate;
        end = null;
    } else if(selectedDate < start) {
        start = selectedDate;
    } else {
        end = selectedDate;
    }

    applyHighlighting();
    displaySelection();
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

    applyHighlighting();
};

const updateCalendars = () => {
    renderCalendar(leftCalendar, leftDate.getFullYear(), leftDate.getMonth());
    renderCalendar(centerCalendar, centerDate.getFullYear(), centerDate.getMonth());
    renderCalendar(rightCalendar, rightDate.getFullYear(), rightDate.getMonth());
};

// show datepicker
rangeInput.addEventListener("focus", () => {
    originalStart = start;
    originalEnd = end;
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
    centerDate.setMonth(centerDate.getMonth() - 1);
    rightDate.setMonth(rightDate.getMonth() - 1);
    updateCalendars();
});

nextButton.addEventListener("click", () => {
    leftDate.setMonth(leftDate.getMonth() + 1);
    centerDate.setMonth(centerDate.getMonth() + 1);
    rightDate.setMonth(rightDate.getMonth() + 1);
    updateCalendars();
});

applyButton.addEventListener("click", () => {
    if (start && end) {
        const startDate = start.toLocaleDateString("ru");
        const endDate = end.toLocaleDateString("ru");
        rangeInput.value = `${startDate} - ${endDate}`;
        calendarContainer.hidden = true;
    }
});

cancelButton.addEventListener("click", () => {
    start = originalStart;
    end = originalEnd;
    applyHighlighting();
    displaySelection();
    calendarContainer.hidden = true;
});

updateCalendars();