//
// Functionality associated with student personal information page section
//

/**
 * Change one of the student's security from the old question to the new question. The answer is
 * irrelevant, as it does not affect the view of the website (the answer is never displayed).
 * 
 * @param {string} oldQuestion: The old question itself (e.g., 'What is your childhood nickname?')
 * @param {string} newQuestion: The new question the user is updating to
 */
$(document).ready(function() {
$("#security-submit-button").click(function (){
    var updated = false;

    var q1 = document.getElementById("question1-select");
    var str1 = q1.options[q1.selectedIndex].value;
    if (studentData.securityQuestions[0].question !== str1) {
        studentData.securityQuestions[0].question = str1;
        updated = true;
    }

    var q2 = document.getElementById("question2-select");
    var str2 = q2.options[q2.selectedIndex].value;
    studentData.securityQuestions[1].question = str2;
    if (studentData.securityQuestions[1].question !== str2) {
        studentData.securityQuestions[1].question = str2;
        updated = true;
    }

    if (updated) {
        displayQuestions();
        $("#saved-alert").fadeTo(2000, 500).slideUp(500, function(){
            $("#saved-alert").slideUp(500);
        });
    }
});

function displayQuestions() {
        $("#opt1-selected").text(studentData.securityQuestions[0].question);
        $("#opt2-selected").text(studentData.securityQuestions[1].question);
        $('#answer-q1').val('');
        $('#answer-q2').val('');
}

function displayDetails(){
    $('#first-name').val(studentData.name);
    $('#input-address').val(studentData.studentDetails[0].address);
    $('#input-city').val(studentData.studentDetails[1].city);
    $('#input-postalCode').val(studentData.studentDetails[2].postalCode);
}

function displayFees(){
    var e = document.getElementById("personal-term-select");
    var strUser = e.options[e.selectedIndex].value;
    var numCourses = 0;
    for (var i = 0; i < studentData.enrolledCourses.length; i++){
        var term = studentData.enrolledCourses[i].term;
        if (strUser == term)
            numCourses++;
    }
    var fees = numCourses * 485.11;
    document.getElementById("term-fee").value = fees;
}

$(".selectChange").change(function (){
    displayFees();
});

$('a[data-toggle="pill"]').on('shown.bs.tab', function(e) {
    if (e.target.id === "pills-personal-tab") {
        displayQuestions();
        displayDetails();   
        displayFees();
    }
});
});
