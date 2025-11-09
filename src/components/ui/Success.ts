import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { formatNumber } from "../../utils/format";
import { ensureElement } from "../../utils/utils";
import { ISuccess, ISuccessData } from "../../types";

export class Success extends Component<ISuccessData> implements ISuccess {
  private descriptionElement: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);
    this.descriptionElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container
    );

    this.closeButton?.addEventListener("click", () => {
      this.events.emit("success:close");
    });
  }

  set total(value: number) {
    const formattedTotal = formatNumber(value);
    this.descriptionElement.textContent = `Списано ${formattedTotal} синапсов`;
  }
}
