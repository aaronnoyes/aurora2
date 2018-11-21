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
function updateSecurityQuestion(oldQuestion, newQuestion) {
    studentData.securityQuestions.forEach(securityQuestion => {
        if (securityQuestion.question === oldQuestion) {
            securityQuestion.question = newQuestion;
        }
    });
}

function displaySecurityQuestion(){
    var select = document.getElementById("question1-select");
    for (var i = 0; i < studentData.securityQuestions.length; i++) {
        var question = studentData.securityQuestions[i];
        var opt = document.createElement("option");
        var text = document.createTextNode(question);
        opt.appendChild(question);
        select.appendChild(opt);
    }
}

displaySecurityQuestion();