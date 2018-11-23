var fullFallCourseList = fall2018Courses.courses;
var fullWinterCourseList = winter2019Courses.courses;
var curTerm = "FALL2018";
var searchTerm = "";
var searchDepartment = "";
var courseNumberRegex = new RegExp('.*');
var buttonIdRegex = new RegExp(/BUTTON\-/)
var activeDropdown = null;

var maxNumberCourses = 10;
var workingCourseList = fullFallCourseList;
var currentNumberCoursesDisplayed = 0;

function updateWorkingTerm() {
  //default reload working term when page is loaded
  if ($("#term-select").val() == "w2019") {
    workingCourseList = fullWinterCourseList;
    curTerm = "WINTER2019";
  }
  else {
    workingCourseList = fullFallCourseList;
    curTerm = "FALL2018";
  }
}

function filterCourses() {
  if (curTerm == "WINTER2019") {
    filterCoursesAndRerender(fullWinterCourseList);
  } else {
    filterCoursesAndRerender(fullFallCourseList);
  }
}

function filterCoursesAndRerender(courseList) {
  workingCourseList = courseList.filter(function(course) {
    // Reformat course info to compare to user's filters
    courseName = (course.courseID + course.name).replace(/:|\ /g, '').toUpperCase();
    courseDepartment = course.department.replace(/\ /g, '').toUpperCase();

    return courseName.includes(searchTerm) &&
      courseDepartment.includes(searchDepartment) &&
      courseNumberRegex.test(course.courseID);
  });

  rerenderCourseList(workingCourseList, maxNumberCourses)
}

function rerenderCourseList(courseList, numCourses) {
  // We are RE-rendering, so empty the course list first
  $('#course-list').empty();

  // If the number of courses is greater than the number to be displayed, create a button to show
  // more only if the user wants to see more.
  if (courseList.length > numCourses) {
    for (var i = 0; i < numCourses; i++) {
      $('#course-list').append(getCourseMarkup(courseList[i]));
    }

    // This button allows the user to show more courses if they would like.
    $('#course-list').append(`
    <div class="row text-center">
      <br/>
      <button class="btn btn-default" onclick="rerenderCourseList(workingCourseList, currentNumberCoursesDisplayed + maxNumberCourses)" style="width: 50%;">More</button>
    </div>`);

    currentNumberCoursesDisplayed = numCourses;
  }
  // Otherwise, show all courses without a button
  else {
    for (var i = 0; i < courseList.length; i++) {
      $('#course-list').append(getCourseMarkup(courseList[i]));
    }

    currentNumberCoursesDisplayed = courseList.length;
  }
}

function getCourseMarkup(course) {
    // IDs are not allowed to have spaces in them
    var courseIDNoSpaces = course.courseID.replace(' ', '');

  return `
    <div class="search-result" id="${courseIDNoSpaces}">
      <h5 class="search-result-title"><b>${course.courseID}: ${course.name}</b></h5>
      <div class="expanded-placeholder" id="DROPDOWN-${courseIDNoSpaces}">
        <div class="general-description">
          <span class="section-label">
            Section:
            <select id="${courseIDNoSpaces}-section-select" class="dropwdown section-select">
              ${generateSectionsOptions(course.sections)}
            </select>
          </span>
          <span class="department-label">Department: ${course.department}</span>
          <span class="credits-label">Credits: ${course.credits}</span>
          <span> </span>
          <span> </span>
          <span> </span>
          <span> </span>
        </div>
      </div>
      <button class="view-button" id="BUTTON-${courseIDNoSpaces}">
        View
      </button>
    </div>`
}

//generate the dropdown options for course sections
function generateSectionsOptions(sections) {
  var options = "";
  for(var i=0; i<sections.length; i++) {
    options += `<option value="${sections[i].section}">${sections[i].section}</option>`;
  }
  return options;
}

//generate the info for each section in course
function generateSectionsDivs(sections, id) {
  var sectionsDiv = "";
  for(var i=0; i<sections.length; i++) {
    sectionsDiv += generateSectionDiv(sections[i], id);
    first = false;
  }
  return sectionsDiv;
}

//generate info for an individual course section
function generateSectionDiv(section, id) {
  var formattedCourse = getCourse(id, section.section);
  var buttonMarkup = "";

  if (studentIsRegisteredInCourse(studentData, id)) {
    buttonMarkup = getCourseConflictRegisterButton(id, section.section);
  }
  else if (getConflictingCourses(studentData, formattedCourse).length > 0) {
    buttonMarkup = getTimeConflictRegisterButton(id, section.section);
  }
  else {
    buttonMarkup = getRegisterButton(id, section.section);
  }

  return `
  <div id="${id}-section-${section.section}" class="section-div">
    <span class="days-label">Days: ${section.days}</span>
    <br/>
    <span class="instructor-label">Instructor: ${section.instructor}</span>
    <br/>
    <span class="location-label">Location: ${section.location}</span>
    <br/>
    <span class="time-label">Time: ${section.time.start} - ${section.time.end}</span>
    <br/>
    ${buttonMarkup}
  </div>`
}

function getRegisterButton(cID, sID) {
  return `<button class="register-button" id="${cID}-register-btn-${sID}">Register</button>`;
}

function getTimeConflictRegisterButton(cID, sID) {
    return `
    <span style="width: 50%;" data-toggle="tooltip" title="Cannot Register Due To Time Conflict">
      <button disabled class="register-button" id="${cID}-register-btn-${sID}">Register</button>
    </span>`
}

