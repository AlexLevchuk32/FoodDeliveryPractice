// ==================================================================================================================================================================================================================
// Таймер для акции

function timer(id, deadline) {
	// Устанавливаем дату окончания акции
	// const deadline = '2023-08-31';

	// Опеределяем разницу между окончанием акции и текущим временем
	function getTimeRemaining(endtime) {
		let days, hours, minutes, seconds;
		// Получаем количество миллисекунд
		const time = Date.parse(endtime) - Date.parse(new Date());

		// Проверяем таймер на отрицательные значения
		if (time <= 0) {
			days = 0;
			hours = 0;
			minutes = 0;
			seconds = 0;
		} else {
			// Получаем количество дней
			days = Math.floor(time / (1000 * 60 * 60 * 24));
			// Получаем количество часов
			hours = Math.floor((time / (1000 * 60 * 60)) % 24);
			// Получаем количество минут
			minutes = Math.floor((time / 1000 / 60) % 60);
			// Получаем количество секунд
			seconds = Math.floor((time / 1000) % 60);
		}

		return {
			total: time,
			days: days,
			hours: hours,
			minutes: minutes,
			seconds: seconds,
		};
	}

	// Подставляем ноль перед единичным символом в ячейче
	function getZero(num) {
		if (num >= 0 && num < 10) {
			return `0${num}`;
		} else {
			return num;
		}
	}

	// Устанавливаем таймер на страницу
	function setClock(selector, endtime) {
		const timer = document.querySelector(selector);
		const days = timer.querySelector('#days');
		const hours = timer.querySelector('#hours');
		const minutes = timer.querySelector('#minutes');
		const seconds = timer.querySelector('#seconds');
		const timeInterval = setInterval(updateClock, 1000);

		// Убираем мигание верстки при обновлении страницы
		updateClock();

		// Обновляем таймер каждую секунду
		function updateClock() {
			const t = getTimeRemaining(endtime);

			days.innerHTML = getZero(t.days);
			hours.innerHTML = getZero(t.hours);
			minutes.innerHTML = getZero(t.minutes);
			seconds.innerHTML = getZero(t.seconds);

			if (t.total <= 0) {
				clearInterval(timeInterval);
			}
		}
	}

	setClock(id, deadline);
}

export default timer;
