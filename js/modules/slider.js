function slider({
	container,
	slide,
	nextArrow,
	prevArrov,
	totalCounter,
	currentCounter,
	wrapper,
	field,
}) {
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
	const slides = document.querySelectorAll(slide);
	const prev = document.querySelector(prevArrov);
	const next = document.querySelector(nextArrow);
	const current = document.querySelector(currentCounter);
	const total = document.querySelector(totalCounter);
	const slidesWrapper = document.querySelector(wrapper);
	const slidesField = document.querySelector(field);
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

	const slider = document.querySelector(container);

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
}

export default slider;
