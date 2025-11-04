import { Form } from "../base/Form";
import { IEvents } from "../base/Events";
import { IContactsForm, IContactsFormData } from "../../types";

export class ContactsForm
  extends Form<IContactsFormData>
  implements IContactsForm
{
  private emailInput: HTMLInputElement | null;
  private phoneInput: HTMLInputElement | null;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.emailInput = this.container.querySelector('input[name="email"]');
    this.phoneInput = this.container.querySelector('input[name="phone"]');

    [this.emailInput, this.phoneInput].forEach((input) => {
      input?.addEventListener("input", () => {
        this.validate();
      });
    });

    this.formElement.addEventListener("submit", (event) => {
      event.preventDefault();
      if (this.validate()) {
        this.events.emit("contacts:submit", {
          email: this.emailInput?.value || "",
          phone: this.phoneInput?.value || "",
        });
      }
    });
  }

  set email(value: string) {
    if (this.emailInput) {
      this.emailInput.value = value;
      this.validate();
    }
  }

  set phone(value: string) {
    if (this.phoneInput) {
      this.phoneInput.value = value;
      this.validate();
    }
  }

  protected validate(): boolean {
    const errors: string[] = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.emailInput?.value || "")) {
      errors.push("Введите корректный email");
    }

    const phoneRegex = /^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/;
    if (!phoneRegex.test(this.phoneInput?.value || "")) {
      errors.push("Введите телефон в формате +7 (XXX) XXX-XX-XX");
    }

    this.errors = errors;
    this.valid = errors.length === 0;
    return errors.length === 0;
  }
}
