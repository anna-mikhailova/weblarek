/*Форматирует число с пробелами между тысячами только если >= 10000*/
export function formatNumber(number: number): string {
  if (number >= 10000) {
      return number.toLocaleString('ru-RU');
  }
  return number.toString();
}

/*Форматирует цену для карточек товаров (заменяет 0 на "Бесценно")*/
export function formatPriceForCard(price: number): string {
  if (price === 0) {
      return 'Бесценно';
  }
  const formattedNumber = formatNumber(price);
  return `${formattedNumber} синапсов`;
}

/*Форматирует цену для корзины (оставляет 0 синапсов) */

export function formatPriceForBasket(price: number): string {
  const formattedNumber = formatNumber(price);
  return `${formattedNumber} синапсов`;
}