import './scss/styles.scss';
import { ProductList } from './components/Models/ProductList';
import { Basket } from './components/Models/Basket';
import { Buyer } from './components/Models/Buyer';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/base/WebLarekApi';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { AppPresenter } from './presenters/AppPresenter';

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
  // Создаем экземпляры моделей и сервисов
  const events = new EventEmitter();
  
  // Создаем Api с базовым URL и затем передаем его в WebLarekApi
  const api = new WebLarekApi(
      new Api(API_URL)
  );
  
  const productList = new ProductList();
  const basket = new Basket();
  const buyer = new Buyer();

  // Создаем презентер с инъекцией зависимостей
  new AppPresenter(productList, basket, buyer, api, events);
});