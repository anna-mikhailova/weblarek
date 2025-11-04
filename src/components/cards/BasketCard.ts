import { Card } from "../base/Card";
import { IEvents } from "../base/Events";
import { IBasketCard, IBasketCardData } from "../../types";

export class BasketCard extends Card<IBasketCardData> implements IBasketCard {
  protected deleteButton: HTMLButtonElement | null;
  protected indexElement: HTMLElement | null;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.deleteButton = this.container.querySelector(".basket__item-delete");
    this.indexElement = this.container.querySelector(".basket__item-index");

    this.deleteButton?.addEventListener("click", (event) => {
      event.stopPropagation();
      this.events.emit("basket:remove", { id: this.container.dataset.id });
    });
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  set index(value: number) {
    if (this.indexElement) {
      this.indexElement.textContent = value.toString();
    }
  }
}
