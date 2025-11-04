import { EventEmitter } from "../components/base/Events";
import { ComponentFactory } from "../components/ComponentFactory";
import { WebLarekApi } from "../components/base/WebLarekApi";
import { ProductList } from "../components/Models/ProductList";
import { Basket } from "../components/Models/Basket";
import { Buyer } from "../components/Models/Buyer";
import {
  IProduct,
  IOrder,
  IHeader,
  IGallery,
  IBasketView,
  IModal,
  IOrderForm,
  IContactsForm,
  ISuccess,
  IPreviewCard,
  ICatalogCardData,
  ICatalogCard,
  IBasketCard,
} from "../types";

export class AppPresenter {
  private events: EventEmitter;
  private api: WebLarekApi;

  // Модели
  private productList: ProductList;
  private basket: Basket;
  private buyer: Buyer;

  // Представления
  private header!: IHeader;
  private gallery!: IGallery;
  private basketView!: IBasketView;
  private modal!: IModal;
  private orderForm!: IOrderForm;
  private contactsForm!: IContactsForm;
  private successView!: ISuccess;

  // Для отслеживания текущей карточки preview
  private currentPreviewCard: IPreviewCard | null = null;
  private currentPreviewProductId: string | null = null;

  constructor(
    productList: ProductList,
    basket: Basket,
    buyer: Buyer,
    api: WebLarekApi,
    events: EventEmitter
  ) {
    this.productList = productList;
    this.basket = basket;
    this.buyer = buyer;
    this.api = api;
    this.events = events;

    this.initializeViews();
    this.subscribeToEvents();
    this.loadProducts();
  }

  private initializeViews() {
    // Инициализация представлений через фабрику
    this.header = ComponentFactory.createHeader(
      document.querySelector(".header") as HTMLElement,
      this.events
    ) as IHeader;

    this.gallery = ComponentFactory.createGallery(
      document.querySelector(".gallery") as HTMLElement
    ) as IGallery;

    this.basketView = ComponentFactory.createBasket(
      "basket",
      this.events
    ) as IBasketView;
    this.modal = ComponentFactory.createModal(
      "modal-container",
      this.events
    ) as IModal;
    this.orderForm = ComponentFactory.createForm(
      "order",
      "order",
      this.events
    ) as IOrderForm;
    this.contactsForm = ComponentFactory.createForm(
      "contacts",
      "contacts",
      this.events
    ) as IContactsForm;
    this.successView = ComponentFactory.createSuccess(
      "success",
      this.events
    ) as ISuccess;
  }

  private subscribeToEvents() {
    // События от представлений

    this.events.on("card:select", (data: { id: string }) => {
      this.selectProduct(data.id);
    });

    this.events.on("card:addToBasket", (data: { id: string }) => {
      this.addToBasket(data.id);
    });

    this.events.on("basket:remove", (data: { id: string }) => {
      this.removeFromBasket(data.id);
    });

    this.events.on("header:basketClick", () => {
      this.openBasket();
    });

    this.events.on("basket:order", () => {
      this.openOrderForm();
    });

    this.events.on(
      "order:submit",
      (data: { payment: string; address: string }) => {
        this.processOrder(data);
      }
    );

    this.events.on(
      "contacts:submit",
      (data: { email: string; phone: string }) => {
        this.processContacts(data);
      }
    );

    this.events.on("success:close", () => {
      this.closeSuccess();
    });

    this.events.on("modal:close", () => {
      this.currentPreviewCard = null;
      this.currentPreviewProductId = null;
    });
  }

  // Загрузка товаров с сервера и сохранение в модель
  private async loadProducts() {
    try {
      const products = await this.api.getProductList();
      this.productList.setProducts(products);
      this.renderProducts(products);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
    }
  }

  // Создание карточек товаров для каталога
  private renderProducts(products: IProduct[]) {
    const catalogCards = products.map((product) => {
      const card = ComponentFactory.createCard(
        "catalog",
        "card-catalog",
        this.events
      ) as ICatalogCard;

      const inBasket = this.basket.contains(product.id);

      const catalogData: ICatalogCardData = {
        id: product.id,
        category: product.category,
        title: product.title,
        image: { src: product.image, alt: product.title },
        price: product.price || 0,
        inBasket: inBasket,
      };

      return card.render(catalogData as ICatalogCardData);
    });

    this.gallery.render({ items: catalogCards });
  }

  // Открытие детального просмотра товара
  private selectProduct(productId: string) {
    const product = this.productList.getProductById(productId);
    if (product) {
      this.openProductPreview(product);
    }
  }

  // Создание и открытие карточки предпросмотра
  private openProductPreview(product: IProduct) {
    const previewCard = ComponentFactory.createCard(
      "preview",
      "card-preview",
      this.events
    ) as IPreviewCard;
    const inBasket = this.basket.contains(product.id);
    // Сохраняем ссылку на текущую карточку
    this.currentPreviewCard = previewCard;
    this.currentPreviewProductId = product.id;
    previewCard.render({
      id: product.id,
      category: product.category,
      title: product.title,
      image: { src: product.image, alt: product.title },
      price: product.price || 0,
      description: product.description,
      inBasket: inBasket,
    });

    this.modal.open(previewCard.render());
  }

