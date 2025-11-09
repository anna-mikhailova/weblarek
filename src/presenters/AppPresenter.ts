import { IEvents } from "../components/base/Events";
import { cloneTemplate } from "../utils/utils";
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
  IBasketModel,
  IBuyerModel,
  IProductListModel,
  IWebLarekApi,
  ICardActions,
} from "../types";

export class AppPresenter {
  private events: IEvents;
  private api: IWebLarekApi;

  // Модели
  private productList: IProductListModel;
  private basket: IBasketModel;
  private buyer: IBuyerModel;

  // Представления
  private header!: IHeader;
  private gallery!: IGallery;
  private basketView!: IBasketView;
  private modal!: IModal;
  private orderForm!: IOrderForm;
  private contactsForm!: IContactsForm;
  private successView!: ISuccess;

  constructor(
    productList: IProductListModel,
    basket: IBasketModel,
    buyer: IBuyerModel,
    api: IWebLarekApi,
    events: IEvents,
    header: IHeader,
    gallery: IGallery,
    basketView: IBasketView,
    modal: IModal,
    orderForm: IOrderForm,
    contactsForm: IContactsForm,
    successView: ISuccess,
    private CatalogCardConstructor: new (
      container: HTMLElement,
      actions?: ICardActions
    ) => ICatalogCard,
    private PreviewCardConstructor: new (
      container: HTMLElement,
      actions?: ICardActions
    ) => IPreviewCard,
    private BasketCardConstructor: new (
      container: HTMLElement,
      actions?: ICardActions
    ) => IBasketCard
  ) {
    this.productList = productList;
    this.basket = basket;
    this.buyer = buyer;
    this.api = api;
    this.events = events;
    this.header = header;
    this.gallery = gallery;
    this.basketView = basketView;
    this.modal = modal;
    this.orderForm = orderForm;
    this.contactsForm = contactsForm;
    this.successView = successView;
    this.CatalogCardConstructor = CatalogCardConstructor;
    this.PreviewCardConstructor = PreviewCardConstructor;
    this.BasketCardConstructor = BasketCardConstructor;

    this.subscribeToEvents();
    this.loadProducts();
  }

  private subscribeToEvents() {
    // События от представлений
    // Продукты сохранены в модели
    this.events.on("productModel:setProducts", () => {
      this.renderProducts(this.productList.getProducts());
    });

    // Выбранная карточка товара сохранена в модели
    this.events.on("productModel:setSelected", () => {
      const product = this.productList.getSelectedProduct();
      if (product) {
        this.openProductPreview(this.productList.getSelectedProduct());
      }
    });

    // Товар добавлен в модель корзины
    this.events.on("basketModel:addItem", () => {
      this.updateHeaderCounter(this.basket.getItemsCount());
      this.openProductPreview(this.productList.getSelectedProduct());
    });

    // Товар удален из модели корзины
    this.events.on("basketModel:removeItem", () => {
      this.updateHeaderCounter(this.basket.getItemsCount());
      if (this.productList.getSelectedProduct()) {
        this.openProductPreview(this.productList.getSelectedProduct());
      } else {
        this.updateBasketView(
          this.basket.getItems(),
          this.basket.getTotalPrice()
        );
      }
    });

    // Модальное окно закрыто
    this.events.on("modal:close", () => {
      this.productList.setSelectedProduct(null);
      this.modal.isOpen = false;
    });

    // Клик на иконку корзины
    this.events.on("header:basketClick", () => {
      this.openBasket();
    });

    // Клик на кнопку "Оформить" в корзине
    this.events.on("basket:order", () => {
      this.openOrderForm();
    });

    //события форм
    //выран способ оплаты
    this.events.on("order:selectPayment", (data: { payment: string }) => {
      this.buyer.setPayment(data.payment as "card" | "cash");
    });

    //введен адрес
    this.events.on("order:addressInput", (data: { address: string }) => {
      this.buyer.setAddress(data.address);
    });

    //способ оплаты сохранен в модели
    this.events.on("buyerModel:setPayment", () => {
      this.updateOrderFormErrors();
      this.updatePaymentButtons();
    });

    //адрес сохранен в модели
    this.events.on("buyerModel:setAddress", () => {
      this.updateOrderFormErrors();
    });

    //сабмит формы order
    this.events.on("order:submit", () => {
      this.openContactsForm();
    });

    //введен email
    this.events.on("contacts:emailInput", (data: { email: string }) => {
      this.buyer.setEmail(data.email);
    });

    //введен телефон
    this.events.on("contacts:phoneInput", (data: { phone: string }) => {
      this.buyer.setPhone(data.phone);
    });

    //email сохранен в модель
    this.events.on("buyerModel:setEmail", () => {
      this.updateContactsFormErrors();
    });

    //телефон сохранен в модель
    this.events.on("buyerModel:setPhone", () => {
      this.updateContactsFormErrors();
    });

    //сабмит формы с контактами
    this.events.on("contacts:submit", () => {
      this.processOrder();
    });

    //после успешного отправления заказа
    this.events.on("api:ordrePosted", (data: { total: number }) => {
      // Показываем окно успеха
      this.showSuccess(data.total);
      // Очищаем состояние после успешного заказа
      this.basket.clear();
      this.buyer.clear();
      //Обновляем счетчик в шапке
      this.updateHeaderCounter(0);
    });

    //кнопка в модальном окне с успехом
    this.events.on("success:close", () => {
      this.modal.isOpen = false;
    });
  }

