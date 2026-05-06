const navToggle = document.querySelector("[data-nav-toggle]");
const mainNav = document.querySelector("[data-main-nav]");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll("[data-course-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const sidebar = button.closest(".sidebar");
    if (!sidebar) return;
    const collapsed = sidebar.classList.toggle("collapsed");
    button.textContent = collapsed ? "Open course menu" : "Close course menu";
  });
});

const quizData = {
  anatomyIntro: [
    {
      question: "What is anatomy mainly concerned with?",
      options: [
        "The structure of the body and its parts",
        "Only the treatment of disease",
        "Drug preparation and storage",
        "Hospital financial management"
      ],
      answer: 0,
      explanation: "Anatomy studies body structures. Physiology studies how those structures function."
    },
    {
      question: "Which term best describes lying flat on the back with the face upward?",
      options: ["Prone", "Supine", "Lateral", "Fowler's"],
      answer: 1,
      explanation: "Supine means lying on the back. Prone means lying face downward."
    },
    {
      question: "Why do nursing students learn anatomical terminology?",
      options: [
        "To replace clinical assessment",
        "To communicate body location clearly and safely",
        "To avoid documenting patient care",
        "To memorize unrelated Latin words"
      ],
      answer: 1,
      explanation: "Shared terminology reduces ambiguity when nurses document, report, and escalate clinical findings."
    }
  ]
};

function renderQuiz(target) {
  const quizKey = target.dataset.quiz;
  const questions = quizData[quizKey] || [];
  let answered = 0;
  let score = 0;

  target.innerHTML = `
    <div class="quiz-box">
      <div class="meta-box"><strong>Score</strong><span data-score>0 / ${questions.length}</span></div>
      ${questions
        .map(
          (item, index) => `
            <div class="quiz-question" data-question="${index}">
              <h3>${index + 1}. ${item.question}</h3>
              <div class="quiz-options">
                ${item.options
                  .map((option, optionIndex) => `<button type="button" data-option="${optionIndex}">${option}</button>`)
                  .join("")}
              </div>
              <div class="quiz-feedback" aria-live="polite"></div>
            </div>
          `
        )
        .join("")}
    </div>
  `;

  const scoreNode = target.querySelector("[data-score]");

  target.querySelectorAll("[data-question]").forEach((questionNode) => {
    const questionIndex = Number(questionNode.dataset.question);
    const question = questions[questionIndex];
    const feedback = questionNode.querySelector(".quiz-feedback");
    const buttons = questionNode.querySelectorAll("[data-option]");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        if (questionNode.dataset.answered === "true") return;

        const optionIndex = Number(button.dataset.option);
        const isCorrect = optionIndex === question.answer;
        questionNode.dataset.answered = "true";
        answered += 1;

        if (isCorrect) score += 1;

        buttons.forEach((optionButton) => {
          const currentIndex = Number(optionButton.dataset.option);
          optionButton.disabled = true;
          if (currentIndex === question.answer) optionButton.classList.add("correct");
        });

        if (!isCorrect) button.classList.add("incorrect");

        feedback.textContent = `${isCorrect ? "Correct." : "Not quite."} ${question.explanation}`;
        scoreNode.textContent = `${score} / ${questions.length}${answered === questions.length ? " complete" : ""}`;
      });
    });
  });
}

document.querySelectorAll("[data-quiz]").forEach(renderQuiz);

document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector("[data-form-status]");
    if (status) {
      status.textContent = "Thank you. Newsletter signup is ready for email integration.";
    }
    form.reset();
  });
});

document.querySelectorAll("[data-contact-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector("[data-form-status]");
    if (status) {
      status.textContent = "Message captured locally for the demo. Connect this form to email on deployment.";
    }
    form.reset();
  });
});
