$(document).ready(function(){

  var fullFallCourseList = fall2018Courses.courses;
  var fullWinterCourseList = winter2019Courses.courses;
  var workingCourseList = fullWinterCourseList;
  var curTerm = "WINTER2019";
  var searchTerm = "";
  var re = new RegExp('.*');
  var buttonIdRegex = new RegExp(/BUTTON\-/)
  var activeDropdown = null;


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
          <span>Department: ${course.department}</span>
          <br/>
          <span>Credits: ${course.credits}</span>
          <br/>
          <span>Section: </span>
          <select id="${courseIDNoSpaces}-section-select" class="dropwdown section-select">
            ${generateSectionsOptions(course.sections)}
          </select>
          <br/>
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
    return `
    <div id="${id}-section-${section.section}" class="section-div">
      <span>Days: ${section.days}</span>
      <br/>
      <span>Instructor: ${section.instructor}</span>
      <br/>
      <span>Location: ${section.location}</span>
      <br/>
      <span>Time: ${section.time.start} - ${section.time.end}</span>
      <br/>
      <button class="register-button" id="${id}-register-btn-${section.section}">Register</button>
    </div>`
  }

  //show only section chosen from dropdown
  $("ul#course-list").on('change', ".section-select", function(e) {
    var parentID = $(this).parent().attr('id').split("-")[1];
    var idToShow = `${parentID}-section-${$(this).val()}`;
    var sectionDivs = $(this).siblings("div");

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
    sectionDivs = $(`#${id}-section-select`).siblings("div");

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
        $(activeDropdown).children("div").remove(); //remove sections from div
      }

      if(activeDropdown != dropdownIdSelector) {
        activeDropdown = dropdownIdSelector;

        $(activeDropdown).addClass("active");
        $(activeDropdown).siblings("button").html("Hide");
        $(activeDropdown).append(generateSectionsDivs(sections, id));
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
      var cIDWithSpace = cID.replace(/([A-Z]+)([1-9]+)/g, '$1 $2');
      var course = workingCourseList.find(function(element) {
        return element.courseID == cIDWithSpace;
      });

      var section = course.sections.find(function(element) {
        return element.section == e.target.id.split("-")[3];
      });
      var formattedCourse = {
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
      console.log(formattedCourse);
      addCourseToSchedule(student, formattedCourse);
    }
  });

  appendCoursesToList(workingCourseList);
});
