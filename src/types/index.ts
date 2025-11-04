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
  payment: "online" | "upon receipt" | undefined;
  email: string;
  phone: string;
  address: string;
}

export interface IOrder extends IBuyer {
  total: number;
  items: string[];
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
  set valid(value: boolean);
  set errors(value: string[]);
}

export interface ICard<T = any> extends IComponent<T> {
  set category(value: string);
  set title(value: string);
  set image(value: { src: string; alt: string });
  set price(value: number);
}

// Интерфейсы данных для компонентов:
// Данные для карточек
export interface ICatalogCardData
  extends Pick<IProduct, "id" | "category" | "title" | "price"> {
  image: { src: string; alt: string };
  inBasket?: boolean;
}

export interface IPreviewCardData
  extends Pick<
    IProduct,
    "id" | "category" | "title" | "description" | "price"
  > {
  image: { src: string; alt: string };
  inBasket?: boolean;
}

export interface IBasketCardData
  extends Pick<IProduct, "id" | "title" | "price"> {
  index: number;
}

// Данные для форм
export interface IOrderFormData extends Pick<IBuyer, "payment" | "address"> {
  valid: boolean;
  errors: string[];
}

export interface IContactsFormData extends Pick<IBuyer, "email" | "phone"> {
  valid: boolean;
  errors: string[];
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
  set id(value: string);
}

export interface IPreviewCard extends ICard<IPreviewCardData> {
  set id(value: string);
  set description(value: string);
  set inBasket(value: boolean);
}

export interface IBasketCard extends ICard<IBasketCardData> {
  set id(value: string);
  set index(value: number);
}

// Формы
export interface IOrderForm extends IForm<IOrderFormData> {}

export interface IContactsForm extends IForm<IContactsFormData> {}

// UI компоненты
export interface IHeader extends IComponent<IHeaderData> {}

export interface IGallery extends IComponent<IGalleryData> {}

export interface IBasketView extends IComponent<IBasketData> {}

export interface ISuccess extends IComponent<ISuccessData> {}

export interface IModal {
  open(content?: HTMLElement): void;
  close(): void;
  setContent(content: HTMLElement): void;
}
