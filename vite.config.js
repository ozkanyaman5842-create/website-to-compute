const questions = [
  { id: 1, text: "Hikaye şehir merkezinde geçiyor.", answer: "Y" },
  { id: 2, text: "Hikayede bir araziden çok bahsediliyor.", answer: "D" },
  { id: 3, text: "Hikayede hiç iyi rolde kadın yok.", answer: "Y" },
  { id: 4, text: "Hikayenin kahramanı Rıdvan’dır.", answer: "D" },
  { id: 5, text: "Rıdvanın eşinin adı Enise’dir.", answer: "Y" },
  { id: 6, text: "Rıdvanın annesi hastalandı ve öldü.", answer: "Y" },
  { id: 7, text: "Rıdvan, köyün güneyinde bir arazi aldı.", answer: "Y" },
  { id: 8, text: "Rıdvanın aldığı arazide bir göl vardı.", answer: "Y" },
  { id: 9, text: "Köylüler, aldığı arazi için Rıdvanı takdir ettiler.", answer: "Y" },
  { id: 10, text: "Rıdvanın eşi, aldığı arazi için çok kızdı.", answer: "Y" },
  { id: 11, text: "Rıdvanın aldığı tarla taşlık ve kuru idi.", answer: "D" },
  { id: 12, text: "Rıdvan köylülere “mecnunlar” diye sesleniyordu.", answer: "Y" },
  { id: 13, text: "Rıdvan ve eşi Allah’a çok dua ederdi.", answer: "D" },
  { id: 14, text: "Rıdvanın annesi bir rüya gördü.", answer: "Y" },
  { id: 15, text: "Rıdvan satın aldığı arazide bir deve kesti.", answer: "Y" },
  { id: 16, text: "Rıdvan, satın aldığı arazide altın buldu.", answer: "Y" },
  { id: 17, text: "Rıdvan’a başta hased eden kişinin adı Cabir idi.", answer: "D" },
  { id: 18, text: "Rıdvan, tarlasındaki suyu köylülere vermedi.", answer: "Y" },
  { id: 19, text: "Hikayede geçen “kanevat” kelimesi kanallar anlamındadır.", answer: "D" },
  { id: 20, text: "Hikayede geçen “Hukul’ul karye” ifadesi, köyün tarlaları anlamındadır.", answer: "D" },
  { id: 21, text: "Hikayede geçen “Karise” kelimesi, hediye anlamındadır.", answer: "Y" },
  { id: 22, text: "Rıdvan, köylülerle küstü.", answer: "Y" },
  { id: 23, text: "Cabir, Rıdvan’a yaptıklarından pişman oldu.", answer: "D" },
  { id: 24, text: "Rıdvan’la eşi zengin olduktan sonra köyü terk ettiler.", answer: "Y" },
  { id: 25, text: "“Kasiyen” kelimesi kalbin katılığını ifade eder.", answer: "D" },
];

