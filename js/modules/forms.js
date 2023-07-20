import { closeModal, showModal } from './modal';
import { postData } from '../services/services';

// ==================================================================================================================================================================================================================
// Формы, отправка данных на сервер
function forms(formSelector, modalTimerId) {
	const forms = document.querySelectorAll(formSelector);

	const message = {
		loading: '/img/spinner/005 spinner.svg',
		success: 'Спасибо! Скоро мы с вами свяжемся.',
		failure: 'Что-то пошло не так...',
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
		showModal('.modal', modalTimerId);

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
			closeModal('.modal');
		}, 4000);
	}
}

export default forms;
