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

// Admission form: show/hide grade field and validate
if (document.getElementById('admissionForm')) {
  const courseSelect = document.getElementById('course');
  const gradeField = document.getElementById('gradeField');
  const gradeSelect = document.getElementById('grade');
  const form = document.getElementById('admissionForm');
  const statusDiv = document.getElementById('formStatus');

  function toggleGradeField() {
    if (courseSelect.value === 'Madrassa Classes') {
      gradeField.style.display = '';
      gradeSelect.required = true;
    } else {
      gradeField.style.display = 'none';
      gradeSelect.required = false;
      gradeSelect.value = '';
    }
  }
  courseSelect.addEventListener('change', toggleGradeField);
  toggleGradeField(); // Initial call

  form.addEventListener('submit', function(e) {
    if (courseSelect.value === 'Madrassa Classes' && !gradeSelect.value) {
      statusDiv.style.color = 'red';
      statusDiv.textContent = 'Please select a grade for Madrassa Classes.';
      e.preventDefault();
      return;
    }
    e.preventDefault();
    var formData = new FormData(form);
    statusDiv.textContent = 'Submitting...';
    // TODO: Replace with your actual Google Apps Script Web App URL
    var scriptURL = 'https://script.google.com/macros/s/AKfycbzR77b0r81Vyi_Otci8KqUPnQD_CPZPWTaFP_uEIEHq76x1sbfwxViru1g9tggWy9lQ/exec';
    fetch(scriptURL, {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        statusDiv.style.color = '#2e7d32';
        statusDiv.textContent = 'Application submitted successfully!';
        form.reset();
        toggleGradeField();
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