document.addEventListener("DOMContentLoaded", () => {
  const quizRoot = document.querySelector("#quiz-root");
  const messagesEl = document.querySelector("#messages");
  const saveStatusEl = document.querySelector("#save-status");
  const summaryEl = document.querySelector("#summary");
  const resultsSection = document.querySelector("#results");
  const shareWhatsAppBtn = document.querySelector("#share-whatsapp");
  const shareEmailBtn = document.querySelector("#share-email");
  const checkButton = document.querySelector("#check-button");
  const resetButton = document.querySelector("#reset-button");

  let shareMessage = "";

  renderQuiz(quizRoot);

  checkButton.addEventListener("click", () => {
    const responses = collectResponses();
    const hasEmpty = markUnanswered(responses);

    if (hasEmpty) {
      setMessage("Lütfen her cümle için Doğru veya Yanlış seçimini yapın.", messagesEl);
      hideResults();
      return;
    }

    clearMessage(messagesEl);

    const totalCorrect = calculateScore(responses);
    const totalQuestions = questions.length;

    const detailsForShare = buildAnswerDetails(responses);
    shareMessage = buildShareMessage(totalCorrect, totalQuestions, detailsForShare);

    summaryEl.textContent = `Toplam ${totalQuestions} sorudan ${totalCorrect} tanesine doğru cevap verdiniz.`;
    resultsSection.classList.remove("results--hidden");
    saveStatusEl.classList.remove("status--hidden");

    shareWhatsAppBtn.disabled = false;
    shareEmailBtn.disabled = false;
  });

  resetButton.addEventListener("click", () => {
    const radios = quizRoot.querySelectorAll('input[type="radio"]');
    radios.forEach((input) => {
      input.checked = false;
    });

    quizRoot.querySelectorAll(".quiz__item").forEach((item) => {
      item.classList.remove("quiz__item--invalid");
    });

    shareMessage = "";

    summaryEl.textContent = "";
    resultsSection.classList.add("results--hidden");
    saveStatusEl.classList.add("status--hidden");
    shareWhatsAppBtn.disabled = true;
    shareEmailBtn.disabled = true;
    clearMessage(messagesEl);
  });

  shareWhatsAppBtn.addEventListener("click", () => {
    if (!shareMessage) {
      return;
    }

    const phoneNumber = "905427886897";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, "_blank", "noopener");
  });

  shareEmailBtn.addEventListener("click", () => {
    if (!shareMessage) {
      return;
    }

    const subject = "Basit Seviye Testi Sonucum";
    const mailtoUrl = `mailto:ozkanyaman5842@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      shareMessage,
    )}`;
    window.location.href = mailtoUrl;
  });

  function hideResults() {
    resultsSection.classList.add("results--hidden");
    saveStatusEl.classList.add("status--hidden");
    shareWhatsAppBtn.disabled = true;
    shareEmailBtn.disabled = true;
  }
});

function renderQuiz(container) {
  questions.forEach((question) => {
    const questionEl = document.createElement("article");
    questionEl.className = "quiz__item";
    questionEl.id = `question-${question.id}`;

    const questionText = document.createElement("h3");
    questionText.className = "quiz__question";
    questionText.textContent = `${question.id}. ${question.text}`;
    questionEl.appendChild(questionText);

    const optionsWrapper = document.createElement("div");
    optionsWrapper.className = "quiz__options";

    const options = [
      { value: "D", label: "Doğru" },
      { value: "Y", label: "Yanlış" },
    ];

    options.forEach((option) => {
      const label = document.createElement("label");
      label.className = "option";
      label.setAttribute("tabindex", "0");

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `question-${question.id}`;
      input.value = option.value;

      input.addEventListener("change", () => {
        questionEl.classList.remove("quiz__item--invalid");
        clearMessage(document.querySelector("#messages"));
      });

      const optionText = document.createElement("span");
      optionText.textContent = option.label;

      label.appendChild(input);
      label.appendChild(optionText);
      optionsWrapper.appendChild(label);
    });

    questionEl.appendChild(optionsWrapper);
    container.appendChild(questionEl);
  });
}

function collectResponses() {
  return questions.map((question) => {
    const selected = document.querySelector(`input[name="question-${question.id}"]:checked`);
    return {
      id: question.id,
      selected: selected ? selected.value : null,
      correct: question.answer,
    };
  });
}

function markUnanswered(responses) {
  let hasEmpty = false;

  responses.forEach((response) => {
    const item = document.querySelector(`#question-${response.id}`);
    if (!response.selected) {
      item.classList.add("quiz__item--invalid");
      hasEmpty = true;
    } else {
      item.classList.remove("quiz__item--invalid");
    }
  });

  return hasEmpty;
}

function calculateScore(responses) {
  return responses.reduce((total, response) => {
    return response.selected === response.correct ? total + 1 : total;
  }, 0);
}

function buildAnswerDetails(responses) {
  return responses
    .map((response) => {
      const chosen = response.selected === "D" ? "Doğru" : "Yanlış";
      const status = response.selected === response.correct ? "Sonuç: Doğru" : "Sonuç: Yanlış";
      return `${response.id}. Seçim: ${chosen} - ${status}`;
    })
    .join("\n");
}

function buildShareMessage(correctCount, total, answersDetail) {
  return `Basit Seviye Testi Sonuçları\nToplam Doğru: ${correctCount}/${total}\n\nCevaplarım:\n${answersDetail}`;
}

function setMessage(text, target) {
  target.textContent = text;
  target.classList.remove("messages--hidden");
}

function clearMessage(target) {
  if (!target) {
    return;
  }
  target.textContent = "";
  target.classList.add("messages--hidden");
}
