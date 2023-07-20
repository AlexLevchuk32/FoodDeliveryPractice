// Показываем модальное окно
function showModal(modalSelector, modalTimerId) {
	const modal = document.querySelector(modalSelector);

	modal.classList.add('show');
	modal.classList.remove('hide');
	document.body.style.overflow = 'hidden';
	// Если пользователь сам открыл модальное окно, то убираем интервал

	// console.log(modalTimerId);
	if (modalTimerId) {
		clearInterval(modalTimerId);
	}
}

// Скрываем модальное окно
function closeModal(modalSelector) {
	const modal = document.querySelector(modalSelector);

	modal.classList.add('hide');
	modal.classList.remove('show');
	document.body.style.overflow = '';
}

// ==================================================================================================================================================================================================================
// Модальное окно
function modal(triggerSelector, modalSelector, modalTimerId) {
	const modalBtns = document.querySelectorAll(triggerSelector);
	const modal = document.querySelector(modalSelector);

	modalBtns.forEach((btn) => {
		btn.addEventListener('click', () => showModal(modalSelector, modalTimerId));
	});

	// Закрываем модальное окно по клику на оверлей или на кнопку Esc
	// + вешаем обработчик событий на динамически созданные элементы
	modal.addEventListener('click', (event) => {
		if (event.target === modal || event.target.getAttribute('data-close') == '') {
			closeModal(modalSelector);
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.code === 'Escape' && modal.classList.contains('show')) {
			closeModal(modalSelector);
		}
	});

	// Показываем модальное окно, если пользователь долистал до конца страницы
	function showModalByScroll() {
		if (
			window.scrollY + document.documentElement.clientHeight >=
			document.documentElement.scrollHeight
		) {
			showModal(modalSelector, modalTimerId);
			// Убираем обработчик события по достижения конца страницы
			window.removeEventListener('scroll', showModalByScroll);
		}
	}

	window.addEventListener('scroll', showModalByScroll);
}

export default modal;
export { closeModal, showModal };
