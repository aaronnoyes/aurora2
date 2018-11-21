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
function updateSecurityQuestion(oldQuestion, newQuestion) {
    studentData.securityQuestions.forEach(securityQuestion => {
        if (securityQuestion.question === oldQuestion) {
            securityQuestion.question = newQuestion;
        }
    });
}

function displayText(target) {
    for (var i = 0; i < studentData.securityQuestions.length; i++){
        var question = studentData.securityQuestions[i].question;
        var opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = question;
        document.getElementById(target).appendChild(opt);
    }
    console.log(question);
    
}

displayText('question1-select');
displayText('question2-select');

});
