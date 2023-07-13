window.addEventListener('DOMContentLoaded', () => {
	// ==================================================================================================================================================================================================================
	// Табы

	const tabs = document.querySelectorAll('.tabheader__item');
	const tabsContent = document.querySelectorAll('.tabcontent');
	const tabsParrent = document.querySelector('.tabheader');

	function hideTabContent() {
		tabsContent.forEach((item) => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});

		tabs.forEach((item) => {
			item.classList.remove('tabheader__item_active');
		});
	}

	// Присваиваем аргумент по умолчанию, т.е. показываем первый элемент из псевдомассива
	function showTabContent(i = 0) {
		tabsContent[i].classList.add('show', 'fade');
		tabsContent[i].classList.remove('hide');
		tabs[i].classList.add('tabheader__item_active');
	}

	hideTabContent();
	showTabContent();

	tabsParrent.addEventListener('click', (event) => {
		const target = event.target;

		if (target && target.classList.contains('tabheader__item')) {
			tabs.forEach((item, i) => {
				if (target == item) {
					hideTabContent();
					showTabContent(i);
				}
			});
		}
	});

	// ==================================================================================================================================================================================================================
	// Таймер для акции

	// Устанавливаем даут окончания акции
	const deadline = '2023-08-31';

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

	setClock('.timer', deadline);

	// ==================================================================================================================================================================================================================
	// Модальное окно

	const modalBtns = document.querySelectorAll('[data-modal]');
	const modal = document.querySelector('.modal');

	// Показываем модальное окно
	function showModal() {
		modal.classList.add('show');
		modal.classList.remove('hide');
		document.body.style.overflow = 'hidden';
		// Если пользователь сам открыл модальное окно, то убираем интервал
		clearInterval(modalTimerId);
	}

	modalBtns.forEach((btn) => {
		btn.addEventListener('click', showModal);
	});

	// Скрываем модальное окно
	function closeModal() {
		modal.classList.add('hide');
		modal.classList.remove('show');
		document.body.style.overflow = '';
	}

	// Закрываем модальное окно по клику на оверлей или на кнопку Esc
	// + вешаем обработчик событий на динамически созданные элементы
	modal.addEventListener('click', (event) => {
		if (event.target === modal || event.target.getAttribute('data-close') == '') {
			closeModal();
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.code === 'Escape' && modal.classList.contains('show')) {
			closeModal();
		}
	});

	// Вызов модального окна через определенное время
	const modalTimerId = setTimeout(showModal, 60000);

	// Показываем модальное окно, если пользователь долистал до конца страницы
	function showModalByScroll() {
		if (
			window.scrollY + document.documentElement.clientHeight >=
			document.documentElement.scrollHeight
		) {
			showModal();
			// Убираем обработчик события по достижения конца страницы
			window.removeEventListener('scroll', showModalByScroll);
		}
	}

	window.addEventListener('scroll', showModalByScroll);

	// ==================================================================================================================================================================================================================
	// Используем классы для карточек меню

	class MenuCard {
		constructor(src, alt, title, descr, price, parentSelector, ...classes) {
			this.src = src;
			this.alt = alt;
			this.title = title;
			this.descr = descr;
			this.price = price;
			this.classes = classes;
			this.parent = document.querySelector(parentSelector);
			this.tansfer = 80;
			this.changeToRub();
		}

		changeToRub() {
			this.price = this.price * this.tansfer;
		}

		render() {
			const element = document.createElement('div');

			if (this.classes.length === 0) {
				this.element = 'menu__item';
				element.classList.add(this.element);
			} else {
				this.classes.forEach((className) => element.classList.add(className));
			}

			element.innerHTML = `
				<img src=${this.src} alt=${this.alt} />
				<h3 class="menu__item-subtitle">${this.title}</h3>
				<div class="menu__item-descr">${this.descr}</div>
				<div class="menu__item-divider"></div>
				<div class="menu__item-price">
					<div class="menu__item-cost">Цена:</div>
					<div class="menu__item-total"><span>${this.price}</span> руб/день</div>
				</div>
			`;

			this.parent.append(element);
		}
	}

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

	// Создаем новые объекты меню и отрисовываем их на странице с использование классов
	// и шаблонизации
	// getResource('http://localhost:3000/menu').then((data) => {
	// 	data.forEach(({ img, altimg, title, descr, price }) => {
	// 		new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
	// 	});
	// });

	// Отрисовываем элементы на странице без использования классов и шаблонизации,
	// а напрямую с сервера или файла БД.
	// getResource('http://localhost:3000/menu').then((data) => {
	// 	createCard(data);
	// });

	// function createCard(data) {
	// 	data.forEach(({ img, altimg, title, descr, price }) => {
	// 		const element = document.createElement('div');

	// 		price = price * 80;

	// 		element.classList.add('menu__item');

	// 		element.innerHTML = `
	// 			<img src=${img} alt=${altimg} />
	// 			<h3 class="menu__item-subtitle">${title}</h3>
	// 			<div class="menu__item-descr">${descr}</div>
	// 			<div class="menu__item-divider"></div>
	// 			<div class="menu__item-price">
	// 				<div class="menu__item-cost">Цена:</div>
	// 				<div class="menu__item-total"><span>${price}</span> руб/день</div>
	// 			</div>
	// 		`;

	// 		document.querySelector('.menu .container').append(element);
	// 	});
	// }

	// Используем библиотеку axios
	// axios автоматически конвертирует json в js-объект
	axios.get('http://localhost:3000/menu').then((data) => {
		data.data.forEach(({ img, altimg, title, descr, price }) => {
			new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
		});
	});

	// ==================================================================================================================================================================================================================
	// Формы, отправка данных на сервер

	const forms = document.querySelectorAll('form');

	const message = {
		loading: '/img/spinner/005 spinner.svg',
		success: 'Спасибо! Скоро мы с вами свяжемся.',
		failure: 'Что-то пошло не так...',
	};

	const postData = async (url, data) => {
		const result = await fetch(url, {
			method: 'POST',
			// Заголовки запроса устанавливать не обязательно, он установится автоматически
			headers: { 'Content-type': 'application/json' },
			body: data,
		});

		return await result.json();
	};

	function bindPostData(form) {
		form.addEventListener('submit', (event) => {
			event.preventDefault();

			// Создаем форму статуса сообщения об отправке
			const statusMessage = document.createElement('img');
			statusMessage.src = message.loading;
			statusMessage.style.cssText = `
				display: block;
				margin: 0 auto;
			`;
			form.insertAdjacentElement('afterend', statusMessage);

			const formData = new FormData(form);

			// Собираем данные с формы и помещаем их в произвольный объект
			// При помощи метода formData.entries превращаем все данные с формы в массив массивов.
			// И далее при помощи метода Object.fromEntries() делаем обратную операию и
			// превращаем наш объект в классический объект и после этого классический объект
			// превращаем в json и отправляем его на сервер.
			const json = JSON.stringify(Object.fromEntries(formData.entries()));

			postData('http://localhost:3000/requests', json)
				.then((data) => {
					console.log(data);
					showThanksModal(message.success);
					form.reset();
					statusMessage.remove();
				})
				.catch(() => {
					showThanksModal(message.failure);
				})
				.finally(() => {
					form.reset();
				});
		});
	}

	forms.forEach((item) => {
		bindPostData(item);
	});

	function showThanksModal(message) {
		const prevModalDialog = document.querySelector('.modal__dialog');

		// Скрываем стандартное модальное окно и показываем окно со статусом заказа
		prevModalDialog.classList.add('hide');
		showModal();

		// Заполняем модальное окно
		const thanksModal = document.createElement('div');
		thanksModal.classList.add('modal__dialog');
		thanksModal.innerHTML = `
			<div class='modal__content'>
				<div class='modal__close' data-close>×</div>
				<div class='modal__title'>
					${message}
				</div>
			</div>
		`;

		// Удаляем модальное окно
		document.querySelector('.modal').append(thanksModal);
		setTimeout(() => {
			thanksModal.remove();
			prevModalDialog.classList.add('show');
			prevModalDialog.classList.remove('hide');
			closeModal();
		}, 4000);
	}
});
