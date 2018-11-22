$(document).ready(function(){

  var fullFallCourseList = fall2018Courses.courses;
  var fullWinterCourseList = winter2019Courses.courses;
  var workingCourseList = fullWinterCourseList;
  var curTerm = "WINTER2019";
  var searchTerm = "";
  var re = new RegExp('.*');
  var buttonIdRegex = new RegExp(/BUTTON\-/)
  var activeDropdown = null;

  $('[data-toggle="tooltip"]').tooltip(); //enable tooltips


  //hot udpate search filter
  $("#course-search").bind('input', function(){
      searchTerm = $(this).val().toUpperCase();
      filterCourses();
  });

  //change search term
  $("#term-select").change(function () {
    $('#course-list').empty();

    if ($(this).val() == "w2019") {
      appendCoursesToList(fullWinterCourseList);
      workingCourseList = fullWinterCourseList;
      curTerm = "WINTER2019";
    }
    else {
      appendCoursesToList(fullFallCourseList);
      workingCourseList = fullFallCourseList;
      curTerm = "FALL2018";
    }

    filterCourses();
  });

  //changed course level
  $("#level-select").change(function () {

    var level = $(this).val()[0];
    // var lastFive = id.substr(id.length - 5);


    switch (level) {
      case "0":
        re = new RegExp('[0][0-9]{3}');
        break;
      case "1":
        re = new RegExp('[1][0-9]{3}');
        break;
      case "2":
        re = new RegExp('[2][0-9]{3}');
        break;
      case "3":
        re = new RegExp('[3][0-9]{3}');
        break;
      case "4":
        re = new RegExp('[4][0-9]{3}');
        break;
      default:
        re = new RegExp('.*');

    }

    filterCourses();
  });

  function filterCourses() {
    var courseNumber = "";
    var courseName = "";
    courseListItems = $('div.search-result').toArray();

    courseListItems.forEach(courseItem => {
      courseName = courseItem.id.toUpperCase();
      courseNumber = courseName.substr(courseName.length - 4);

      if(re.test(courseNumber) && courseName.indexOf(searchTerm) > -1){
        courseItem.style.display = "";
      }
      else {
        courseItem.style.display = "none";
      }
    });
  }

  function appendCoursesToList(courseList) {
    courseList.forEach(course => {
      $('#course-list').append(getCourseMarkup(course));
    });
  }

  function getCourseMarkup(course) {
    // IDs are not allowed to have spaces in them
    var courseIDNoSpaces = course.courseID.replace(' ', '');

    return `
      <div class="search-result" id="${courseIDNoSpaces}">
        <h5 class="search-result-title">${course.courseID}: ${course.name}</h5>
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
    var disabled = false;

    if(getConflictingCourses(studentData, formattedCourse).length > 0) {
      console.log("conflict")
      disabled = true;
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
      ${getProperButton(disabled, id, section.section)}
    </div>`
  }

  //returns either disabled button or normal button
  function getProperButton(disabled, cID, sID) {
    if(disabled) {
      return `
      <span style="width: 50%;" data-toggle="tooltip" title="Cannot Register Due To Time Conflict">
        <button disabled class="register-button" id="${cID}-register-btn-${sID}">Register</button>
      </span>`
    }
    else {
      return `
      <button class="register-button" id="${cID}-register-btn-${sID}">Register</button>
      `
    }
  }

  //show only section chosen from dropdown
  $("ul#course-list").on('change', ".section-select", function(e) {
    var parentID = $(this).attr('id').split("-")[0];
    var idToShow = `${parentID}-section-${$(this).val()}`;
    var sectionDivs = $(this).parent().parent().siblings("div.section-div");
    console.log($(this).parent());

    for(var i=0; i<sectionDivs.length; i++) {
      if(idToShow == sectionDivs[i].id) {
        sectionDivs[i].style.display = "";
      }
      else {
        sectionDivs[i].style.display = "none";
      }
    }
  });

  function initSectionSelectVisibility(id) {
    var first = true;
    sectionDivs = $(`#${id}-section-select`).parent().parent().siblings("div.section-div");
    console.log(id);
    console.log($(`#${id}-section-select`))

    for(var i=0; i<sectionDivs.length; i++) {
      if(first) sectionDivs[i].style.display = "";
      else sectionDivs[i].style.display = "none";
      first = false;
    }

  }

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
      //.prop("disabled", true)
      $(`#${cID}-register-btn-${sID}`).prop("disabled", true);
      $(`#${cID}-register-btn-${sID}`).wrap('<span style="width: 50%;" data-toggle="tooltip" title="Cannot Register Due To Time Conflict"></span>');
      // '<span class="d-inline-block" tabindex="0" data-toggle="tooltip" title="Disabled tooltip"></span>'
      $('[data-toggle="tooltip"]').tooltip({ trigger: "hover" });

      var formattedCourse = getCourse(cID, sID);
      addCourseToSchedule(student, formattedCourse);
    }
  });

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

  appendCoursesToList(workingCourseList);
});
