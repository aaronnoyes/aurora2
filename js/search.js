$(document).ready(function(){

  var fullFallCourseList = fall2018Courses.courses;
  var fullWinterCourseList = winter2019Courses.courses;
  var workingCourseList = [];
  var searchTerm = "";

  //hot udpate search filter
  $("#course-search").bind('input', function(){
      searchTerm = $(this).val().toUpperCase();
      console.log(searchTerm);

      li = $('li').toArray();

      for (i = 0; i < li.length; i++) {
        if (li[i].innerHTML.toUpperCase().indexOf(searchTerm) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
      }
  });

  //change search term
  $("#term-select").change(function () {
    $('#course-list').empty();

    console.log($(this).val());
    console.log("term select changed, cleared course list")

    if ($(this).val() == "w2019") {
      appendAllCourses(fullWinterCourseList);
      console.log('added winter courses');
    }
    else {
      appendAllCourses(fullFallCourseList);
      console.log('added fall courses');
    }
  });

  //changed course level
  $("#level-select").change(function () {

    console.log($(this).val());
    var level = $(this).val()[0];
    // var lastFive = id.substr(id.length - 5);
    var courseNumber = "";
    var courseName = "";
    var re = new RegExp('');

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
        re = re = new RegExp('*');;
    }

    li = $('li').toArray();

    for (i = 0; i < li.length; i++) {
      courseName = li[i].innerHTML.toUpperCase();
      courseNumber = courseName.substr(courseName.length - 4);

      if(!re.test(courseNumber)) {
        li[i].style.display = "none";
      }
      else {
        li[i].style.display = "";
      }

    }
  });

  //add all courses to the ul
  function appendAllCourses(courseList) {
    //loop through each course in list
    for(var i=0; i < courseList.length; i++) {
      $('#course-list').append('<li>'+courseList[i].courseID+'</li>');
    }
  }

  appendAllCourses(fullWinterCourseList);



});