  // Загрузка товаров с сервера и сохранение в модель
  private async loadProducts() {
    try {
      const products = await this.api.getProductList();
      this.productList.setProducts(products);
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
    }
  }

  // Создание карточек товаров для каталога
  private renderProducts(products: IProduct[]) {
    const catalogCards = products.map((product) => {
      const card = new this.CatalogCardConstructor(
        cloneTemplate<HTMLElement>("#card-catalog"),
        { onCatalogCardClick: () => this.selectProduct(product.id) }
      );

      const catalogData: ICatalogCardData = {
        id: product.id,
        category: product.category,
        title: product.title,
        image: { src: product.image, alt: product.title },
        price: product.price || 0,
      };

      return card.render(catalogData as ICatalogCardData);
    });

    this.gallery.render({ items: catalogCards });
  }

  // Сохранение выбранного продукта в модели
  private selectProduct(productId: string) {
    const product = this.productList.getProductById(productId);
    if (product) {
      this.productList.setSelectedProduct(product);
    }
  }

  // Создание и открытие карточки предпросмотра
  private openProductPreview(product: IProduct | null) {
    if (product) {
      const previewCard = new this.PreviewCardConstructor(
        cloneTemplate<HTMLElement>("#card-preview"),
        {
          onPreviewCardBasketClick: () =>
            this.processPreviewCardBasketClick(product.id),
        }
      );
      const inBasket = this.basket.contains(product.id);
      const buttonSettings = this.getSettingsForPreviewButton(
        product.price,
        inBasket
      );

      previewCard.render({
        category: product.category,
        title: product.title,
        image: { src: product.image, alt: product.title },
        price: product.price || 0,
        description: product.description,
        buttonText: buttonSettings.text,
        buttonDisabledOption: buttonSettings.disabled,
      });

      this.modal.content = previewCard.render();
      this.modal.isOpen = true;
    }
  }

  // Логика отображения кнопки в превью
  private getSettingsForPreviewButton(
    price: number | null,
    inBasket: boolean
  ): { text: string; disabled: boolean } {
    if (price === 0 || price === null) {
      // Товар недоступен
      return { text: "Недоступно", disabled: true };
    } else if (inBasket) {
      // Товар уже в корзине
      return { text: "Удалить из корзины", disabled: false };
    } else {
      // Товар доступен для добавления
      return { text: "В корзину", disabled: false };
    }
  }

  // Действия при нажатии на кнопку в Preview карточке
  private processPreviewCardBasketClick(productId: string) {
    if (!this.basket.contains(productId)) {
      this.basket.addItem(
        this.productList.getProductById(productId) as IProduct
      );
    } else {
      this.basket.removeItem(productId);
    }
  }

