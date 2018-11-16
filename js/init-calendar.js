//
// Display the calendar with courses on document ready
//

$(document).ready(function() {
    $('#calendar-schedule').fullCalendar({
        header: {
            left: 'month,agendaWeek',
            center: 'title',
            right: 'prev,next'
        },
        height: 800,
        defaultView: 'agendaWeek',
        events: createFullCalendarEventsForSchedule(studentData),
        eventClick: function(event) {
            alert(event.title + " Information: Not available!");
        }
    })
});
