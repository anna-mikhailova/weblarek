import { Form } from "../uibase/Form";
import { IEvents } from "../base/Events";
import { IOrderForm, IOrderFormData } from "../../types";
import { ensureElement } from "../../utils/utils";

export class OrderForm extends Form<IOrderFormData> implements IOrderForm {
  private paymentButtons: NodeListOf<HTMLButtonElement>;
  private addressInput: HTMLInputElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.paymentButtons = this.container.querySelectorAll(
      ".order__buttons button"
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container
    );

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.events.emit("order:selectPayment", { payment: button.name });
      });
    });

    this.addressInput?.addEventListener("input", () => {
      let timeoutId;
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        const address = this.addressInput.value;
        this.events.emit("order:addressInput", { address });
      }, 500);
    });

    this.formElement.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit("order:submit");
    });
  }

  set payment(value: string) {
    this.paymentButtons.forEach((button) => {
      button.classList.toggle("button_alt-active", button.name === value);
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
