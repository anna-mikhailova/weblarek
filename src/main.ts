import "./scss/styles.scss";
import { ProductList } from "./components/Models/ProductList";
import { Basket } from "./components/Models/Basket";
import { Buyer } from "./components/Models/Buyer";
import { Api } from "./components/base/Api";
import { WebLarekApi } from "./components/WebLarekApi";
import { API_URL } from "./utils/constants";
import { EventEmitter } from "./components/base/Events";
import { AppPresenter } from "./presenters/AppPresenter";
import { Header } from "./components/ui/Header";
import { Gallery } from "./components/ui/Gallery";
import { Basket as BasketView } from "./components/ui/Basket";
import { Modal } from "./components/ui/Modal";
import { OrderForm } from "./components/form/OrderForm";
import { ContactsForm } from "./components/form/ContactsForm";
import { Success } from "./components/ui/Success";
import { CatalogCard } from "./components/cards/CatalogCard";
import { PreviewCard } from "./components/cards/PreviewCard";
import { BasketCard } from "./components/cards/BasketCard";
import { cloneTemplate } from "./utils/utils";

// Инициализация приложения
document.addEventListener("DOMContentLoaded", () => {
  // Создаем экземпляры моделей и сервисов
  const events = new EventEmitter();

  // Создаем Api с базовым URL и затем передаем его в WebLarekApi
  const api = new WebLarekApi(new Api(API_URL), events);

  // Создаем модели
  const productList = new ProductList(events);
  const basket = new Basket(events);
  const buyer = new Buyer(events);

  // Создаем представления
  const header = new Header(
    document.querySelector(".header") as HTMLElement,
    events
  );
  const gallery = new Gallery(
    document.querySelector(".gallery") as HTMLElement
  );
  const basketView = new BasketView(
    cloneTemplate<HTMLElement>("#basket"),
    events
  );
  const modal = new Modal("modal-container", events);
  const orderForm = new OrderForm(cloneTemplate<HTMLElement>("#order"), events);

  const contactsForm = new ContactsForm(
    cloneTemplate<HTMLElement>("#contacts"),
    events
  );

  const successView = new Success(
    cloneTemplate<HTMLElement>("#success"),
    events
  );

  // Создаем презентер с инъекцией зависимостей
  new AppPresenter(
    productList,
    basket,
    buyer,
    api,
    events,
    header,
    gallery,
    basketView,
    modal,
    orderForm,
    contactsForm,
    successView,
    CatalogCard,
    PreviewCard,
    BasketCard
  );
});