function getCourseConflictRegisterButton(cID, sID) {
    return `
    <span style="width: 50%;" data-toggle="tooltip" title="Already registered in ${cID}">
      <button disabled class="register-button" id="${cID}-register-btn-${sID}">Register</button>
    </span>`
}

function initSectionSelectVisibility(id) {
  var first = true;
  sectionDivs = $(`#${id}-section-select`).parent().parent().siblings("div.section-div");
  // console.log(id);
  // console.log($(`#${id}-section-select`))

  for(var i=0; i<sectionDivs.length; i++) {
    if(first) sectionDivs[i].style.display = "";
    else sectionDivs[i].style.display = "none";
    first = false;
  }

}

function formatCourse(course, sectionID) {
  var section = course.sections.find(function(element) {
    return element.section == sectionID;
  });
  return {
      name: course.name,
      courseID: course.courseID,
      days: section.days,
      term: curTerm,
      section: section.section,
      time: {
          start: section.time.start,
          end: section.time.end
      }
  };
}

//return formatted course object using course and section ID
function getCourse(cID, sID) {
  var cIDWithSpace = cID.replace(/([A-Z]+)([1-9]+)/g, '$1 $2'); //format cID like in course list
  var course = workingCourseList.find(function(element) {
    return element.courseID == cIDWithSpace;
  });
  return formatCourse(course, sID);
}

/***************************************************************************************************
 * ON DOCUMENT READY ...
 **************************************************************************************************/
$(() => {
  $('[data-toggle="tooltip"]').tooltip(); //enable tooltips
  $("#success-alert").hide();
  updateWorkingTerm();

  //hot udpate search filter
  $("#course-search").bind('input', function(){
      searchTerm = $(this).val();
      searchTerm = searchTerm.replace(/\ /g, '').toUpperCase();
      filterCourses();
  });

  //hot udpate search filter
  $("#department-search").bind('input', function(){
      searchDepartment = $(this).val().toUpperCase().replace(/\ /g, '');
      filterCourses();
  });

  //change search term
  $("#term-select").change(function () {
    $('#course-list').empty();

    if ($(this).val() == "w2019") {
      workingCourseList = fullWinterCourseList;
      rerenderCourseList(workingCourseList, maxNumberCourses);
      curTerm = "WINTER2019";
    }
    else {
      workingCourseList = fullFallCourseList;
      rerenderCourseList(workingCourseList, maxNumberCourses);
      curTerm = "FALL2018";
    }

    filterCourses();
  });

  //changed course level
  $("#level-select").change(function () {
    var optionValue = $(this).val().toUpperCase();
    courseNumberRegex = optionValue === "ALL" ? new RegExp('.*') : new RegExp(`[${optionValue[0]}][0-9]{3}`);
    filterCourses();
  });

  //show only section chosen from dropdown
  $("ul#course-list").on('change', ".section-select", function(e) {
    var parentID = $(this).attr('id').split("-")[0];
    var idToShow = `${parentID}-section-${$(this).val()}`;
    var sectionDivs = $(this).parent().parent().siblings("div.section-div");
    // console.log($(this).parent());

    for(var i=0; i<sectionDivs.length; i++) {
      if(idToShow == sectionDivs[i].id) {
        sectionDivs[i].style.display = "";
      }
      else {
        sectionDivs[i].style.display = "none";
      }
    }
  });


  // Handles buttons being clicked
  $('ul#course-list').on('click', function(e) {
    // console.log(e.target.id.split("-"))

    //hide/show button clicked
    if (buttonIdRegex.test(e.target.id)) {

      //put space back in id for retreiving from course list
      var id = e.target.id.split("-")[1];
      var idWithSpace = id.replace(/([A-Z]+)([1-9]+)/g, '$1 $2');
      var sections = workingCourseList.find(function(element) {
        return element.courseID == idWithSpace;
      }).sections;

      var dropdownIdSelector = `#${e.target.id.replace('BUTTON-', 'DROPDOWN-')}`;

      if(activeDropdown != null) {
        $(activeDropdown).removeClass("active");
        $(activeDropdown).siblings("button").html("View");
        $(activeDropdown).children("div.section-div").remove(); //remove sections from div
      }

      if(activeDropdown != dropdownIdSelector) {
        activeDropdown = dropdownIdSelector;

        $(activeDropdown).addClass("active");
        $(activeDropdown).siblings("button").html("Hide");
        $(activeDropdown).append(generateSectionsDivs(sections, id));
        $('[data-toggle="tooltip"]').tooltip({ trigger: "hover" });
        initSectionSelectVisibility(id);
      }
      else {
        activeDropdown = null;
      }
    }

    //register button clicked
    else if (e.target.id.split("-")[1] == "register") {
      var student = studentData;
      var cID = e.target.id.split("-")[0];
      var sID = e.target.id.split("-")[3];
      $(`#${cID}-register-btn-${sID}`).prop("disabled", true);
      $(`#${cID}-register-btn-${sID}`).wrap(`<span style="width: 50%;" data-toggle="tooltip" title="Already registered in ${cID}"></span>`);
      $('[data-toggle="tooltip"]').tooltip({ trigger: "hover" });

      var formattedCourse = getCourse(cID, sID);
      addCourseToSchedule(student, formattedCourse);
      $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
        $("#success-alert").slideUp(500);
      });
    }
  });

  rerenderCourseList(workingCourseList, maxNumberCourses);
});
