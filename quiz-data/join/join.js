document.getElementById('joinQuizForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const quizCode = document.getElementById('quizCode').value;
    const username = document.getElementById('username').value;

    if (quizCode && username) {
        document.getElementById('message').textContent = `Joining quiz with code: ${quizCode} as ${username}`;
        document.getElementById('message').style.color = '#28a745';
    } else {
        document.getElementById('message').textContent = 'Please enter a valid quiz code and username.';
        document.getElementById('message').style.color = '#ff4d4d';
    }
});
// Inside join.js
document.getElementById('joinQuizForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const quizCode = document.getElementById('quizCode').value.trim();
    const username = document.getElementById('username').value.trim();

    // Retrieve quizzes from localStorage
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];

    // Check if the quiz ID exists
    const quizExists = quizzes.some(quiz => quiz.id === quizCode);

    if (quizExists) {
        // Redirect to show-quiz.html with the quiz ID as a parameter
        window.location.href = `../show/show.html?quizId=${encodeURIComponent(quizCode)}`;
      } else {
        alert('Quiz not found. Please check the quiz code and try again.');
    }
});