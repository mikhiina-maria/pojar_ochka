fetch('text.json')
    .then(response => response.json())
    .then(data => {
        const questions = data.questions;
        const quizContainer = document.getElementById('quiz-container');
        const submitButton = document.getElementById('submit-button');

        let correctAnswers = 0;
        let totalQuestions = 0;

        questions.forEach(question => {
            const questionElement = document.createElement('div');
            questionElement.textContent = question.question;

            const answersElement = document.createElement('div');
            question.answers.forEach(answer => {
                const answerElement = document.createElement('label');
                let inputElement;

                if (question.answers.filter(a => a.isCorrect).length === 1) {
                    inputElement = document.createElement('input');
                    inputElement.type = 'radio';
                    inputElement.name = `question-${question.id}`;
                } else {
                    inputElement = document.createElement('input');
                    inputElement.type = 'checkbox';
                    inputElement.name = `question-${question.id}[]`;
                }

                inputElement.value = answer.text;
                answerElement.appendChild(inputElement);
                answerElement.appendChild(document.createTextNode(answer.text));
                answersElement.appendChild(answerElement);
            });

            questionElement.appendChild(answersElement);
            quizContainer.appendChild(questionElement);
            totalQuestions++;
        });

        submitButton.addEventListener('click', () => {
            const userAnswers = [];
            questions.forEach(question => {
                const selectedAnswers = Array.from(quizContainer.querySelectorAll(`input[name="question-${question.id}"]:checked`))
                    .map(input => input.value);
                const correctAnswersForQuestion = question.answers.filter(a => a.isCorrect).map(a => a.text);

                const isAnswerCorrect = selectedAnswers.length === correctAnswersForQuestion.length &&
                    selectedAnswers.every(answer => correctAnswersForQuestion.includes(answer));

                if (isAnswerCorrect) {
                    correctAnswers++;
                }

                userAnswers.push({
                    questionId: question.id,
                    selectedAnswers,
                    isCorrect: isAnswerCorrect
                });
            });

            localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
            localStorage.setItem('correctAnswers', correctAnswers);
            localStorage.setItem('totalQuestions', totalQuestions);
            window.location.href = 'result.html';
        });
    })
    .catch(error => console.error('Error:', error));
