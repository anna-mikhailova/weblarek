import { Form } from "../base/Form";
import { IEvents } from "../base/Events";
import { IOrderForm, IOrderFormData } from "../../types";

export class OrderForm extends Form<IOrderFormData> implements IOrderForm {
  private paymentButtons: NodeListOf<HTMLButtonElement>;
  private addressInput: HTMLInputElement | null;
  private selectedPayment: string = "";

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.paymentButtons = this.container.querySelectorAll(
      ".order__buttons button"
    );
    this.addressInput = this.container.querySelector('input[name="address"]');

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.setPayment(button.name);
      });
    });

    this.addressInput?.addEventListener("input", () => {
      this.validate();
    });

    this.formElement.addEventListener("submit", (event) => {
      event.preventDefault();
      if (this.validate()) {
        this.events.emit("order:submit", {
          payment: this.selectedPayment,
          address: this.addressInput?.value || "",
        });
      }
    });
  }

  set payment(value: string) {
    this.setPayment(value);
  }

  set address(value: string) {
    if (this.addressInput) {
      this.addressInput.value = value;
      this.validate();
    }
  }

  private setPayment(method: string) {
    this.selectedPayment = method;
    this.paymentButtons.forEach((button) => {
      button.classList.toggle("button_alt-active", button.name === method);
    });
    this.validate();
  }

  protected validate(): boolean {
    const errors: string[] = [];

    if (!this.selectedPayment) {
      errors.push("Выберите способ оплаты");
    }

    if (!this.addressInput?.value.trim()) {
      errors.push("Введите адрес доставки");
    }

    this.errors = errors;
    this.valid = errors.length === 0;
    return errors.length === 0;
  }
}
