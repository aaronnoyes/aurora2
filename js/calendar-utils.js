//// init-calendar.js
var fall2018TermStart = moment('2018-09-05');
var fall2018TermEnd = moment('2018-12-07');
var winter2019TermStart = moment('2019-01-07');
var winter2019TermEnd = moment('2019-04-09');

const dayOfTheWeekToNumber = {"U": 0, "M": 1, "T": 2, "W": 3, "R": 4, "F": 5, "S": 6};
function convertDaysToNumbers(dayArray) {
    return dayArray.map(day => dayOfTheWeekToNumber[day]);
}

// List of events created from students courses.
var calendarEvents = createFullCalendarEventsForSchedule(studentSchedule);

function mockAddCourseToSchedule() {
    var course = {
        "name": "Practicum in ABA I",
        "courseID": "ABA 0100",
        "section": "A01",
        "days": "TR",
        "term": "FALL2018",
        "time": {
            "start": "10:30",
            "end": "11:45"
        }
    };

    addCourseToSchedule(studentSchedule, course);
}

/**
 * Add a course to the student's schedule.
 */
function addCourseToSchedule(schedule, course) {
    var conflictingCourses = getConflictingCourses(schedule, course);

    if (conflictingCourses.length === 0) {
        schedule.courses.push(JSON.parse(JSON.stringify(course)));
        calendarEvents = createFullCalendarEventsForSchedule(studentSchedule);

        $('#calendar-schedule').fullCalendar('removeEvents');
        $('#calendar-schedule').fullCalendar('addEventSource', calendarEvents);
    }
    else {
        alert('Couldn\'t add new course due to time conflict');
    }
}

/**
 * Create a Full Calendar representation for a student's course schedule.
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
        height: 800,
        defaultView: 'agendaWeek',
        events: calendarEvents,
        eventClick: function(event) {
            alert(event.title + " Information: Not available!");
        }
    })
});
