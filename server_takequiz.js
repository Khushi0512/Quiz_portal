const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

// Route to handle both storing quiz data and fetching quiz data
app.post('/store-quiz-data', (req, res) => {
    const quizData = req.body.quizData; // Assuming quizData is sent as JSON object
    // Write quiz data to a file (you can use a database instead)
    fs.writeFile('quizData.json', JSON.stringify(quizData), (err) => {
        if (err) {
            console.error('Error storing quiz data:', err);
            res.status(500).send('Error storing quiz data');
        } else {
            console.log('Quiz data stored successfully:', quizData);
            res.send('Quiz data stored successfully');
        }
    });
});

// Route to fetch and display quiz data
app.get('/take-quiz', (req, res) => {
    // Read quiz data from the file
    fs.readFile('quizData.json', (err, data) => {
        if (err) {
            console.error('Error reading quiz data:', err);
            res.status(500).send('Error reading quiz data');
        } else {
            const quizData = JSON.parse(data); // Parse JSON data
            // Generate HTML to display quiz questions and options
            const html = generateQuizHTML(quizData);
            res.send(html); // Send generated HTML as response
        }
    });
});

// Function to generate HTML to display quiz data
function generateQuizHTML(quizData) {
    let html = '<!DOCTYPE html>';
    html += '<html lang="en">';
    html += '<head>';
    html += '<meta charset="UTF-8">';
    html += '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
    html += '<title>Take Quiz</title>';
    html += '</head>';
    html += '<body>';
    html += '<h1>Quiz Questions</h1>';
    html += '<ol>';
    quizData.forEach((question, index) => {
        html += `<li>${question.question}</li>`;
        html += '<ul>';
        question.options.forEach(option => {
            html += `<li>${option}</li>`;
        });
        html += '</ul>';
    });
    html += '</ol>';
    html += '</body>';
    html += '</html>';
    return html;
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});