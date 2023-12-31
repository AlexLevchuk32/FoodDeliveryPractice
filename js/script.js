// ==================================================================================================================================================================================================================
// Импортируем модули
// Импорт модулей обязательно должен быть в самом начале кода.
require('es6-promise').polyfill();
import 'nodelist-foreach-polyfill';

import calc from './modules/calc';
import cards from './modules/cards';
import forms from './modules/forms';
import modal from './modules/modal';
import slider from './modules/slider';
import tabs from './modules/tabs';
import timer from './modules/timer';
import { openModal } from './modules/modal';

window.addEventListener('DOMContentLoaded', () => {
	// Вызов модального окна через определенное время
	const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 600000);

	// ==================================================================================================================================================================================================================
	// Вызываем функции
	calc();
	cards();
	forms('form', modalTimerId);
	modal('[data-modal]', '.modal', modalTimerId);
	slider({
		container: '.offer__slider',
		slide: '.offer__slide',
		nextArrow: '.offer__slider-next',
		prevArrov: '.offer__slider-prev',
		totalCounter: '#total',
		currentCounter: '#current',
		wrapper: '.offer__slider-wrapper',
		field: '.offer__slider-inner',
	});
	tabs('.tabheader__item', '.tabcontent', '.tabheader', 'tabheader__item_active');
	timer('.timer', '2023-08-31');
});
