//Global constants
const questionsContainer = document.getElementById('questions');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');
const pagination = document.getElementById('page');
const display = document.querySelector('#time');

//JSON Request
let request = new XMLHttpRequest();

request.open('GET', 'http://localhost:3000/data', true);

request.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {

    // Parse out the reponse
    let data = JSON.parse(this.responseText);

    // questions for the quiz built out from JSON data
    const questions = [
      {
        question: data[0].image_url,
        answers: {
          a: data[0].quote,
          b: data[7].quote,
          c: data[5].quote
        },
        correctAnswer: 'a'
      },
      {
        question: data[1].image_url,
        answers: {
          a: data[4].quote,
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
      },
      {
          question: data[3].image_url,
          answers: {
            a: data[3].quote,
            b: data[6].quote,
            c: data[7].quote
          },
          correctAnswer: 'a'
        },
        {
          question: data[4].image_url,
          answers: {
            a: data[8].quote,
            b: data[0].quote,
            c: data[4].quote
          },
          correctAnswer: 'c'
        },
        {
          question: data[5].image_url,
          answers: {
            a: data[6].quote,
            b: data[5].quote,
            c: data[2].quote
          },
          correctAnswer: 'b'
        },
        {
          question: data[6].image_url,
          answers: {
            a: data[6].quote,
            b: data[1].quote,
            c: data[8].quote
          },
          correctAnswer: 'a'
        },
        {
          question: data[7].image_url,
          answers: {
            a: data[0].quote,
            b: data[5].quote,
            c: data[7].quote
          },
          correctAnswer: 'c'
        },
        {
          question: data[8].image_url,
          answers: {
            a: data[3].quote,
            b: data[8].quote,
            c: data[2].quote
          },
          correctAnswer: 'b'
        }
    ];

    // build out quiz from the questions array
    function buildQuiz() {
      const output = [];

      questions.forEach(function(currentQuestion, questionNumber) {
        const answers = [];

        for (letter in currentQuestion.answers) {
          answers.push("<div class=\"answer\">\n<input type=\"radio\" name=\"question" + questionNumber + "\" value=\"" + letter + "\" id=\"" + questionNumber + letter + "\"/><label for=\"" + questionNumber + letter + "\">" + currentQuestion.answers[letter] + "</label>\n</div>");
        }

        output.push("<div class=\"slide\">\n<div class=\"scientist-image image-wrapper\" id=\"image\" style=\"background-image: url(" + currentQuestion.question + ")\">\n<div class=\"scientist-info\">\n<h4>" + data[questionNumber].name + "</h4>\n<p>" + data[questionNumber].birthday + "</p>\n</div>\n</div>\n<div class=\"answers\">" + answers.join("") + "</div>\n</div>");
      });

      questionsContainer.innerHTML = output.join("");
    }

    function showResults() {
      let answerContainers = questionsContainer.querySelectorAll(".answers");
      let numCorrect = 0;

      questions.forEach(function(currentQuestion, questionNumber) {
        // find selected answer
        let answerContainer = answerContainers[questionNumber];
        let selector = "input[name=question" + questionNumber + "]:checked";
        let userAnswer = (answerContainer.querySelector(selector) || {}).value;

        // check answers
        if (userAnswer == '') {
          let blank = 0;
          blank++;
          if(blank > 0){
            return;
          }
        } else if (userAnswer === currentQuestion.correctAnswer) {
          numCorrect++;
          answerContainer.querySelector(selector).parentElement.classList.add('bg-success', 'text-white');
        } else {
          answerContainer.querySelector(selector).parentElement.classList.add('bg-danger', 'text-white');
        }
      });

      // disable after quiz has been submitted
      questionsContainer.parentElement.parentElement.classList.add('disabled');

      let inputs = document.getElementsByTagName('input');
      for(i = 0; i < inputs.length; i++){
        inputs[i].disabled = 'disabled';
      }

      // show modal with answers/overlay
      document.querySelector('.overlay').classList.add('fadeIn');
      resultsContainer.classList.add('open');

      // show number of correct answers out of total
      resultsContainer.innerHTML = "<h3>You got " + numCorrect + " out of " + questions.length + " quotes correct!</h3><p>Feel free to go back through your answers to see what you got wrong or right.</p><a href=\"javascript:void(0)\" id=\"review\" class=\"btn bg-main\">Review <i class=\"fa fa-glasses\"></i></a> <a href=\"quiz.html\" class=\"btn bg-success pulse\">Retake Quiz <i class=\"fa fa-pencil-alt\"></i></a>";

      // add review listener for review btn
      const reviewButton = document.getElementById('review');
      reviewButton.addEventListener('click', showAnswers);
    }
    // on submit show results and stop timer
    submitButton.addEventListener('click', function() {
      showResults();
      submitclicked();
    });

    // display quiz right away
    buildQuiz();

    // Loop through slides
    function showSlide(n) {
      slides[currentSlide].classList.remove('active-slide');
      slides[n].classList.add('active-slide');
      currentSlide = n;
      // update pagination
      pagination.innerHTML = data[n].id + " of 9";

      if (currentSlide === 0) {
        previousButton.style.display = 'none';
      } else {
        previousButton.style.display = 'inline-block';
      }

      if (currentSlide === slides.length - 1) {
        nextButton.style.display = 'none';
        submitButton.style.display = 'inline-block';
      } else {
        nextButton.style.display = 'inline-block';
        submitButton.style.display = 'none';
      }
    }
    function showNextSlide() {
      showSlide(currentSlide + 1);
    }
    function showPreviousSlide() {
      showSlide(currentSlide - 1);
    }
    function showAnswers() {
      document.querySelector('.overlay').classList.remove('fadeIn');
      resultsContainer.classList.remove('open');
      retakeButton.style.display = 'inline-block';
      showSlide(currentSlide - currentSlide);
    }

    const previousButton = document.getElementById('previous');
    const nextButton = document.getElementById('next');
    const retakeButton = document.getElementById('retake');
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    // click event handlers for slides
    previousButton.addEventListener('click', showPreviousSlide);
    nextButton.addEventListener('click', showNextSlide);

    showSlide(0);

    // Timer functionality
    let duration = 60 * 3; // 3 minutes
    let t = setInterval(function() {
      let minutes = parseInt(duration / 60, 10)
      let seconds = parseInt(duration % 60, 10);
      seconds = seconds < 10 ? "0" + seconds : seconds;

      // turn timer red once there's 1 minute left
      if (minutes < 1){
      display.parentElement.classList.add('bg-danger');
      }

      // update time element with current time
      display.textContent = minutes + ":" + seconds;

      if (--duration < 0) {
        clearInterval(t);
        outofTime();
      }
    }, 1000);

    // when the timer runs out display error
    function outofTime() {
      resultsContainer.innerHTML = '<h3>You didn\'t finish in time!</h3><p>Study up or try again, I believe in you!</p><a href="/study.html" class="btn bg-main">Study <i class="fa fa-glasses"></i></a> <a href="quiz.html" class="btn bg-success pulse">Retake Quiz <i class="fa fa-pencil-alt"></i></a>';
      document.querySelector('.overlay').classList.add('fadeIn');
      resultsContainer.classList.add('open');
    }

    // once the submit btn is clicked stop the timer
    function submitclicked(){
      clearInterval(t);
    }

  } else if (this.status == 404){
    //Error message if request fails
    let error = document.createElement('h1');
    let errorMsg = error.innterHTML = 'Oh snap it be broke.';
    document.getElementById('app').append(error);
  }
}
request.send();