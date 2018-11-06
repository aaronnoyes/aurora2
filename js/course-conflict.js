/**
 * Get all of the courses in the user's schedule that conflict with the course to be registered
 * for.
 *
 * @param {Schedule} currentSchedule
 * @param {Course} newCourse
 * @returns {Course[]} List of courses that conflict with new course. Empty if no conflicts.
 */
function getConflictingCourses(currentSchedule, newCourse) {
    var conflictingClasses = [];

    if (currentSchedule === null || currentSchedule === undefined) {
        return conflictingClasses;
    }

    for (var currentCourse in currentSchedule.courses) {
        if (isClassConflict(currentCourse, newCourse)) {
            confictingClasses.push(currentCourse);
        }
    }

    return conflictingClasses;
}

function isClassConflict(currentCourse, newCourse) {
    // Classes conflict if they are in the same term, on the same day, at the same time
    return isTermConflict(currentCourse, newCourse) &&
        isDayConflict(currentCourse, newCourse)	&&
        isTimeConflict(currentCourse, newCourse);
}

function isTermConflict(currentCourse, newCourse) {
    return currentCourse.term === newCourse.term;
}

function isDayConflict(currentCourse, newCourse) {
    var dayConflict = false;
    var currentCourseDays = currentCourse.days.split('');
    var newCourseDays = newCourse.days.split('');

    for (var newCourseDay in newCourseDays) {
        if (currentCourseDays.includes(newCourseDay)) {
            dayConflict = true;
            break;
        }
    }

    return dayConflict;
}

function isTimeConflict(currentCourse, newCourse) {
    newCourseStartTime = parseInt(newCourse.time.start);
    newCourseEndTime = parseInt(newCourse.time.end);

    currentCourseStartTime = parseInt(currentCourse.time.start);
    currentCourseEndTime = parseInt(currentCourse.time.end);

    // Conflict if start time of new course is in current course time range, OR
    // if end time of new course is in current course time range, OR
    // if new course time range completely covers current course time range
    return (newCourseStartTime >= currentCourseStartTime && newCourseStartTime <= currentCourseEndTime) ||
        (newCourseEndTime >= currentCourseStartTime && newCourseEndTime <= currentCourseEndTime) ||
        (newCourseStartTime <= currentCourseStartTime && newCourseEndTime >= currentCourseEndTime);
}

