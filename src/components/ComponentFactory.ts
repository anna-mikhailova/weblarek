import { IEvents } from "./base/Events";
import { CatalogCard } from "./cards/CatalogCard";
import { PreviewCard } from "./cards/PreviewCard";
import { BasketCard } from "./cards/BasketCard";
import { OrderForm } from "./form/OrderForm";
import { ContactsForm } from "./form/ContactsForm";
import { Basket } from "./ui/Basket";
import { Success } from "./ui/Success";
import { Header } from "./ui/Header";
import { Gallery } from "./ui/Gallery";
import { Modal } from "./ui/Modal";
import {
  ICatalogCard,
  IPreviewCard,
  IBasketCard,
  IOrderForm,
  IContactsForm,
  IBasketView,
  ISuccess,
  IHeader,
  IGallery,
  IModal,
} from "../types";

/*Фабрика компонентов*/
export class ComponentFactory {
  static createCard(
    type: "catalog" | "preview" | "basket",
    templateId: string,
    events: IEvents
  ): ICatalogCard | IPreviewCard | IBasketCard {
    const template = document.getElementById(templateId) as HTMLTemplateElement;
    const content = template.content.cloneNode(true) as DocumentFragment;
    const container = content.firstElementChild as HTMLElement;

    switch (type) {
      case "catalog":
        return new CatalogCard(container, events) as ICatalogCard;
      case "preview":
        return new PreviewCard(container, events) as IPreviewCard;
      case "basket":
        return new BasketCard(container, events) as IBasketCard;
      default:
        throw new Error(`Unknown card type: ${type}`);
    }
  }

  static createForm(
    type: "order" | "contacts",
    templateId: string,
    events: IEvents
  ): IOrderForm | IContactsForm {
    const template = document.getElementById(templateId) as HTMLTemplateElement;
    const content = template.content.cloneNode(true) as DocumentFragment;
    const container = content.firstElementChild as HTMLElement;

    switch (type) {
      case "order":
        return new OrderForm(container, events);
      case "contacts":
        return new ContactsForm(container, events);
      default:
        throw new Error(`Unknown form type: ${type}`);
    }
  }

  static createBasket(templateId: string, events: IEvents): IBasketView {
    const template = document.getElementById(templateId) as HTMLTemplateElement;
    const content = template.content.cloneNode(true) as DocumentFragment;
    const container = content.firstElementChild as HTMLElement;
    return new Basket(container, events);
  }

  static createSuccess(templateId: string, events: IEvents): ISuccess {
    const template = document.getElementById(templateId) as HTMLTemplateElement;
    const content = template.content.cloneNode(true) as DocumentFragment;
    const container = content.firstElementChild as HTMLElement;
    return new Success(container, events);
  }

  static createHeader(container: HTMLElement, events: IEvents): IHeader {
    return new Header(container, events);
  }

  static createGallery(container: HTMLElement): IGallery {
    return new Gallery(container) ;
  }

  static createModal(containerId: string, events: IEvents): IModal {
    return new Modal(containerId, events);
  }
}
