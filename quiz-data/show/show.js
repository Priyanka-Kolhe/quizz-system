document.addEventListener('DOMContentLoaded', function () {
    const LOCAL_STORAGE_KEY = 'quizzes';
    const TIME_PER_QUESTION = 40; // 40 seconds per question

    const quizDetailsElement = document.getElementById('quizDetails');
    const timerElement = document.getElementById('timer');
    const nextButton = document.getElementById('nextButton');
    const scoreElement = document.getElementById('score');
    const joinQuizSection = document.getElementById('joinQuizSection'); // Reference to the Join Quiz Section

    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let quiz;

    // Function to get URL parameters
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Function to fetch quiz data from localStorage
    function fetchQuizData(quizId) {
        const quizzes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        return quizzes.find(q => q.id === quizId);
    }

    // Function to display the current question
    function displayQuestion() {
        if (currentQuestionIndex < quiz.questions.length) {
            const question = quiz.questions[currentQuestionIndex];

            // Split options into two rows
            const optionsRow1 = question.options.slice(0, 2); // First two options
            const optionsRow2 = question.options.slice(2, 4); // Last two options

            quizDetailsElement.innerHTML = `
                <div class="question-box">
                    <h2>Question ${currentQuestionIndex + 1}: ${question.question}</h2>
                    <div class="options-container">
                        <div class="options-row">
                            ${optionsRow1.map((opt, optIndex) => `
                                <label class="option" data-index="${optIndex}">
                                    <input type="radio" name="answer" value="${optIndex}">
                                    ${opt}
                                </label>
                            `).join('')}
                        </div>
                        <div class="options-row">
                            ${optionsRow2.map((opt, optIndex) => `
                                <label class="option" data-index="${optIndex + 2}">
                                    <input type="radio" name="answer" value="${optIndex + 2}">
                                    ${opt}
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    <div class="button-container">
                        <button id="nextButton">${currentQuestionIndex === quiz.questions.length - 1 ? 'Submit' : 'Next'}</button>
                    </div>
                </div>
            `;

            // Add event listeners to options
            const options = document.querySelectorAll('.option');
            options.forEach(option => {
                option.addEventListener('click', () => {
                    // Remove 'selected' class from all options
                    options.forEach(opt => opt.classList.remove('selected'));
                    // Add 'selected' class to the clicked option
                    option.classList.add('selected');
                });
            });

            startTimer();
        } else {
            endQuiz();
        }
    }

    // Function to start the timer
    function startTimer() {
        let timeLeft = TIME_PER_QUESTION;
        timerElement.textContent = `Time Left: ${timeLeft} seconds`;

        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `Time Left: ${timeLeft} seconds`;

            if (timeLeft <= 0) {
                clearInterval(timer);
                nextQuestion();
            }
        }, 1000);
    }

    // Function to handle the next question or submit the quiz
    function nextQuestion() {
        clearInterval(timer); // Stop the current timer
        checkAnswer(); // Check the answer before moving to the next question

        if (currentQuestionIndex < quiz.questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        } else {
            endQuiz();
        }
    }

    // Function to check the selected answer
    function checkAnswer() {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        if (selectedOption) {
            const selectedAnswerIndex = parseInt(selectedOption.value);
            const correctAnswerIndex = quiz.questions[currentQuestionIndex].correctOption;
            if (selectedAnswerIndex === correctAnswerIndex) {
                score++;
            }
        }
    }

    // Function to end the quiz and display the score
    function endQuiz() {
        quizDetailsElement.innerHTML = `
            <div class="quiz-completion">
                <h2>Quiz Completed!</h2>
                <h3>Your Score: ${score} out of ${quiz.questions.length}</h3>
            </div>
        `;
        timerElement.classList.add('hidden');
        nextButton.classList.add('hidden');
        scoreElement.classList.remove('hidden');
    }

    // Initialize the quiz
    function initQuiz() {
        const quizId = getQueryParam('quizId');
        if (!quizId) {
            quizDetailsElement.innerHTML = '<p>No quiz ID provided.</p>';
            joinQuizSection.style.display = 'none'; // Hide Join Quiz section
            return;
        }

        quiz = fetchQuizData(quizId);
        if (!quiz) {
            quizDetailsElement.innerHTML = '<p>Quiz not found.</p>';
            joinQuizSection.style.display = 'none'; // Hide Join Quiz section if quiz not found
            return;
        }

        // Hide Join Quiz section if quiz starts
        joinQuizSection.style.display = 'none';

        // Display the first question
        displayQuestion();

        // Event delegation for the Next/Submit button
        quizDetailsElement.addEventListener('click', function (e) {
            if (e.target && e.target.id === 'nextButton') {
                nextQuestion();
            }
        });
    }

    // Start the quiz
    initQuiz();
});
