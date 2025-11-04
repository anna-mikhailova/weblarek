import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { IHeader, IHeaderData } from "../../types";

export class Header extends Component<IHeaderData> implements IHeader {
  private basketButton: HTMLButtonElement | null;
  private counterElement: HTMLElement | null;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);

    this.basketButton = this.container.querySelector(".header__basket");
    this.counterElement = this.container.querySelector(
      ".header__basket-counter"
    );

    this.basketButton?.addEventListener("click", () => {
      this.events.emit("header:basketClick");
    });
  }

  set counter(value: number) {
    if (this.counterElement) {
      this.counterElement.textContent = value.toString();
    }
  }
}
