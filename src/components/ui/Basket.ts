import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { formatPriceForBasket } from "../../utils/format";
import { ensureElement } from "../../utils/utils";
import { IBasketView, IBasketData } from "../../types";

export class Basket extends Component<IBasketData> implements IBasketView {
  private listElement: HTMLElement;
  private totalElement: HTMLElement;
  private buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    this.listElement = ensureElement<HTMLElement>(
      ".basket__list",
      this.container
    );
    this.totalElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container
    );

    this.buttonElement?.addEventListener("click", () => {
      if (!this.buttonElement?.disabled) {
        this.events.emit("basket:order");
      }
    });
  }

  set items(value: HTMLElement[]) {
    this.listElement.replaceChildren(...value);
  }

  set total(value: number) {
    this.totalElement.textContent = formatPriceForBasket(value);
  }

  set disabled(value: boolean) {
    this.buttonElement.disabled = value;
  }
}
