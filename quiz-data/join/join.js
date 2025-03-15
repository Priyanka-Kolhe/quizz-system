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