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

	// Создаем привязку к форме
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

	// Показываем модальное окно
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

	// ==================================================================================================================================================================================================================
	// Слайдер Вариант 1

	// // Получаем элементы со страницы
	// const slides = document.querySelectorAll('.offer__slide');
	// const prev = document.querySelector('.offer__slider-prev');
	// const next = document.querySelector('.offer__slider-next');
	// const current = document.querySelector('#current');
	// const total = document.querySelector('#total');

	// // Создаем начальный индекс для картинки слайдера
	// let slideIndex = 1;

	// // Инициализируем слайдер
	// showSlides(slideIndex);

	// // Отображаем правильное общее количество слайдов
	// if (slides.length < 10) {
	// 	total.textContent = `0${slides.length}`;
	// } else {
	// 	total.textContent = slides.length;
	// }

	// // Отображение слайдов
	// function showSlides(n) {
	// 	// Если слайдов больше n, устанавливаем значение индекса в начало
	// 	if (n > slides.length) {
	// 		slideIndex = 1;
	// 	}

	// 	// Если слайдов меньше 1, устанавливаем значение индекса в конец
	// 	if (n < 1) {
	// 		slideIndex = slides.length;
	// 	}

	// 	slides.forEach((item) => (item.style.display = 'none'));

	// 	slides[slideIndex - 1].style.display = 'block';

	// 	// Отображаем номер текущего слайда
	// 	if (slides.length < 10) {
	// 		current.textContent = `0${slideIndex}`;
	// 	} else {
	// 		current.textContent = slideIndex;
	// 	}
	// }

	// function plusSlides(n) {
	// 	showSlides((slideIndex += n));
	// }

	// prev.addEventListener('click', () => {
	// 	plusSlides(-1);
	// });

	// next.addEventListener('click', () => {
	// 	plusSlides(+1);
	// });

	// ==================================================================================================================================================================================================================
	// Слайдер Вариант 2

	// Получаем элементы со страницы
	const slides = document.querySelectorAll('.offer__slide');
	const prev = document.querySelector('.offer__slider-prev');
	const next = document.querySelector('.offer__slider-next');
	const current = document.querySelector('#current');
	const total = document.querySelector('#total');
	const slidesWrapper = document.querySelector('.offer__slider-wrapper');
	const slidesField = document.querySelector('.offer__slider-inner');
	// Получаем ширину оболочки слайдера
	const width = window.getComputedStyle(slidesWrapper).width;

	let slideIndex = 1;
	// Отступ
	let offset = 0;

	// Отображаем правильное общее количество слайдов
	if (slides.length < 10) {
		total.textContent = `0${slides.length}`;
		current.textContent = `0${slideIndex}`;
	} else {
		total.textContent = slides.length;
		current.textContent = slideIndex;
	}

	// Помекщаем все слайды на страницу
	slidesField.style.width = 100 * slides.length + '%';
	slidesField.style.display = 'flex';
	slidesField.style.transition = '0.5s all';

	// Ограничиваем показ слайдов выходящих за рамки контейнера
	slidesWrapper.style.overflow = 'hidden';

	slides.forEach((slide) => {
		slide.style.width = width;
	});

	// Показываем правильный номер слайда (с нулем)
	function showSlideNumber() {
		if (slides.length < 10) {
			current.textContent = `0${slideIndex}`;
		} else {
			current.textContent = slideIndex;
		}
	}

	// Превращаем строку в числовой тип данных и убираем все буквы
	function removeLetters(str) {
		return +str.replace(/\D/g, '');
	}

	// Показываем следующий слайд
	next.addEventListener('click', () => {
		if (offset == removeLetters(width) * (slides.length - 1)) {
			offset = 0;
		} else {
			offset += removeLetters(width);
		}

		slidesField.style.transform = `translateX(-${offset}px)`;

		if (slideIndex == slides.length) {
			slideIndex = 1;
		} else {
			slideIndex++;
		}

		showSlideNumber();
		showActiveDot();
	});

	prev.addEventListener('click', () => {
		if (offset == 0) {
			offset = removeLetters(width) * (slides.length - 1);
		} else {
			offset -= removeLetters(width);
		}

		slidesField.style.transform = `translateX(-${offset}px)`;

		if (slideIndex == 1) {
			slideIndex = slides.length;
		} else {
			slideIndex--;
		}

		showSlideNumber();
		showActiveDot();
	});

	// ==================================================================================================================================================================================================================
	// Пагинация для слайдера

	const slider = document.querySelector('.offer__slider');

	slider.style.position = 'relative';

	// Добавляем обертку для пагинации
	const dots = document.createElement('ol');
	const dotsArr = [];

	function showActiveDot() {
		dotsArr.forEach((dot) => (dot.style.opacity = 0.5));
		dotsArr[slideIndex - 1].style.opacity = 1;
	}

	dots.classList.add('carousel-dots');
	dots.style.cssText = `
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 15;
		display: flex;
		justify-content: center;
		margin-right: 15%;
		margin-left: 15%;
		list-style: none;
	`;
	slider.append(dots);

	// Создаем  точки пагинации по числу слайдов
	for (let i = 0; i < slides.length; i++) {
		const dot = document.createElement('li');
		dot.setAttribute('data-slide-to', i + 1);
		dot.style.cssText = `
			box-sizing: content-box;
			flex: 0 1 auto;
			width: 30px;
			height: 6px;
			margin-right: 3px;
			margin-left: 3px;
			cursor: pointer;
			background-color: #fff;
			background-clip: padding-box;
			border-top: 10px solid transparent;
			border-bottom: 10px solid transparent;
			opacity: 0.5;
			transition: opacity 0.6s ease;
		`;
		if (i == 0) {
			dot.style.opacity = 1;
		}

		dots.append(dot);
		dotsArr.push(dot);
	}

	dotsArr.forEach((dot) => {
		dot.addEventListener('click', (event) => {
			const slideTo = event.target.getAttribute('data-slide-to');

			// Меняем индекс активного слайда
			slideIndex = slideTo;
			// Преобразуем строчное значение в числовое
			offset = removeLetters(width) * (slideTo - 1);

			// Смещение слайда
			slidesField.style.transform = `translateX(-${offset}px)`;

			// Текущий слайд
			showSlideNumber();

			// Активная точка
			showActiveDot();
		});
	});

	// ==================================================================================================================================================================================================================
	// Калькулятор калорий

	// Получаем элементы
	const result = document.querySelector('.calculating__result span');
	let sex;
	let height;
	let weight;
	let age;
	let ratio;

	// Проверяем сохраненые данные в локальном хранилище
	if (localStorage.getItem('sex')) {
		sex = localStorage.getItem('sex');
	} else {
		sex = 'female';
		localStorage.setItem('sex', 'female');
	}

	if (localStorage.getItem('ratio')) {
		ratio = localStorage.getItem('ratio');
	} else {
		ratio = '1.375';
		localStorage.setItem('ratio', '1.375');
	}

	// Расчет количества калорий
	function calcTotal() {
		if (!sex || !height || !weight || !age || !ratio) {
			result.textContent = '____';
			return;
		}

		if (sex === 'female') {
			result.textContent = Math.round(
				(447.6 + (9.2 * weight + 3.1 * height - 4.3 * age)) * ratio,
			);
		} else {
			result.textContent = Math.round(
				(88.36 + (13.4 * weight + 4.8 * height - 5.7 * age)) * ratio,
			);
		}
	}

	calcTotal();

	// Инициализация калькулятора со значениями сохраненными в локальном хранилище
	function initLocalSettings(selector, activeClass) {
		const elements = document.querySelectorAll(selector);

		elements.forEach((elem) => {
			elem.classList.remove(activeClass);
			if (elem.getAttribute('id') === localStorage.getItem('sex')) {
				elem.classList.add(activeClass);
			}
			if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
				elem.classList.add(activeClass);
			}
		});
	}

	initLocalSettings('#gender div', 'calculating__choose-item_active');
	initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

	// Получаем значения статичных элементов (input)
	function getStaticInformation(selector, activeClass) {
		const elements = document.querySelectorAll(selector);

		// Обработка события click на статичных элементах, именно когда кликаем точно в input,
		// а не рядом с элементом.
		elements.forEach((elem) => {
			elem.addEventListener('click', (event) => {
				if (event.target.getAttribute('data-ratio')) {
					ratio = +event.target.getAttribute('data-ratio');
					localStorage.setItem('ratio', +event.target.getAttribute('data-ratio'));
				} else {
					sex = event.target.getAttribute('id');
					localStorage.setItem('sex', event.target.getAttribute('id'));
				}

				elements.forEach((elem) => {
					elem.classList.remove(activeClass);
				});

				event.target.classList.add(activeClass);

				// console.log(ratio, sex);

				calcTotal();
			});
		});
	}

	getStaticInformation('#gender div', 'calculating__choose-item_active');
	getStaticInformation(
		'.calculating__choose_big div',
		'calculating__choose-item_active',
	);

	// Обрабатываем каждый отдельный input
	function getDynamicInformation(selector) {
		const input = document.querySelector(selector);

		// Проверяем соответсвие строки
		input.addEventListener('input', () => {
			// Проверяем, что в инпуты вводятся только цифры, используем регулярные выражения
			// match(/\D/g) - получаем не цифры, глобально
			if (input.value.match(/\D/g)) {
				input.style.border = '1px solid red';
			} else {
				input.style.border = 'none';
			}

			switch (input.getAttribute('id')) {
				case 'height':
					height = +input.value;
					break;
				case 'weight':
					weight = +input.value;
					break;
				case 'age':
					age = +input.value;
					break;
			}

			calcTotal();
		});
	}

	getDynamicInformation('#height');
	getDynamicInformation('#weight');
	getDynamicInformation('#age');
});
