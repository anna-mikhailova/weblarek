import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { formatPriceForBasket } from "../../utils/format";
import { IBasketView, IBasketData } from "../../types";

export class Basket extends Component<IBasketData> implements IBasketView {
  private listElement: HTMLElement | null;
  private totalElement: HTMLElement | null;
  private buttonElement: HTMLButtonElement | null;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    this.listElement = this.container.querySelector(".basket__list");
    this.totalElement = this.container.querySelector(".basket__price");
    this.buttonElement = this.container.querySelector(".basket__button");

    this.buttonElement?.addEventListener("click", () => {
      if (!this.buttonElement?.disabled) {
        this.events.emit("basket:order");
      }
    });
  }

  set items(value: HTMLElement[]) {
    if (this.listElement) {
      this.listElement.replaceChildren(...value);
    }
  }

  set total(value: number) {
    if (this.totalElement) {
      this.totalElement.textContent = formatPriceForBasket(value);
    }
  }

  set disabled(value: boolean) {
    if (this.buttonElement) {
      this.buttonElement.disabled = value;

      if (value) {
        this.buttonElement.classList.add("button_disabled");
      } else {
        this.buttonElement.classList.remove("button_disabled");
      }
    }
  }
}
