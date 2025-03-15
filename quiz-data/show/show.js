document.addEventListener("DOMContentLoaded", function () {
    const quizTitle = document.getElementById('quizTitle');
    const quizDescription = document.getElementById('quizDescription');
    const questionText = document.getElementById('questionText');
    const optionsList = document.getElementById('optionsList');
    const timerDisplay = document.getElementById('time');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    const resultContainer = document.getElementById('resultContainer');
    const scoreDisplay = document.getElementById('score');
    const totalQuestionsDisplay = document.getElementById('totalQuestions');

    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let quizData;

    // Fetch quiz data from localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quizId');
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    quizData = quizzes.find(q => q.id === quizId);

    if (!quizData) {
        alert("Quiz not found!");
        window.location.href = "../../home-detail/home.html";
        return;
    }

    // Display quiz title and description
    quizTitle.textContent = quizData.title;
    quizDescription.textContent = quizData.description;

    // Start the quiz
    loadQuestion();

    // Load a question
    function loadQuestion() {
        if (currentQuestionIndex >= quizData.questions.length) {
            endQuiz();
            return;
        }

        const question = quizData.questions[currentQuestionIndex];
        questionText.textContent = question.question;
        optionsList.innerHTML = question.options.map((opt, index) => `
            <li data-index="${index}">${opt}</li>
        `).join('');

        // Start the timer
        startTimer(40);
    }

    // Start the timer
    function startTimer(seconds) {
        let timeLeft = seconds;
        timerDisplay.textContent = timeLeft;

        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timer);
                handleTimeout();
            }
        }, 1000);
    }

    // Handle timeout
    function handleTimeout() {
        alert("Time's up! Moving to the next question.");
        currentQuestionIndex++;
        loadQuestion();
    }

    // Handle option selection
    optionsList.addEventListener('click', function (e) {
        if (e.target.tagName === 'LI') {
            const selectedOptionIndex = e.target.getAttribute('data-index');
            const correctAnswerIndex = 0; // Assuming the first option is the correct answer

            if (selectedOptionIndex == correctAnswerIndex) {
                score++;
            }

            clearInterval(timer); // Stop the timer
            currentQuestionIndex++;
            loadQuestion();
        }
    });

    // Handle next question button
    nextQuestionBtn.addEventListener('click', function () {
        clearInterval(timer); // Stop the timer
        currentQuestionIndex++;
        loadQuestion();
    });

    // End the quiz
    function endQuiz() {
        clearInterval(timer);
        document.getElementById('questionContainer').classList.add('hidden');
        resultContainer.classList.remove('hidden');
        scoreDisplay.textContent = score;
        totalQuestionsDisplay.textContent = quizData.questions.length;
    }
});