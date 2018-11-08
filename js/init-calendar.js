// These dates will be needed to calculate a students relative schedule.
// This is because we are only storing the days of the week a course lands on, and the specific term
// the class is for.
var fall2018TermStart = moment('2018-09-05');
var fall2018TermEnd = moment('2018-12-07');
var winter2019TermStart = moment('2019-01-07');
var winter2019TermEnd = moment('2019-04-09');

// Utility to convert an array of day names to day numbers. Note that U represents Sunday
const dayOfTheWeekToNumber = {"U": 0, "M": 1, "T": 2, "W": 3, "R": 4, "F": 5, "S": 6};
function convertDaysToNumbers(dayArray) {
    return dayArray.map(day => dayOfTheWeekToNumber[day]);
}

// Create two sample classes for today's date
var sampleStartDate = moment().startOf('day').add(parseInt('08'), 'hours').add(parseInt('30'), 'minutes');
var sampleEndDate = moment().startOf('day').add(parseInt('09'), 'hours').add(parseInt('20'), 'minutes');

// This is the format required by calendar.js
courses = [
{
    title: "COMP3020",
    start: sampleStartDate.format(),
    end: sampleEndDate.format(),
},
{
    title: "COMP3380",
    start: sampleStartDate.add(1, 'hours').format(),
    end: sampleEndDate.add(1, 'hours').format(),
}]


/**
 * NOTES: to create the student's actual event list
 *
 * foreach course in schedule.courses:
 *     foreach week between the start and the end of the term: (I don't know how to do this yet.)
 *         foreach day of the week the course lands on:
 *             if course date is not before or after the term ends:
 *                 create a new event object.
 *                 populate the event's title with the courseID.
 *                 create the times from the week PLUS the day of the week days PLUS the course start/end hours and minutes
 *                 add the event object to the event list for fullcalendar.
 */

// Display the calendar with courses on document ready
$(document).ready(function() {
    $('#calendar-schedule').fullCalendar({
        header: {
            left: 'month,agendaWeek',
            center: 'title',
            right: 'prev,next'
        },
        defaultView: 'agendaWeek',
        events: courses
    })
});
