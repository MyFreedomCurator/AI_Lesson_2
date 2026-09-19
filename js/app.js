// js/app.js

// ===== Глобальное состояние =====
let currentUser = null;
let userProgress = {};      // { task1: true, task2: false, ... }
let completedTasks = [];    // ["task1", "task2"]

// ===== Инициализация =====
document.addEventListener("DOMContentLoaded", () => {
  // Проверяем, есть ли сохранённый пользователь
  const saved = localStorage.getItem("currentUser");
  if (saved) {
    enterDashboard(saved);
  }

  // Кнопка входа
  document.getElementById("enterBtn").addEventListener("click", () => {
    const name = document.getElementById("usernameInput").value.trim();
    if (!name) return alert("Введите имя");
    localStorage.setItem("currentUser", name);
    enterDashboard(name);
  });

  // Загрузка аватара
  document.getElementById("uploadAvatarBtn").addEventListener("click", () => {
    document.getElementById("avatarInput").click();
  });

  document.getElementById("avatarInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      // Аватар хранится отдельно для каждого пользователя
      localStorage.setItem(`avatar_${currentUser}`, dataUrl);
      applyAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  });

  // Кнопки модального окна
  document.getElementById("closeModalBtn").addEventListener("click", closeModal);
  document.getElementById("submitTaskBtn").addEventListener("click", submitTask);
});

// ===== Вход в личный кабинет =====
function enterDashboard(name) {
  currentUser = name;
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("dashboardScreen").classList.remove("hidden");
  document.getElementById("displayName").textContent = name;

  // Загружаем прогресс пользователя
  loadUserProgress();

  // Загружаем аватар
  const avatar = localStorage.getItem(`avatar_${name}`);
  if (avatar) applyAvatar(avatar);

  renderProgressBars();
  renderTasks();
}

function applyAvatar(src) {
  document.getElementById("avatarImg").src = src;
  document.getElementById("avatarImg").classList.remove("hidden");
  document.getElementById("avatarPlaceholder").classList.add("hidden");
}

// ===== Хранение прогресса =====
function loadUserProgress() {
  const key = `progress_${currentUser}`;
  const saved = localStorage.getItem(key);
  if (saved) {
    completedTasks = JSON.parse(saved);
  } else {
    completedTasks = [];
  }
}

function saveUserProgress() {
  const key = `progress_${currentUser}`;
  localStorage.setItem(key, JSON.stringify(completedTasks));
}

// ===== Отрисовка прогрессбаров =====
function renderProgressBars() {
  const container = document.getElementById("progressBarsContainer");
  container.innerHTML = "";

  APP_CONFIG.progressBars.forEach(bar => {
    // Вычисляем текущее значение: суммируем rewards всех выполненных заданий
    let value = 0;
    APP_CONFIG.tasks.forEach(task => {
      if (completedTasks.includes(task.id) && task.rewards[bar.id]) {
        value += task.rewards[bar.id];
      }
    });
    value = Math.min(value, 100);

    const div = document.createElement("div");
    div.className = "progress-item";
    div.innerHTML = `
      <div class="progress-label">${bar.name} <span>${value}%</span></div>
      <div class="progress-track">
        <div class="progress-fill" style="width: ${value}%"></div>
      </div>
    `;
    container.appendChild(div);
  });
}

// ===== Отрисовка сетки заданий =====
function renderTasks() {
  const grid = document.getElementById("tasksGrid");
  grid.innerHTML = "";

  APP_CONFIG.tasks.forEach(task => {
    const isCompleted = completedTasks.includes(task.id);
    const isUnlocked = task.prerequisites.every(pid => completedTasks.includes(pid));

    const card = document.createElement("div");
    card.className = "task-card";
    
    if (isCompleted) card.classList.add("completed");
    else if (isUnlocked) card.classList.add("unlocked");
    else card.classList.add("locked");

    // Иконка замка
    const lockIcon = isUnlocked || isCompleted ? "lock-open.png" : "lock-closed.png";
    
    card.innerHTML = `
      <img src="images/${lockIcon}" alt="lock" class="lock-icon">
      <span class="task-title">${task.title}</span>
    `;

    // Клик работает только для разблокированных и невыполненных заданий
    if (isUnlocked && !isCompleted) {
      card.addEventListener("click", () => openTaskModal(task));
    } else if (isCompleted) {
      card.addEventListener("click", () => alert("Это задание уже выполнено ✅"));
    } else {
      card.addEventListener("click", () => alert("Сначала выполните предыдущие задания"));
    }

    grid.appendChild(card);
  });
}

// ===== Модальное окно =====
let currentTask = null;

function openTaskModal(task) {
  currentTask = task;
  document.getElementById("modalTitle").textContent = task.title;
  document.getElementById("modalDescription").textContent = task.description;
  document.getElementById("answerInput").value = "";
  document.getElementById("fileInput1").value = "";
  document.getElementById("fileInput2").value = "";
  document.getElementById("submitStatus").textContent = "";
  document.getElementById("taskModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("taskModal").classList.add("hidden");
  currentTask = null;
}

// ===== Отправка задания (вызывается из sheets.js) =====
async function submitTask() {
  if (!currentTask) return;
  
  const answerText = document.getElementById("answerInput").value.trim();
  if (!answerText) return alert("Сначала введите ответ");

  const fileInputs = [
    document.getElementById("fileInput1"),
    document.getElementById("fileInput2")
  ];

  document.getElementById("submitStatus").textContent = "Отправка...";

  try {
    await sendToGoogleSheets(currentUser, currentTask.id, answerText, fileInputs);
    
    // Отмечаем как выполненное
    if (!completedTasks.includes(currentTask.id)) {
      completedTasks.push(currentTask.id);
      saveUserProgress();
    }

    document.getElementById("submitStatus").textContent = "Успешно отправлено!";
    
    setTimeout(() => {
      closeModal();
      renderProgressBars();
      renderTasks();
    }, 800);

  } catch (err) {
    console.error(err);
    document.getElementById("submitStatus").textContent = "Ошибка отправки, попробуйте ещё раз.";
  }
}
