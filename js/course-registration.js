//
// Functionality associated with student's schedule and registering for courses
//

var fall2018TermStart = moment('2018-09-05');
var fall2018TermEnd = moment('2018-12-07');
var winter2019TermStart = moment('2019-01-07');
var winter2019TermEnd = moment('2019-04-09');

var calendarEvents = [];

const dayOfTheWeekToNumber = {"U": 0, "M": 1, "T": 2, "W": 3, "R": 4, "F": 5, "S": 6};

function convertDaysToNumbers(dayArray) {
    return dayArray.map(day => dayOfTheWeekToNumber[day]);
}


/**
 * Get all of the courses in the user's schedule that conflict with the course to be registered
 * for.
 * @returns {Course[]} List of courses that conflict with new course. Empty if no conflicts.
 */
function getConflictingCourses(student, newCourse) {
    var conflictingClasses = [];

    if (student === null || student === undefined) {
        return conflictingClasses;
    }

    student.enrolledCourses.forEach(currentCourse => {
        if (isClassConflict(currentCourse, newCourse)) {
            conflictingClasses.push(currentCourse);
        }
    });

    return conflictingClasses;
}

function isClassConflict(currentCourse, newCourse) {
    return isTermConflict(currentCourse, newCourse) &&
        isDayConflict(currentCourse, newCourse)	&&
        isTimeConflict(currentCourse, newCourse);
}

function isTermConflict(currentCourse, newCourse) {
    return currentCourse.term === newCourse.term;
}

function isDayConflict(currentCourse, newCourse) {
    var currentCourseDays = currentCourse.days.split('');
    var newCourseDays = newCourse.days.split('');

    if (newCourseDays.some(x => currentCourseDays.includes(x))) {
        return true;
    } else {
        return false;
    }
}

function isTimeConflict(currentCourse, newCourse) {
    newCourseStartTime = parseInt(newCourse.time.start.replace(':', ''));
    newCourseEndTime = parseInt(newCourse.time.end.replace(':', ''));

    currentCourseStartTime = parseInt(currentCourse.time.start.replace(':', ''));
    currentCourseEndTime = parseInt(currentCourse.time.end.replace(':', ''));

    // Conflict if start time of new course is in current course time range, OR
    // if end time of new course is in current course time range, OR
    // if new course time range completely covers current course time range
    return (newCourseStartTime >= currentCourseStartTime && newCourseStartTime <= currentCourseEndTime) ||
        (newCourseEndTime >= currentCourseStartTime && newCourseEndTime <= currentCourseEndTime) ||
        (newCourseStartTime <= currentCourseStartTime && newCourseEndTime >= currentCourseEndTime);
}

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

    addCourseToSchedule(studentData, course);
}

/**
 * Add a course to the student's schedule.
 */
function addCourseToSchedule(student, course) {
    var conflictingCourses = getConflictingCourses(student, course);

    if (conflictingCourses.length === 0) {
        student.enrolledCourses.push(JSON.parse(JSON.stringify(course)));
        calendarEvents = createFullCalendarEventsForSchedule(studentData);

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
function createFullCalendarEventsForSchedule(student) {
    let courseEvents = [];

    student.enrolledCourses.forEach(studentCourse =>  {
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
