document.addEventListener("DOMContentLoaded", function () {
    const LOCAL_STORAGE_KEY = 'quizzes';
    const homeTab = document.getElementById("homeTab");
    const addQuizTab = document.getElementById("addQuizTab");
    const addedQuizzesTab = document.getElementById("addedQuizzesTab");

    const homeContent = document.getElementById("homeContent");
    const addQuizContent = document.getElementById("addQuizContent");
    const quizDetailsContent = document.getElementById("quizDetailsContent");

    const dropdown = document.querySelector('.dropdown');
    const quizDropdown = document.getElementById('quizDropdown');
    const questionsContainer = document.getElementById('questionsContainer');
    const createQuizForm = document.getElementById('createQuizForm');

    // Show the selected content and hide others
    function showContent(contentToShow) {
        [homeContent, addQuizContent, quizDetailsContent].forEach(content => content.classList.add("hidden"));
        contentToShow.classList.remove("hidden");
    }

    // Tab navigation
    homeTab.addEventListener("click", event => { event.preventDefault(); showContent(homeContent); });
    addQuizTab.addEventListener("click", event => { event.preventDefault(); showContent(addQuizContent); });
    addedQuizzesTab.addEventListener("click", event => {
        event.preventDefault();
        showContent(quizDetailsContent);
        toggleDropdown();
    });

    // Toggle dropdown visibility
    function toggleDropdown() {
        quizDropdown.classList.toggle('active');
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (!dropdown.contains(e.target) && e.target !== addedQuizzesTab) {
            quizDropdown.classList.remove('active');
        }
    });

    // Generate a unique quiz ID
    function generateQuizId() {
        return 'quiz-' + Math.random().toString(36).substr(2, 9);
    }

    // Save quiz to localStorage
    function saveQuiz(quiz) {
        let quizzes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        quizzes.push(quiz);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quizzes));
    }

    // Add a new question
    document.getElementById('addQuestion').addEventListener('click', function () {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.innerHTML = `
            <input type="text" class="questionInput" placeholder="Enter question" required>
            <div class="options">
                ${Array(4).fill().map((_, i) => `
                    <input type="text" class="optionInput" placeholder="Option ${i + 1}" required>
                `).join('')}
                <label for="correctOption">Correct Option:</label>
                <select class="correctOption">
                    ${Array(4).fill().map((_, i) => `
                        <option value="${i}">Option ${i + 1}</option>
                    `).join('')}
                </select>
            </div>
            <button type="button" class="removeQuestion">Remove Question</button>
        `;
        questionsContainer.appendChild(questionDiv);
    });

    // Remove a question using event delegation
    questionsContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('removeQuestion')) {
            e.target.closest('.question').remove();
        }
    });

    // Handle form submission
    createQuizForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const quizTitle = document.getElementById('quizTitle').value.trim();
        const quizDescription = document.getElementById('quizDescription').value.trim();
        const questionElements = document.querySelectorAll('.question');

        if (!quizTitle || !quizDescription || questionElements.length === 0) {
            alert("Please enter a title, description, and at least one question.");
            return;
        }

        let questions = Array.from(questionElements).map(question => {
            return {
                question: question.querySelector('.questionInput').value.trim(),
                options: Array.from(question.querySelectorAll('.optionInput')).map(opt => opt.value.trim()),
                correctOption: parseInt(question.querySelector('.correctOption').value) // Store correct option index
            };
        });

        if (questions.some(q => !q.question || q.options.some(opt => opt === ""))) {
            alert("All questions and options must be filled.");
            return;
        }

        const quizId = generateQuizId(); // Generate a unique quiz ID
        const quiz = { id: quizId, title: quizTitle, description: quizDescription, questions };
        saveQuiz(quiz); // Save quiz to localStorage
        addQuizToDropdown(); // Update the dropdown

        // Reset the form
        createQuizForm.reset();
        questionsContainer.innerHTML = '';

        alert("Quiz created successfully!");
        showContent(homeContent); // Return to the home screen
    });

    // Add quizzes to the dropdown
    function addQuizToDropdown() {
        const quizzes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        quizDropdown.innerHTML = quizzes.map(quiz => `
            <div class='quizItem' data-id='${quiz.id}'>
                <span class='quizId'>${quiz.id}</span> - ${quiz.title}
                <button class='editQuizBtn'>Edit</button>
            </div>
        `).join('');
    }

    // Load quiz details when a quiz is clicked in the dropdown
    quizDropdown.addEventListener('click', function (e) {
        if (e.target.classList.contains('quizItem') || e.target.classList.contains('quizId')) {
            const quizId = e.target.closest('.quizItem').dataset.id;
            loadQuizDetails(quizId);
            quizDropdown.classList.remove('active'); // Close dropdown after selection
        }
    });

    // Load and display quiz details
    function loadQuizDetails(quizId) {
        const quizzes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        const quiz = quizzes.find(q => q.id === quizId);
        if (quiz) {
            quizDetailsContent.innerHTML = `
                <h2>${quiz.title}</h2>
                <p><strong>Quiz ID:</strong> ${quiz.id}</p>
                <p>${quiz.description}</p>
                ${quiz.questions.map((q, index) => `
                    <div class="question">
                        <h4>Question ${index + 1}: ${q.question}</h4>
                        <ul>
                            ${q.options.map((opt, optIndex) => `<li>${optIndex + 1}. ${opt}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
                <button id="removeQuizBtn" class="remove-btn">Remove Quiz</button>
            `;

            // Add event listener for the Remove Quiz button
            document.getElementById('removeQuizBtn').addEventListener('click', function () {
                removeQuiz(quizId);
            });

            showContent(quizDetailsContent);
        }
    }

    // Remove a quiz
    function removeQuiz(quizId) {
        let quizzes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        quizzes = quizzes.filter(q => q.id !== quizId); // Filter out the quiz to remove
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quizzes)); // Update localStorage
        addQuizToDropdown(); // Refresh the dropdown
        showContent(homeContent); // Return to the home screen
        alert("Quiz removed successfully!");
    }

    // Load existing quizzes into the dropdown when the page loads
    addQuizToDropdown();
});
document.addEventListener("DOMContentLoaded", function () {
    const LOCAL_STORAGE_KEY = 'quizzes';
    const questionsContainer = document.getElementById('questionsContainer');
    const createQuizForm = document.getElementById('createQuizForm');

    // Add a new question
    document.getElementById('addQuestion').addEventListener('click', function () {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.innerHTML = `
            <input type="text" class="questionInput" placeholder="Enter question" required>
            <div class="options">
                ${Array(4).fill().map((_, i) => `
                    <input type="text" class="optionInput" placeholder="Option ${i + 1}" required>
                `).join('')}
                <label for="correctOption">Correct Option:</label>
                <select class="correctOption">
                    ${Array(4).fill().map((_, i) => `
                        <option value="${i}">Option ${i + 1}</option>
                    `).join('')}
                </select>
            </div>
            <button type="button" class="removeQuestion">Remove Question</button>
        `;
        questionsContainer.appendChild(questionDiv);
    });

    // Remove a question
    questionsContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('removeQuestion')) {
            e.target.closest('.question').remove();
        }
    });

    // Handle form submission
    createQuizForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const quizTitle = document.getElementById('quizTitle').value.trim();
        const quizDescription = document.getElementById('quizDescription').value.trim();
        const questionElements = document.querySelectorAll('.question');

        if (!quizTitle || !quizDescription || questionElements.length === 0) {
            alert("Please enter a title, description, and at least one question.");
            return;
        }

        let questions = Array.from(questionElements).map(question => {
            return {
                question: question.querySelector('.questionInput').value.trim(),
                options: Array.from(question.querySelectorAll('.optionInput')).map(opt => opt.value.trim()),
                correctOption: parseInt(question.querySelector('.correctOption').value) // Store correct option index
            };
        });

        if (questions.some(q => !q.question || q.options.some(opt => opt === ""))) {
            alert("All questions and options must be filled.");
            return;
        }

        const quizId = generateQuizId(); // Generate a unique quiz ID
        const quiz = { id: quizId, title: quizTitle, description: quizDescription, questions };
        saveQuiz(quiz); // Save quiz to localStorage

        // Reset the form
        createQuizForm.reset();
        questionsContainer.innerHTML = '';

        alert("Quiz created successfully!");
        showContent(homeContent); // Return to the home screen
    });

    // Generate a unique quiz ID
    function generateQuizId() {
        return 'quiz-' + Math.random().toString(36).substr(2, 9);
    }

    // Save quiz to localStorage
    function saveQuiz(quiz) {
        let quizzes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
        quizzes.push(quiz);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(quizzes));
    }
});