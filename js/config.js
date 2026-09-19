// js/config.js

const APP_CONFIG = {
  // 7 прогрессбаров (можно добавлять/удалять)
  progressBars: [
    { id: "bar1", name: "Креативность" },
    { id: "bar2", name: "Создание промптов" },
    { id: "bar3", name: "Исправление ошибок" },
    { id: "bar4", name: "Творчество" },
    { id: "bar5", name: "Активность" }
  ],

  // Список заданий: порядок = порядок разблокировки
  tasks: [
    {
      id: "task1",
      title: "Задание 1: Промпт для сцены",
      description: "Опиши сцену максимально подробно. Используй структуру: окружение - персонажи - внешний вид - одежда - настроение и характер - общий стиль сцены - детали",
      // После выполнения: какой прогрессбар и на сколько пополняется
      rewards: { bar1: 15, bar2: 10, bar4: 10 },
      // Для разблокировки нужно выполнить эти задания (пустой массив = доступно сразу)
      prerequisites: []
    },
    {
      id: "task2",
      title: "Задание 2: Промпт для видео",
      description: "Объясните разницу между margin, padding и border. Приведите пример.",
      rewards: { bar1: 10, bar2: 20, bar5: 10 },
      prerequisites: ["task1"]
    },
    {
      id: "task3",
      title: "Задание 3: Недочеты",
      description: "Сделайте горизонтальный навбар с центрированием и выравниванием по краям.",
      rewards: { bar3: 30, bar5: 20, bar4: 20 },
      prerequisites: ["task2"]
    },
    {
      id: "task4",
      title: "Задание 4: Промпт для видео",
      description: "Напишите функцию, принимающую два числа и возвращающую их сумму.",
      rewards: { bar1: 10, bar2: 15, bar3: 30 },
      prerequisites: ["task3"]
    },
    {
        id: "task5",
        title: "Домашнее задание",
      description: "Создайте ",
      rewards: { bar3: 40, bar1: 65, bar2: 55, bar4: 70, bar5: 70 },
      prerequisites: ["task4"]
    }
    // ... добавляйте новые задания здесь
  ],

  // URL развёрнутого Google Apps Script (получите на следующем шаге)
  googleScriptURL: "https://script.google.com/macros/s/AKfycbyb33G-uyJ7tpepIGSELiJIB5AAOnt28ItNZ6FQ2dJio87tJKYhgECprCzd5bxtA1lrwA/exec"
};
