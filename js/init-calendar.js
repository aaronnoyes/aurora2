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
        height: 800,
        defaultView: 'agendaWeek',
        events: createFullCalendarEventsForSchedule(studentData),
        eventClick: function (event) {
            alert(event.title + " Information: Not available!");
        }
    })

    $('#pills-schedule-tab').tab('show')

    //hide the schedule when other tabs are active
    $('a[data-toggle="pill"]').on('show.bs.tab', function (e) {
        e.target; // newly activated tab
        e.relatedTarget; // previous active tab

        if (e.target.id != "pills-schedule-tab") {
            $("#calendar-schedule").hide();
        } else {
            console.log("show calendar")
            $("#calendar-schedule").fadeIn(500);
        }
    })
});