  // Обновление счетчика товаров в корзине в шапке
  private updateHeaderCounter(count: number) {
    this.header.render({ counter: count });
  }

  // Обновление вида корзины с учетом текущего состояния
  private updateBasketView(items: IProduct[], total: number) {
    const basketCards = items.map((item, index) => {
      const card = new this.BasketCardConstructor(
        cloneTemplate<HTMLElement>("#card-basket"),
        { onRemoveFromBasket: () => this.basket.removeItem(item.id) }
      );
      return card.render({
        index: index + 1,
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

  // Открытие корзины
  private openBasket() {
    this.updateBasketView(this.basket.getItems(), this.basket.getTotalPrice());
    this.modal.content = this.basketView.render();
    this.modal.isOpen = true;
  }

  // Открытие формы заказа
  private openOrderForm() {
    const buyerData = this.buyer.getData();
    const errors = this.buyer.validate();
    const paymentError =
      !buyerData.payment && buyerData.address ? errors.payment : "";
    const addressError =
      buyerData.address && errors.address ? errors.address : "";
    const errorMsg = [paymentError, addressError].filter(Boolean).join(" ");
    const hasErrors = !!(errors.payment || errors.address);

    this.orderForm.render({
      payment: buyerData.payment || undefined,
      address: buyerData.address,
      errors: errorMsg,
      buttonDisabledOption: hasErrors,
    });

    this.modal.content = this.orderForm.render();
    this.modal.isOpen = true;
  }
  // Апдейт ошибок формы контактов
  private updateOrderFormErrors() {
    const buyerData = this.buyer.getData();
    const errors = this.buyer.validate();
    const paymentError =
      !buyerData.payment && buyerData.address ? errors.payment : "";
    const addressError =
      buyerData.payment && errors.address ? errors.address : "";
    const errorMsg = [paymentError, addressError].filter(Boolean).join(" ");
    const hasErrors = !!(errors.payment || errors.address);

    this.orderForm.errors = errorMsg;
    this.orderForm.buttonDisabledOption = hasErrors;
  }

  // Рендер кнопок выбора оплаты
  private updatePaymentButtons() {
    const buyerData = this.buyer.getData();
    if (buyerData.payment) this.orderForm.payment = buyerData.payment;
  }

  // Открытие формы контактов
  private openContactsForm() {
    const buyerData = this.buyer.getData();
    const errors = this.buyer.validate();
    const emailError = buyerData.phone && errors.email ? errors.email : "";
    const phoneError = buyerData.email && errors.phone ? errors.phone : "";
    const errorMsg = [emailError, phoneError].filter(Boolean).join(" ");
    const hasErrors = !!(errors.email || errors.phone);

    this.contactsForm.render({
      email: buyerData.phone,
      phone: buyerData.email,
      errors: errorMsg,
      buttonDisabledOption: hasErrors,
    });

    this.modal.content = this.contactsForm.render();
    this.modal.isOpen = true;
  }

  // Апдейт ошибок формы контактов
  private updateContactsFormErrors() {
    const buyerData = this.buyer.getData();
    const errors = this.buyer.validate();
    const emailError = buyerData.phone && errors.email ? errors.email : "";
    const phoneError = buyerData.email && errors.phone ? errors.phone : "";
    const errorMsg = [emailError, phoneError].filter(Boolean).join(" ");
    const hasErrors = !!(errors.email || errors.phone);

    this.contactsForm.errors = errorMsg;
    this.contactsForm.buttonDisabledOption = hasErrors;
  }

  // Отправление заказа
  private async processOrder() {
    try {
      // Формируем заказ
      const order: IOrder = {
        ...this.buyer.getData(),
        total: this.basket.getTotalPrice(),
        items: this.basket.getItems().map((item) => item.id),
      };

      // Отправляем заказ на сервер
      await this.api.postOrder(order);
    } catch (error) {
      console.error("Ошибка оформления заказа:", error);
    }
  }

  // Рендер успешного заказа
  private showSuccess(total: number) {
    // Показываем успешное оформление
    this.successView.render({ total: total });
    this.modal.content = this.successView.render();
    this.modal.isOpen = true;
  }
}
