import { ProductList } from './components/Models/ProductList';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/base/WebLarekApi';
import { API_URL } from './utils/constants';

// Тестирование ProductList
console.log('=== Тест ProductList ===');
const productsModel = new ProductList();
productsModel.setProducts(apiProducts.items);
console.log('Массив товаров из каталога:', productsModel.getProducts());
console.log('Товар по ID 854cef69-976d-4c2a-a18c-2aa45046c390:', productsModel.getProductById('854cef69-976d-4c2a-a18c-2aa45046c390'));

// Тестирование выбранного товара
const product = productsModel.getProductById('c02');
if (product) {
  productsModel.setSelectedProduct(product);
  console.log('Выбранный товар:', productsModel.getSelectedProduct());
}

// Тестирование Basket
console.log('\n=== Тест Basket ===');
const basketModel = new Basket();
const sampleProduct = apiProducts.items[0];
basketModel.addItem(sampleProduct);
basketModel.addItem(apiProducts.items[1]);
console.log('Товары в корзине:', basketModel.getItems());
console.log('Общая стоимость:', basketModel.getTotalPrice());
console.log('Количество товаров:', basketModel.getItemsCount());
console.log('Содержит товар 854cef69-976d-4c2a-a18c-2aa45046c390:', basketModel.contains('854cef69-976d-4c2a-a18c-2aa45046c390'));

// Удаление товара
basketModel.removeItem('854cef69-976d-4c2a-a18c-2aa45046c390');
console.log('После удаления 854cef69-976d-4c2a-a18c-2aa45046c390:', basketModel.getItems());
console.log('Новая общая стоимость:', basketModel.getTotalPrice());

// Очистка корзины
basketModel.clear();
console.log('После очистки корзины:', basketModel.getItems());

// Тестирование Buyer
console.log('\n=== Тест Buyer ===');
const buyerModel = new Buyer();
buyerModel.setEmail('test@example.com');
buyerModel.setPhone('+79991234567');
buyerModel.setAddress('ул. Примерная, д. 1');
buyerModel.setPayment('online');

console.log('Данные покупателя:', buyerModel.getData());
console.log('Валидация полных данных:', buyerModel.validate());

// Тест с неполными данными
console.log('\n=== Тест с неполными данными ===');
const incompleteBuyer = new Buyer();
incompleteBuyer.setEmail('test@example.com');
console.log('Неполные данные:', incompleteBuyer.getData());
console.log('Валидация неполных данных:', incompleteBuyer.validate());

// Тест с некорректным email
console.log('\n=== Тест с некорректным email ===');
const invalidEmailBuyer = new Buyer();
invalidEmailBuyer.setEmail('invalid-email');
invalidEmailBuyer.setPhone('+79991234567');
invalidEmailBuyer.setAddress('ул. Примерная, д. 1');
invalidEmailBuyer.setPayment('upon receipt');
console.log('Валидация с некорректным email:', invalidEmailBuyer.validate());

// Тестирование setAllData
console.log('\n=== Тестирование setAllData ===');
const newBuyer = new Buyer();
newBuyer.setAllData('upon receipt', 'new@example.com', '+79998887766', 'ул. Новая, д. 5');
console.log('Данные после setAllData:', newBuyer.getData());

// Очистка данных покупателя
buyerModel.clear();
console.log('\nПосле очистки данных покупателя:', buyerModel.getData());

// Тестирование API
console.log('\n=== Тестирование API ===');

// Создаем экземпляр базового API
const baseApi = new Api(API_URL);

// Создаем экземпляр API для веб-ларка
const webLarekApi = new WebLarekApi(baseApi);

// Создаем модель каталога товаров
const newProductsModel = new ProductList();

// Получаем товары с сервера и сохраняем в модель
webLarekApi.getProductList()
  .then(products => {
    console.log('Получены товары с сервера:', products);
    
    // Сохраняем товары в модель
    newProductsModel.setProducts(products);
    
    // Проверяем, что товары сохранились в модели
    console.log('Товары в модели после сохранения:', newProductsModel.getProducts());
    console.log('Количество товаров в каталоге:', newProductsModel.getProducts().length);
    
    // Тестируем получение товара по ID
    if (products.length > 0) {
      const firstProductId = products[0].id;
      console.log('Первый товар по ID:', newProductsModel.getProductById(firstProductId));
    }
  })
  .catch(error => {
    console.error('Ошибка при получении товаров:', error);
  });