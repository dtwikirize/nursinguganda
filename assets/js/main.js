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

function renderQuiz(target) {
  const quizKey = target.dataset.quiz;
  const questions = (window.NURSING_UGANDA_QUIZ_DATA && window.NURSING_UGANDA_QUIZ_DATA[quizKey]) || [];
  if (!questions.length) {
    target.innerHTML = `<div class="quiz-box"><p>Quiz questions for this topic will be added soon.</p></div>`;
    return;
  }
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
    const email = form.querySelector("input[type='email']");
    const status = form.querySelector("[data-form-status]");
    if (status) {
      if (email && email.value) {
        window.location.href = `mailto:twikirizederick@gmail.com?subject=Newsletter%20signup&body=Please%20add%20me%20to%20the%20Nursing%20Uganda%20newsletter%3A%20${encodeURIComponent(email.value)}`;
        status.textContent = "Opening your email app to complete signup.";
      } else {
        status.textContent = "Please enter your email address.";
      }
    }
    form.reset();
  });
});

document.querySelectorAll("[data-contact-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = form.querySelector("input[name='name'], input[placeholder*='name' i]");
    const message = form.querySelector("textarea");
    const status = form.querySelector("[data-form-status]");
    const body = [
      name ? `From: ${name.value}` : "",
      message ? `\n\n${message.value}` : ""
    ].filter(Boolean).join("");
    if (status) status.textContent = "Opening your email app to send your message.";
    window.location.href = `mailto:twikirizederick@gmail.com?subject=Nursing%20Uganda%20Contact&body=${encodeURIComponent(body)}`;
    form.reset();
  });
});
