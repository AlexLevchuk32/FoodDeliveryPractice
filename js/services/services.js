// Отправляем данные на сервер
const postData = async (url, data) => {
	const result = await fetch(url, {
		method: 'POST',
		// Заголовки запроса устанавливать не обязательно, он установится автоматически
		headers: { 'Content-type': 'application/json' },
		body: data,
	});

	return await result.json();
};

// Получаем данные для карточек из файла db.json
const getResource = async (url) => {
	const result = await fetch(url);

	// Обрабатываем ошибки при выполнении запроса
	// Эта часть обязательна, так как fetch выполнится в любом случае, кроме полного
	// отчутствия интернета.
	if (!result.ok) {
		throw new Error(`Could not fetch ${url}, status: ${result.status}`);
	}

	return await result.json();
};

export { postData, getResource };
