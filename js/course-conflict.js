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

    currentSchedule.courses.forEach(currentCourse => {
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

