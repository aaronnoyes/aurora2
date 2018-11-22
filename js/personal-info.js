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
// function updateSecurityQuestion(oldQuestion, newQuestion) {
//     studentData.securityQuestions.forEach(securityQuestion => {
//         if (securityQuestion.question === oldQuestion) {
//             securityQuestion.question = newQuestion;
//         }
//     });
// }

$("#security-submit-button").click(function (){
    alert("Security question successfully updated");
});

function displayQuestions(target) {
    for (var i = 0; i < studentData.securityQuestions.length; i++){
        var question = studentData.securityQuestions[i].question;
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = question;
        document.getElementById(target).appendChild(opt);
    }    
}

function displayDetails(){
    document.getElementById("first-name").value = studentData.name;
    document.getElementById("input-address").value = studentData.studentDetails[0].address;
    document.getElementById("input-city").value = studentData.studentDetails[1].city;
    document.getElementById("input-postalCode").value = studentData.studentDetails[2].postalCode;
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


displayQuestions('question1-select');
displayQuestions('question2-select');
displayDetails();
displayFees();
});
