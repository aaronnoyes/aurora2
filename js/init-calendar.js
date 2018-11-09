//// init-calendar.js
var fall2018TermStart = moment('2018-09-05');
var fall2018TermEnd = moment('2018-12-07');
var winter2019TermStart = moment('2019-01-07');
var winter2019TermEnd = moment('2019-04-09');

const dayOfTheWeekToNumber = {"U": 0, "M": 1, "T": 2, "W": 3, "R": 4, "F": 5, "S": 6};
function convertDaysToNumbers(dayArray) {
    return dayArray.map(day => dayOfTheWeekToNumber[day]);
}

/**
 * Create a Full Calendar representation for a student's course schedule.
 * @param {schedule} schedule
 */
function createFullCalendarEventsForSchedule(schedule) {
    let courseEvents = [];

    schedule.courses.forEach(studentCourse =>  {
        if (studentCourse.term === "FALL2018") {
            courseEvents = courseEvents.concat(getCourseEventsBetweenDates(studentCourse, fall2018TermStart, fall2018TermEnd));
        } else if (studentCourse.term === "WINTER2019") {
            courseEvents = courseEvents.concat(getCourseEventsBetweenDates(studentCourse, winter2019TermStart, winter2019TermEnd));
        } else {
            console.error("Term " + studentCourse.term + " is not supported.");
        }
    });

    return courseEvents;
}

/**
 * Create a list of events for a course that is between a start and an end date.
 * @param {Course} course
 * @param {moment} termStart
 * @param {moment} termEnd
 */
function getCourseEventsBetweenDates(course, termStart, termEnd) {
    var eventList = [];

    if (termStart.isAfter(termEnd)) {
        console.error("term start cannot be before term end time.");
        return eventList;
    }

    let justAfterTermEnd = moment(termEnd).add(1, 'second');

    // Format the course data
    let courseDays = convertDaysToNumbers(course.days.split(''));
    let courseStartTimeSplit = course.time.start.split(':').map(x => parseInt(x));
    let courseEndTimeSplit = course.time.end.split(':').map(x => parseInt(x));

    let currentDate = moment(termStart);

    while (currentDate.isBefore(termEnd)) {
        currentDayNumber = currentDate.day();
        courseDaysRelativeToCurrentDay = courseDays.map(day => day - currentDayNumber);

        courseDaysRelativeToCurrentDay.forEach(relativeDay => {

            let courseDate = moment(currentDate).add(relativeDay, 'days')

            if (relativeDay >= 0 && courseDate.isBefore(justAfterTermEnd)) {

                let courseStartTimeUTC = moment(courseDate)
                    .add(courseStartTimeSplit[0], 'hours')
                    .add(courseStartTimeSplit[1], 'minutes')
                    .format();

                let courseEndTimeUTC = moment(courseDate)
                    .add(courseEndTimeSplit[0], 'hours')
                    .add(courseEndTimeSplit[1], 'minutes')
                    .format();
                
                eventList.push({
                    title: course.courseID,
                    start: courseStartTimeUTC,
                    end: courseEndTimeUTC
                });
            }
        });

        currentDate.add(1, 'week').startOf('week');
    }

    return eventList;
}

// Display the calendar with courses on document ready
$(document).ready(function() {
    $('#calendar-schedule').fullCalendar({
        header: {
            left: 'month,agendaWeek',
            center: 'title',
            right: 'prev,next'
        },
        defaultView: 'agendaWeek',
        events: createFullCalendarEventsForSchedule(studentSchedule),
        eventClick: function(event) {
            alert(event.title + " Information: Not available!");
        }
    })
});
