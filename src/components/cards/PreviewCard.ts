import { Card } from "../base/Card";
import { IEvents } from "../base/Events";
import { IPreviewCard, IPreviewCardData } from "../../types";

export class PreviewCard
  extends Card<IPreviewCardData>
  implements IPreviewCard
{
  protected buttonElement: HTMLButtonElement | null;
  protected descriptionElement: HTMLElement | null;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.buttonElement = this.container.querySelector(".card__button");
    this.descriptionElement = this.container.querySelector(".card__text");

    this.buttonElement?.addEventListener("click", (event) => {
      event.stopPropagation();

      // Если товар недоступен (цена 0), ничего не делаем
      if (this.container.dataset.price === "0") {
        return;
      }
      if (this.container.dataset.inBasket === "true") {
        this.events.emit("basket:remove", { id: this.container.dataset.id });
      } else {
        this.events.emit("card:addToBasket", { id: this.container.dataset.id });
      }
    });
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set description(value: string) {
    if (this.descriptionElement) {
      this.descriptionElement.textContent = value;
    }
  }

  set inBasket(value: boolean) {
    this.container.dataset.inBasket = value.toString();
    this.updateButton();
  }

  set price(value: number) {
    super.price = value;
    this.container.dataset.price = value.toString();
    this.updateButton();
  }

  private updateButton() {
    if (!this.buttonElement) return;

    const price = Number(this.container.dataset.price);
    const inBasket = this.container.dataset.inBasket === "true";

    if (price === 0) {
      // Товар недоступен
      this.buttonElement.textContent = "Недоступно";
      this.buttonElement.disabled = true;
    } else if (inBasket) {
      // Товар уже в корзине
      this.buttonElement.textContent = "Удалить из корзины";
      this.buttonElement.disabled = false;
    } else {
      // Товар доступен для добавления
      this.buttonElement.textContent = "В корзину";
      this.buttonElement.disabled = false;
    }
  }
}
