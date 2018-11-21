//
// Display the calendar with courses on document ready
//

$(document).ready(function () {
    $('#calendar-schedule').fullCalendar({
        header: {
            left: 'month,agendaWeek',
            center: 'title',
            right: 'prev,next'
        },
        height: 750,
	minTime: "07:00:00",
	maxTime: "21:00:00",
        defaultView: 'agendaWeek',
        events: createFullCalendarEventsForSchedule(studentData),
        eventClick: function (event) {
            alert(event.title + " Information: Not available!");
        }
    })

	// Show the calendar when the page is loaded
    $('#pills-schedule-tab').tab('show')

    // Hide the schedule when other tabs are active
    $('a[data-toggle="pill"]').on('show.bs.tab', function (e) {
        if (e.target.id != "pills-schedule-tab") {
            $("#calendar-schedule").hide();
        } else {
            $("#calendar-schedule").fadeIn(500);
            $("#calendar-schedule").fullCalendar('rerenderEvents');
        }
    })
});
