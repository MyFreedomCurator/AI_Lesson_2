// js/sheets.js

async function sendToGoogleSheets(username, taskId, answerText, fileInputs) {
  // Собираем файлы, конвертируем в Base64
  const files = [];
  for (const input of fileInputs) {
    const file = input.files[0];
    if (file) {
      const base64 = await fileToBase64(file);
      files.push({ name: file.name, data: base64 });
    } else {
      files.push(null);
    }
  }

  const payload = {
    username: username,
    taskId: taskId,
    answerText: answerText,
    files: files
  };

 // js/sheets.js
const response = await fetch(APP_CONFIG.googleScriptURL, {
  method: "POST",
  body: JSON.stringify(payload),
  // Убираем заголовки вообще, чтобы браузер отправил запрос как "простой" POST
  // headers: { "Content-Type": "text/plain" } 
});

  if (!response.ok) throw new Error("Ошибка сети");
  return response.json();
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // reader.result имеет вид "data:image/png;base64,xxxx"
      // Нам нужна только часть после запятой
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
