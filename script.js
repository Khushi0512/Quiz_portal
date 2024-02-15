// Fetch quiz data from the server
fetch('/take-quiz')
    .then(response => response.json())
    .then(quizData => {
        // Generate HTML to display the quiz
        // Insert the generated HTML into the appropriate DOM element
        // For example:
        const quizContainer = document.getElementById('quizContainer');
        quizContainer.innerHTML = generateQuizHTML(quizData);
    })
    .catch(error => {
        console.error('Error fetching quiz data:', error);
        // Handle error
    });

// Function to generate HTML to display the quiz
function generateQuizHTML(quizData) {
    // Generate HTML based on the quizData received from the server
    // Return the generated HTML
}

// Event listener for form submission
document.getElementById('createQuizForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission to refresh the page

    // Fetch all questions and their options
    // Send quizData to the server as before
    // ...
    
    var questions = document.querySelectorAll('.question');
    var quizData = [];
    questions.forEach(function(question) {
        var questionText = question.querySelector('.questionInput').value;
        var correctAnswer = question.querySelector('.correctAnswerInput').value;
        var options = [];
        var optionInputs = question.querySelectorAll('.optionInput');
        optionInputs.forEach(function(optionInput) {
            options.push(optionInput.value);
        });
        quizData.push({
            question: questionText,
            options: options,
            correctAnswer: correctAnswer
        });
    });
    
    // Send quizData to the server
    fetch('/store-quiz-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quizData: quizData })
    })
    .then(response => response.text())
    .then(message => {
        // Display a message
        var thankYouMessage = document.getElementById('thankYouMessage');
        thankYouMessage.innerText = message;
        thankYouMessage.classList.remove('hidden');
    })
    .catch(error => {
        console.error('Error storing quiz data:', error);
        // Handle error
    });
});

document.getElementById('addQuestionBtn').addEventListener('click', addQuestion);
document.getElementById('questionsContainer').addEventListener('click', function(event) {
    if (event.target && event.target.className === 'addOptionBtn') {
        addOption(event.target);
    }
});

function addOption(addOptionBtn) {
    var questionContainer = addOptionBtn.closest('.question');
    var optionsContainer = questionContainer.querySelector('.options');
    var optionNumber = optionsContainer.children.length + 1;
    if (optionNumber <= 9) {
        var optionInput = document.createElement('div');
        optionInput.className = 'option';
        optionInput.innerHTML = `
            <label for="option">Option ${optionNumber}:</label>
            <input type="text" class="optionInput" name="option[]" required>`;
        optionsContainer.appendChild(optionInput);
    }
}

function addQuestion() {
    var questionContainer = document.createElement('div');
    questionContainer.className = 'question';
    questionContainer.innerHTML = `
        <label for="question">Question:</label>
        <input type="text" class="questionInput" name="question[]" required>
        <div class="options"></div>
        <label for="correctAnswer">Correct Answer:</label>
        <input type="text" class="correctAnswerInput" name="correctAnswer[]" required>
        <button type="button" class="addOptionBtn">Add Option</button><br>`;
    document.getElementById('questionsContainer').appendChild(questionContainer);
}