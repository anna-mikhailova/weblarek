// API интерфейсы и типы
export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

export interface IWebLarekApi {
  getProductList(): Promise<IProduct[]>;
  postOrder(order: IOrder): Promise<OrderResult>;
  getFullImageUrl(imagePath: string): string;
}

// Модели данных
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBuyer {
  payment: "card" | "cash" | undefined;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder extends IBuyer {
  total: number;
  items: string[];
}

// Интерфейсы классов моделей
export interface IBasketModel {
  getItems(): IProduct[];
  addItem(product: IProduct): void;
  removeItem(productId: string): void;
  clear(): void;
  getTotalPrice(): number;
  getItemsCount(): number;
  contains(productId: string): boolean;
}

export interface IBuyerModel {
  setPayment(payment: 'card' | 'cash'): void;
  setEmail(email: string): void;
  setPhone(phone: string): void;
  setAddress(address: string): void;
  getData(): IBuyer;
  clear(): void;
  validate(): ValidationResult;
}

export interface IProductListModel {
  setProducts(products: IProduct[]): void;
  getProducts(): IProduct[];
  getProductById(id: string): IProduct | undefined;
  setSelectedProduct(product: IProduct | null): void;
  getSelectedProduct(): IProduct | null;
}

// Результаты операций
export type ValidationResult = {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
};

export type OrderResult = {
  id: string;
  total: number;
};

// Базовые интерфейсы компонентов
export interface IComponent<T = any> {
  render(data?: T): HTMLElement;
}

export interface IForm<T = any> extends IComponent<T> {
  set errors(value: string);
  set buttonText(value:string);
  set buttonDisabledOption(value:boolean);
}

export interface ICard<T = any> extends IComponent<T> {
  set title(value: string);
  set price(value: number);
}

// Интерфейсы данных для компонентов:
// Данные для карточек
export interface ICatalogCardData
  extends Pick<IProduct, "id" | "category" | "title" | "price"> {
  image: { src: string; alt: string };
  //inBasket?: boolean;
}

export interface IPreviewCardData
  extends Pick<
    IProduct,
    "category" | "title" | "description" | "price"
  > {
  image: { src: string; alt: string };
  buttonText: string;
  buttonDisabledOption: boolean;
}

export interface IBasketCardData
  extends Pick<IProduct, "title" | "price"> {
  index: number;
}

// Данные для форм
export interface IOrderFormData extends Pick<IBuyer, "payment" | "address"> {
  errors: string;
  buttonDisabledOption: boolean;
}

export interface IContactsFormData extends Pick<IBuyer, "email" | "phone"> {
  errors: string;
  buttonDisabledOption: boolean;
}

// Данные для UI компонентов
export interface IBasketData {
  items: HTMLElement[];
  total: number;
  disabled: boolean;
}

export interface IHeaderData {
  counter: number;
}

export interface ISuccessData {
  total: number;
}

export interface IGalleryData {
  items: HTMLElement[];
}

// Конкретные интерфейсы компонентов:
// Карточки
export interface ICatalogCard extends ICard<ICatalogCardData> {
  set category(value: string);
  set image(value: { src: string; alt: string });
}

export interface IPreviewCard extends ICard<IPreviewCardData> {
  set category(value: string);
  set image(value: { src: string; alt: string });
  set description(value: string);
  set buttonText(value:string);
  set buttonDisabledOption(value:boolean);
}

export interface IBasketCard extends ICard<IBasketCardData> {
  set index(value: number);
}

// Формы
export interface IOrderForm extends IForm<IOrderFormData> {
  set payment(value: string);
}

export interface IContactsForm extends IForm<IContactsFormData> {}

// UI компоненты
export interface IHeader extends IComponent<IHeaderData> {}

export interface IGallery extends IComponent<IGalleryData> {}

export interface IBasketView extends IComponent<IBasketData> {}

export interface ISuccess extends IComponent<ISuccessData> {}

export interface IModal {
  set content(content: HTMLElement);
  set isOpen(value: boolean);
}

// Интерфейсы для действий карточек
export interface ICardActions {
  onCatalogCardClick?: (event: MouseEvent) => void;
  onPreviewCardBasketClick?: (event: MouseEvent) => void;
  onRemoveFromBasket?: (event: MouseEvent) => void;
}