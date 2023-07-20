import { getResource } from '../services/services';

// ==================================================================================================================================================================================================================
// Используем классы для карточек меню

function cards() {
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

	// Создаем новые объекты меню и отрисовываем их на странице с использование классов
	// и шаблонизации
	getResource('http://localhost:3000/menu').then((data) => {
		data.forEach(({ img, altimg, title, descr, price }) => {
			new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
		});
	});

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

	// // Используем библиотеку axios
	// // axios автоматически конвертирует json в js-объект
	// axios.get('http://localhost:3000/menu').then((data) => {
	// 	data.data.forEach(({ img, altimg, title, descr, price }) => {
	// 		new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
	// 	});
	// });
}

export default cards;
