import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IHeader, IHeaderData } from "../../types";
import { ensureElement } from "../../utils/utils";

export class Header extends Component<IHeaderData> implements IHeader {
  private basketButton: HTMLButtonElement;
  private counterElement: HTMLElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);

    this.basketButton = ensureElement<HTMLButtonElement>(".header__basket", this.container);
    this.counterElement = ensureElement<HTMLElement>(".header__basket-counter", this.container);

    this.basketButton?.addEventListener("click", () => {
      this.events.emit("header:basketClick");
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = value.toString();
  }
}
