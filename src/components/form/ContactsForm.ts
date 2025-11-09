import { Form } from "../uibase/Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IContactsForm, IContactsFormData } from "../../types";

export class ContactsForm
  extends Form<IContactsFormData>
  implements IContactsForm
{
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      this.container
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      this.container
    );

    // Обработчик для email
    this.emailInput?.addEventListener("input", () => {
      let timeoutId;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        this.events.emit("contacts:emailInput", {
          email: this.emailInput?.value,
        });
      }, 500);
    });

    // Обработчик для phone
    this.phoneInput?.addEventListener("input", () => {
      let timeoutId;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        this.events.emit("contacts:phoneInput", {
          phone: this.phoneInput?.value,
        });
      }, 500);
    });

    this.formElement.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit("contacts:submit");
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
