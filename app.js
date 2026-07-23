const proposals = [
  {
    id: "01",
    label: "Клиентский сервис",
    title: "Личный кабинет клиента",
    summary:
      "После заявки клиент получает персональное пространство, где видит весь процесс строительства и важную информацию по объекту в одном месте.",
    details: [
      "Этап строительства",
      "Фотографии объекта",
      "Документы",
      "Договор",
      "Платежи",
      "График работ",
    ],
    status: "Концепция сформирована",
    image: "/assets/hero.webp",
  },
  {
    id: "02",
    label: "Второе направление",
    title: "Пространство для предложения № 2",
    summary:
      "Отдельный слайд уже готов к наполнению. Структура выдержит текст, цифры, макеты и сравнение «до / после».",
    details: ["Контекст", "Идея", "Эффект"],
    image: "/assets/project-1.webp",
  },
  {
    id: "03",
    label: "Третье направление",
    title: "Пространство для предложения № 3",
    summary:
      "Каждое предложение раскрывается как самостоятельная история, но остаётся частью единого плана развития.",
    details: ["Наблюдение", "Изменение", "Метрика"],
    image: "/assets/project-2.webp",
  },
  {
    id: "04",
    label: "Четвёртое направление",
    title: "Пространство для предложения № 4",
    summary:
      "Этот экран можно дополнить прототипом, скриншотами текущего сайта и аргументами для команды реализации.",
    details: ["Сейчас", "Предлагаем", "Получаем"],
    image: "/assets/quality.webp",
  },
  {
    id: "05",
    label: "Пятое направление",
    title: "Пространство для предложения № 5",
    summary:
      "Визуальная система сохраняет фирменный характер РУБКОФФ и делает подачу решений современной и цельной.",
    details: ["Задача", "Подход", "Ценность"],
    image: "/assets/project-3.webp",
  },
  {
    id: "06",
    label: "Шестое направление",
    title: "Пространство для предложения № 6",
    summary:
      "На слайде можно показать ответственных, приоритет, сроки и трудоёмкость — всё, что нужно для командного обсуждения.",
    details: ["Приоритет", "Ресурсы", "Срок"],
    image: "/assets/house.webp",
  },
  {
    id: "07",
    label: "Седьмое направление",
    title: "Пространство для предложения № 7",
    summary:
      "Финальный пункт завершит презентацию ясным следующим шагом и объединит предложения в дорожную карту.",
    details: ["Итог", "Следующий шаг", "План"],
    image: "/assets/works.webp",
  },
];

const stage = document.querySelector("#stage");
const proposal = document.querySelector("#proposal");
const ambient = document.querySelector("#ambient");
const counter = document.querySelector("#counter-current");
const pagination = document.querySelector("#pagination");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");

let active = 0;
let pointerStart = null;
let dragOffset = 0;
let wheelLocked = false;

function renderPagination() {
  pagination.innerHTML = proposals
    .map(
      (item, index) => `
        <button
          type="button"
          data-index="${index}"
          class="${index === active ? "is-active" : ""}"
          aria-label="Предложение ${index + 1}"
          ${index === active ? 'aria-current="true"' : ""}
        >
          <span>${item.id}</span>
          <i></i>
        </button>
      `,
    )
    .join("");
}

function render() {
  const slide = proposals[active];

  ambient.style.backgroundImage = `url(${slide.image})`;
  counter.textContent = slide.id;
  previous.disabled = active === 0;
  next.disabled = active === proposals.length - 1;

  proposal.style.transform = "";
  proposal.innerHTML = `
    <div class="proposal__image">
      <img src="${slide.image}" alt="" draggable="false" />
      <span class="proposal__index">${slide.id}</span>
      <span class="proposal__status"><i></i>${slide.status || "Готово к наполнению"}</span>
    </div>
    <div class="proposal__body">
      <p class="proposal__label">${slide.label}</p>
      <h2>${slide.title}</h2>
      <p class="proposal__summary">${slide.summary}</p>
      <div class="proposal__details" aria-label="Структура слайда">
        ${slide.details
          .map(
            (detail, index) =>
              `<span><b>0${index + 1}</b>${detail}</span>`,
          )
          .join("")}
      </div>
    </div>
  `;

  proposal.animate(
    [
      { opacity: 0, transform: "translateX(42px)" },
      { opacity: 1, transform: "translateX(0)" },
    ],
    {
      duration: 560,
      easing: "cubic-bezier(.2,.7,.2,1)",
    },
  );

  renderPagination();
}

function goTo(nextIndex) {
  const bounded = Math.max(0, Math.min(proposals.length - 1, nextIndex));
  if (bounded === active) return;
  active = bounded;
  render();
}

previous.addEventListener("click", () => goTo(active - 1));
next.addEventListener("click", () => goTo(active + 1));

pagination.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-index]");
  if (button) goTo(Number(button.dataset.index));
});

stage.addEventListener("pointerdown", (event) => {
  pointerStart = event.clientX;
  stage.setPointerCapture?.(event.pointerId);
});

stage.addEventListener("pointermove", (event) => {
  if (pointerStart === null) return;
  dragOffset = Math.max(-140, Math.min(140, event.clientX - pointerStart));
  proposal.style.transform = `translate3d(${dragOffset}px, 0, 0)`;
});

function finishDrag() {
  if (dragOffset < -55) goTo(active + 1);
  if (dragOffset > 55) goTo(active - 1);
  pointerStart = null;
  dragOffset = 0;
  proposal.style.transform = "";
}

stage.addEventListener("pointerup", finishDrag);
stage.addEventListener("pointercancel", finishDrag);

stage.addEventListener(
  "wheel",
  (event) => {
    if (wheelLocked || Math.abs(event.deltaY) < 20) return;
    wheelLocked = true;
    goTo(active + (event.deltaY > 0 ? 1 : -1));
    window.setTimeout(() => {
      wheelLocked = false;
    }, 650);
  },
  { passive: true },
);

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "PageDown") goTo(active + 1);
  if (event.key === "ArrowLeft" || event.key === "PageUp") goTo(active - 1);
  if (event.key === "Home") goTo(0);
  if (event.key === "End") goTo(proposals.length - 1);
});

render();
