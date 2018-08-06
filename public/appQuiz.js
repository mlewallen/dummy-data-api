//Global constants
const questionsContainer = document.getElementById('questions');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');

//JSON Request
let request = new XMLHttpRequest();

request.open('GET', 'http://localhost:3000/data', true);

request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

      // Parse out the reponse
      let data = JSON.parse(this.responseText);

      const questions = [
        {
          question: data[0].image_url,
          answers: {
            a: data[0].quote,
            b: data[7].quote,
            c: data[2].quote
          },
          correctAnswer: 'a'
        },
        {
          question: data[1].image_url,
          answers: {
            a: data[0].quote,
            b: data[1].quote,
            c: data[8].quote
          },
          correctAnswer: 'b'
        },
        {
          question: data[2].image_url,
          answers: {
            a: data[3].quote,
            b: data[5].quote,
            c: data[2].quote
          },
          correctAnswer: 'c'
        }
      ];

      function buildQuiz() {
        // we'll need a place to store the HTML output
        const output = [];

        // for each question...
        questions.forEach((currentQuestion, questionNumber) => {
          // we'll want to store the list of answer choices
          const answers = [];

          // and for each available answer...
          for (letter in currentQuestion.answers) {
            // ...add an HTML radio button
            answers.push(
              `<div class="answer">
                <label>
                   <input type="radio" name="question${questionNumber}" value="${letter}">${letter} : ${currentQuestion.answers[letter]}
                 </label>
               </div>`
            );
          }

          // add this question and its answers to the output
          output.push(
            `<div class="slide">
               <div class="scientist-image image-wrapper" id="image" style="background-image: url(${currentQuestion.question}"></div>
               <div class="answers">${answers.join("")}</div>
             </div>`
          );
        });

        // finally combine our output list into one string of HTML and put it on the page
        questionsContainer.innerHTML = output.join("");
      }

      function showResults() {
        // gather answer containers from our quiz
        const answerContainers = questionsContainer.querySelectorAll(".answers");

        // keep track of user's answers
        let numCorrect = 0;

        // for each question...
        questions.forEach((currentQuestion, questionNumber) => {
          // find selected answer
          const answerContainer = answerContainers[questionNumber];
          const selector = `input[name=question${questionNumber}]:checked`;
          const userAnswer = (answerContainer.querySelector(selector) || {}).value;

          // if answer is correct
          if (userAnswer === currentQuestion.correctAnswer) {
            // add to the number of correct answers
            numCorrect++;

            // color the answers green
            answerContainers[questionNumber].style.color = "lightgreen";
          } else {
            // if answer is wrong or blank
            // color the answers red
            answerContainers[questionNumber].style.color = "red";
          }
        });

        // show number of correct answers out of total
        resultsContainer.innerHTML = `${numCorrect} out of ${questions.length}`;
      }

      function showSlide(n) {
        slides[currentSlide].classList.remove("active-slide");
        slides[n].classList.add("active-slide");
        currentSlide = n;

        if (currentSlide === 0) {
          previousButton.style.display = "none";
        } else {
          previousButton.style.display = "inline-block";
        }

        if (currentSlide === slides.length - 1) {
          nextButton.style.display = "none";
          submitButton.style.display = "inline-block";
        } else {
          nextButton.style.display = "inline-block";
          submitButton.style.display = "none";
        }
      }

      function showNextSlide() {
        showSlide(currentSlide + 1);
      }

      function showPreviousSlide() {
        showSlide(currentSlide - 1);
      }

      // display quiz right away
      buildQuiz();

      const previousButton = document.getElementById("previous");
      const nextButton = document.getElementById("next");
      const slides = document.querySelectorAll(".slide");
      let currentSlide = 0;

      showSlide(0);

      // on submit, show results
      submitButton.addEventListener("click", showResults);
      previousButton.addEventListener("click", showPreviousSlide);
      nextButton.addEventListener("click", showNextSlide);

    } else if (this.status == 404){
        //Error message if request fails
        let error = document.createElement('h1');
        let errorMsg = error.innterHTML = 'Oh snap it be broke.';
        document.getElementById('app').append(error);
    }
}
request.send();
