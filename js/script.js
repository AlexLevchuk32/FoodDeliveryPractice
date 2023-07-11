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

	// Создаем новые объекты
	new MenuCard(
		'img/tabs/vegy.jpg',
		'vegy',
		'Меню "Фитнес"',
		'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
		7,
		'.menu .container',
		'menu__item',
	).render();

	new MenuCard(
		'img/tabs/elite.jpg',
		'elite',
		'Меню “Премиум”',
		'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное фрукты - ресторанное меню без похода в ресторан!',
		13,
		'.menu .container',
		'menu__item',
	).render();

	new MenuCard(
		'img/tabs/post.jpg',
		'post',
		'Меню "Постное"',
		'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
		6,
		'.menu .container',
		'menu__item',
	).render();

	// ==================================================================================================================================================================================================================
	// Формы, отправка данных на сервер

	const forms = document.querySelectorAll('form');

	const message = {
		loading: '/img/spinner/005 spinner.svg',
		success: 'Спасибо! Скоро мы с вами свяжемся.',
		failure: 'Что-то пошло не так...',
	};

	function postData(form) {
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

			const request = new XMLHttpRequest();
			request.open('POST', '/server.php');

			// Заголовки запроса устанавливать не обязательно, он установится автоматически
			request.setRequestHeader('Content-type', 'application/json');
			const formData = new FormData(form);

			// Собираем данные с формы и помещаем их в произвольный объект
			const object = {};
			formData.forEach((value, key) => {
				object[key] = value;
			});

			const json = JSON.stringify(object);

			request.send(json);

			request.addEventListener('load', () => {
				if (request.status === 200) {
					console.log(request.response);
					showThanksModal(message.success);
					form.reset();
					statusMessage.remove();
				} else {
					showThanksModal(message.failure);
				}
			});
		});
	}

	forms.forEach((item) => {
		postData(item);
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