  // Добавление товара в корзину
  private addToBasket(productId: string) {
    const product = this.productList.getProductById(productId);
    if (product && !this.basket.contains(productId)) {
      this.basket.addItem(product);
      // обновляем UI
      this.updateBasketView(
        this.basket.getItems(),
        this.basket.getTotalPrice()
      );
      this.updateHeaderCounter(this.basket.getItemsCount());
      this.updateProductCards();
      // обновляем карточку просмотра
      this.updateCurrentPreviewCard();
    }
  }

  // Удаление товара из корзины
  private removeFromBasket(productId: string) {
    this.basket.removeItem(productId);
    // обновляем UI
    this.updateBasketView(this.basket.getItems(), this.basket.getTotalPrice());
    this.updateHeaderCounter(this.basket.getItemsCount());
    this.updateProductCards();
    // обновляем карточку просмотра
    this.updateCurrentPreviewCard();
  }

  // Обновление карточки preview при изменении состояния корзины
  private updateCurrentPreviewCard() {
    if (this.currentPreviewCard && this.currentPreviewProductId) {
      const product = this.productList.getProductById(
        this.currentPreviewProductId
      );
      if (product) {
        const inBasket = this.basket.contains(this.currentPreviewProductId);
        this.currentPreviewCard.render({
          id: product.id,
          category: product.category,
          title: product.title,
          image: { src: product.image, alt: product.title },
          price: product.price || 0,
          description: product.description,
          inBasket: inBasket,
        });
      }
    }
  }

  // Обновление вида корзины с учетом текущего состояния
  private updateBasketView(items: IProduct[], total: number) {
    const basketCards = items.map((item, index) => {
      const card = ComponentFactory.createCard(
        "basket",
        "card-basket",
        this.events
      ) as IBasketCard;
      return card.render({
        index: index + 1,
        id: item.id,
        title: item.title,
        price: item.price,
      });
    });

    const isBasketEmpty = items.length === 0;

    this.basketView.render({
      items: basketCards,
      total: total,
      disabled: isBasketEmpty,
    });
  }

  // Обновление счетчика товаров в корзине в шапке
  private updateHeaderCounter(count: number) {
    this.header.render({ counter: count });
  }

  // Открытие корзины с актуальными данными
  private openBasket() {
    this.updateBasketView(this.basket.getItems(), this.basket.getTotalPrice());
    this.modal.open(this.basketView.render());
  }

  // Открытие формы заказа с проверкой на пустую корзину
  private openOrderForm() {
    if (this.basket.getItemsCount() === 0) {
      return; // Не открываем форму если корзина пуста
    }

    const buyerData = this.buyer.getData();
    this.orderForm.render({
      payment: buyerData.payment || undefined,
      address: buyerData.address,
      valid: false,
      errors: [],
    });

    this.modal.open(this.orderForm.render());
  }
  // Обработка первого шага заказа
  private processOrder(data: { payment: string; address: string }) {
    // Сохраняем данные первого шага
    this.buyer.setPayment(data.payment as "online" | "upon receipt");
    this.buyer.setAddress(data.address);

    // Переходим ко второму шагу
    const buyerData = this.buyer.getData();
    this.contactsForm.render({
      email: buyerData.email,
      phone: buyerData.phone,
      valid: false,
      errors: [],
    });

    this.modal.open(this.contactsForm.render());
  }

  // Обработка второго шага заказа
  private async processContacts(data: { email: string; phone: string }) {
    try {
      // Сохраняем контактные данные
      this.buyer.setEmail(data.email);
      this.buyer.setPhone(data.phone);

      // Формируем заказ
      const order: IOrder = {
        ...this.buyer.getData(),
        total: this.basket.getTotalPrice(),
        items: this.basket.getItems().map((item) => item.id),
      };

      // Отправляем заказ на сервер
      await this.api.postOrder(order);

      // Показываем успешное оформление
      this.successView.render({ total: order.total });
      this.modal.open(this.successView.render());

      // Очищаем состояние после успешного заказа
      this.basket.clear();
      this.buyer.clear();

      //Обновляем счетчик в шапке
      this.updateHeaderCounter(0);
    } catch (error) {
      console.error("Ошибка оформления заказа:", error);
    }
  }

  // Закрытие окна после успешного оформления
  private closeSuccess() {
    this.modal.close();
  }

  // Обновляем карточки в галерее
  private updateProductCards() {
    const products = this.productList.getProducts();
    const catalogCards = products.map((product) => {
      const card = ComponentFactory.createCard(
        "catalog",
        "card-catalog",
        this.events
      ) as ICatalogCard;

      const inBasket = this.basket.contains(product.id);

      return card.render({
        id: product.id,
        category: product.category,
        title: product.title,
        image: { src: product.image, alt: product.title },
        price: product.price || 0,
        inBasket: inBasket,
      });
    });

    this.gallery.render({ items: catalogCards });
  }
}
