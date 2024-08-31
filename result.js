document.addEventListener('DOMContentLoaded', () => {
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers'));
    const correctAnswers = parseInt(localStorage.getItem('correctAnswers'));
    const totalQuestions = parseInt(localStorage.getItem('totalQuestions'));
    
    // Создаем контейнеры для результатов и оценки
    const quizContainer = document.getElementById('quiz-container');
    const resultContainer = document.createElement('div');
    resultContainer.id = 'result-container';
    const scoreContainer = document.createElement('div');
    scoreContainer.id = 'score-container';
    
    quizContainer.appendChild(scoreContainer);
    quizContainer.appendChild(resultContainer);

    // Отображение общего результата
    const scoreElement = document.createElement('h2');
    scoreElement.textContent = `Правильно: ${correctAnswers} из ${totalQuestions}`;
    scoreContainer.appendChild(scoreElement);

    fetch('text.json')
    .then(response => response.json())
    .then(data => {
        const questions = data.questions;

        // Отображение вопросов
        questions.forEach(question => {
            const userAnswer = userAnswers.find(a => a.questionId === question.id);
            
            const questionElement = document.createElement('div');
            questionElement.innerHTML = `<strong>Вопрос ${question.id}:</strong> ${question.question}`;
            questionElement.style.marginBottom = '10px';

            // Подсветка неправильно отвеченных вопросов красным
            if (!userAnswer.isCorrect) {
                questionElement.style.color = 'red';
            }

            const answersElement = document.createElement('ul');
            answersElement.style.marginLeft = '20px';

            question.answers.forEach(answer => {
                const answerElement = document.createElement('li');
                answerElement.textContent = answer.text;
                
                if (userAnswer.selectedAnswers.includes(answer.text)) {
                    if (answer.isCorrect) {
                        answerElement.style.color = 'green';
                    } else {
                        answerElement.style.color = 'red';
                    }
                } else if (answer.isCorrect) {
                    answerElement.style.color = 'green';
                }

                answersElement.appendChild(answerElement);
            });

            questionElement.appendChild(answersElement);
            resultContainer.appendChild(questionElement);
        });

        // Добавление кнопки "Начать заново"
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Начать заново';
        restartButton.style.marginTop = '20px';
        restartButton.addEventListener('click', () => {
            localStorage.clear(); // Очистка localStorage перед перезапуском
            window.location.href = 'index.html'; // Предполагается, что главная страница называется index.html
        });
        quizContainer.appendChild(restartButton);
    })
    .catch(error => console.error('Error:', error));
});