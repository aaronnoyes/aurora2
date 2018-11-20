$(document).ready(function(){

  var fullFallCourseList = fall2018Courses.courses;
  var fullWinterCourseList = winter2019Courses.courses;
  var workingCourseList = [];
  var searchTerm = "";
  var re = new RegExp('.*');
  var activeResult = "";

  //hot udpate search filter
  $("#course-search").bind('input', function(){
      searchTerm = $(this).val().toUpperCase();

      filterCourses();
  });

  //change search term
  $("#term-select").change(function () {
    $('#course-list').empty();

    if ($(this).val() == "w2019") {
      appendAllCourses(fullWinterCourseList);
    }
    else {
      appendAllCourses(fullFallCourseList);
    }

    filterCourses();
  });

  //changed course level
  $("#level-select").change(function () {

    console.log($(this).val());
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
        re = new RegExp('.*');;
    }

    filterCourses();
  });

  function filterCourses() {
    var courseNumber = "";
    var courseName = "";
    li = $('div.search-result').toArray();

    for (i = 0; i < li.length; i++) {
      courseName = li[i].id.toUpperCase();
      courseNumber = courseName.substr(courseName.length - 4);
      // console.log("*NAME: " + courseName);
      // console.log("*NUMBER: " + courseNumber);

      if(re.test(courseNumber) && courseName.indexOf(searchTerm) > -1){
        li[i].style.display = "";
        // console.log("\t MATCHES")
      }
      else {
        li[i].style.display = "none";
        // console.log("\t DOES NOT MATCH")
      }

    }
  }

  //add all courses to the ul
  function appendAllCourses(courseList) {
    //loop through each course in list
    for(var i=0; i < courseList.length; i++) {
      $('#course-list').append('<div class="search-result" id="' + courseList[i].courseID +'">' +
      '<h5 class="search-result-title">' + courseList[i].courseID + ': </h5>' +
      courseList[i].name +
      '<button class="view-button">View' +
      '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAh0lEQVQ4T93TMQrCUAzG8V9x8QziiYSuXdzFC7h4AcELOPQAdXYovZCHEATlgQV5GFTe1ozJlz/kS1IpjKqw3wQBVyy++JI0y1GTe7DCBbMAckeNIQKk/BanALBB+16LtnDELoMcsM/BESDlz2heDR3WePwKSLo5eoxz3z6NNcFD+vu3ij14Aqz/DxGbKB7CAAAAAElFTkSuQmCC"></img>' +
      '</button>' +
      '</div>');
    }
  }

  appendAllCourses(fullWinterCourseList);



});
