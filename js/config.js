// js/config.js

const APP_CONFIG = {
  // 7 прогрессбаров (можно добавлять/удалять)
  progressBars: [
    { id: "bar1", name: "Основы HTML" },
    { id: "bar2", name: "Вёрстка CSS" },
    { id: "bar3", name: "Введение в JavaScript" },
    { id: "bar4", name: "Работа с DOM" },
    { id: "bar5", name: "Асинхронность и Fetch" },
    { id: "bar6", name: "Практика проекта" },
    { id: "bar7", name: "Итоговый вызов" }
  ],

  // Список заданий: порядок = порядок разблокировки
  tasks: [
    {
      id: "task1",
      title: "Задание 1: Основы тегов HTML",
      description: "Напишите HTML-страницу с заголовком, абзацем и списком.",
      // После выполнения: какой прогрессбар и на сколько пополняется
      rewards: { bar1: 15 },
      // Для разблокировки нужно выполнить эти задания (пустой массив = доступно сразу)
      prerequisites: []
    },
    {
      id: "task2",
      title: "Задание 2: Блочная модель CSS",
      description: "Объясните разницу между margin, padding и border. Приведите пример.",
      rewards: { bar1: 15, bar2: 10 },
      prerequisites: ["task1"]
    },
    {
      id: "task3",
      title: "Задание 3: Вёрстка на Flexbox",
      description: "Сделайте горизонтальный навбар с центрированием и выравниванием по краям.",
      rewards: { bar2: 20 },
      prerequisites: ["task2"]
    },
    {
      id: "task4",
      title: "Задание 4: Переменные и функции в JS",
      description: "Напишите функцию, принимающую два числа и возвращающую их сумму.",
      rewards: { bar3: 20 },
      prerequisites: ["task3"]
    },
    // ... добавляйте новые задания здесь
  ],

  // URL развёрнутого Google Apps Script (получите на следующем шаге)
  googleScriptURL: "https://script.google.com/macros/s/AKfycbzawmoNwIUuLpQUlDSHghLPANUlKcbtwuY_mUEDpp17lmKhpWHnVtWyDppCUEqJwrs6/exec"
};
