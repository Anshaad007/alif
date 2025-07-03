// Add smooth scrolling or any interactivity here
console.log("Website loaded successfully!");
document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll('a[href^="#"]');
    for (const link of links) {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    }
});

// Card hover animation (pulse effect)
document.querySelectorAll('.info-card, .quiz-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.04) rotate(-1deg)';
    this.style.boxShadow = '0 8px 32px rgba(191, 161, 74, 0.18)';
  });
  card.addEventListener('mouseleave', function() {
    this.style.transform = '';
    this.style.boxShadow = '';
  });
});

// Fade-in animation for sections
document.querySelectorAll('section, .dashboard-card-row').forEach(section => {
  section.style.opacity = 0;
  section.style.transition = 'opacity 1.2s';
});
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('section, .dashboard-card-row').forEach(section => {
      section.style.opacity = 1;
    });
  }, 200);
});

// Animate nav links underline on hover
document.querySelectorAll('.dashboard-menu li a').forEach(link => {
  link.addEventListener('mouseenter', function() {
    this.style.textDecoration = 'underline wavy #bfa14a';
    this.style.textUnderlineOffset = '6px';
  });
  link.addEventListener('mouseleave', function() {
    this.style.textDecoration = '';
    this.style.textUnderlineOffset = '';
  });
});

// Animate gallery images on click
const galleryImgs = document.querySelectorAll('.gallery img');
galleryImgs.forEach(img => {
  img.addEventListener('click', function() {
    this.style.transition = 'transform 0.4s cubic-bezier(.68,-0.55,.27,1.55)';
    this.style.transform = 'scale(1.18) rotate(-2deg)';
    setTimeout(() => {
      this.style.transform = '';
    }, 500);
  });
});

// Admission form submission to Google Sheets
if (document.getElementById('admissionForm')) {
  document.getElementById('admissionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    var form = e.target;
    var formData = new FormData(form);
    var statusDiv = document.getElementById('formStatus');
    statusDiv.textContent = 'Submitting...';
    // TODO: Replace with your actual Google Apps Script Web App URL
    var scriptURL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
    fetch(scriptURL, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        statusDiv.style.color = '#2e7d32';
        statusDiv.textContent = 'Application submitted successfully!';
        form.reset();
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .catch(error => {
      statusDiv.style.color = 'red';
      statusDiv.textContent = 'Submission failed. Please try again later.';
    });
  });
}

// Quiz logic for quiz.html
if (document.getElementById("classSelectForm")) {
  // Questions for each class (sample, can be expanded)
  const classQuestions = {
    "Class 1": [
      // ...existing questions...
    ],
    "Class 2": [
      // ...existing questions...
    ],
    // ...other classes up to Class 9...
    "Class 9": [
      // ...existing questions...
    ],
    // No Class 10 questions yet
  };
  const gradeList = [
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
  ];
  document.getElementById("classSelectForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const selectedClass = document.getElementById("class").value;
    const juzCompleted = document.getElementById("juz").value;
    if (!selectedClass || juzCompleted === "" || juzCompleted < 0 || juzCompleted > 30) return;
    this.style.animation = "fadeOut 0.5s";
    setTimeout(() => {
      this.style.display = "none";
      const quizForm = document.getElementById("quizForm");
      quizForm.style.display = "";
      quizForm.style.animation = "fadeIn 0.7s";
      // Pick questions for class, fallback to Class 1 if not found
      const questions = classQuestions[selectedClass] || classQuestions["Class 1"];
      quizForm.innerHTML = "";
      questions.forEach((q, idx) => {
        const qDiv = document.createElement("div");
        qDiv.className = "quiz-question";
        qDiv.innerHTML =
          `<b>Q${idx + 1}:</b> ${q.q}<div class='quiz-options'>` +
          q.options
            .map(
              (opt, i) =>
                `<label><input type='radio' name='q${idx}' value='${i}' required><span>${opt}</span></label>`
            )
            .join("") +
          "</div>";
        quizForm.appendChild(qDiv);
      });
      quizForm.innerHTML +=
        '<button type="submit" class="quiz-btn">Submit Answers</button>';
      quizForm.dataset.selectedClass = selectedClass;
      quizForm.dataset.questions = JSON.stringify(questions);
      quizForm.dataset.juzCompleted = juzCompleted;
      quizForm
        .querySelectorAll('input[type="radio"]')
        .forEach((radio) => {
          radio.addEventListener("change", function () {
            quizForm
              .querySelectorAll(`input[name='${this.name}']`)
              .forEach((r) => {
                r.parentElement.classList.remove("selected");
              });
            this.parentElement.classList.add("selected");
          });
        });
    }, 400);
  });
  document.getElementById("quizForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const selectedClass = this.dataset.selectedClass;
    const questions = JSON.parse(this.dataset.questions);
    const juzCompleted = this.dataset.juzCompleted;
    let score = 0;
    let incorrectDetails = [];
    for (let i = 0; i < questions.length; i++) {
      const userAns = this[`q${i}`].value;
      if (parseInt(userAns) === questions[i].answer) {
        score++;
      } else {
        incorrectDetails.push({
          idx: i,
          question: questions[i].q,
          userChoice: questions[i].options[parseInt(userAns)],
          correctChoice: questions[i].options[questions[i].answer],
        });
      }
    }
    let resultMsg = `<div style='margin-bottom:8px;'>Juz completed: <b>${juzCompleted}</b></div>`;
    // If Class 10 selected, but no questions, fallback to Class 1
    let idx = gradeList.indexOf(selectedClass);
    if (score >= 5) {
      resultMsg += `<span style='color:#2e7d32;'>Congratulations! You are eligible for <b>${selectedClass}</b>.<br>Your Score: ${score}/10</span>`;
    } else {
      let recClass = idx > 0 ? gradeList[idx - 1] : "Class 1";
      resultMsg += `<span style='color:#b71c1c;'>Oops, you are not eligible for <b>${selectedClass}</b>.<br>We recommend you join <b>${recClass}</b>.<br>Your Score: ${score}/10</span>`;
    }
    if (incorrectDetails.length > 0) {
      resultMsg += `<div class='review-section'><b>Review your incorrect answers:</b><div class='review-list'>`;
      incorrectDetails.forEach((item) => {
        resultMsg += `
          <div class='review-card'>
            <div class='review-q'><span class='wrong-icon'>✗</span> <b>Q${item.idx + 1}:</b> ${item.question}</div>
            <div class='review-ans'><span class='badge badge-wrong'>Your answer:</span> <span class='wrong-text'>${item.userChoice}</span></div>
            <div class='review-ans'><span class='badge badge-correct'>Correct answer:</span> <span class='correct-text'>${item.correctChoice}</span></div>
          </div>
        `;
      });
      resultMsg += `</div></div>`;
    }
    this.style.animation = "fadeOut 0.5s";
    setTimeout(() => {
      this.style.display = "none";
      const resultDiv = document.getElementById("quizResult");
      resultDiv.innerHTML = resultMsg;
      resultDiv.style.animation = "popIn 0.7s";
    }, 400);
  });
}