import { Component } from "../base/Component";
import { IForm } from "../../types";

export abstract class Form<T> extends Component<T> implements IForm<T> {
  protected formElement: HTMLFormElement;
  protected submitButton: HTMLButtonElement | null;
  protected errorsElement: HTMLElement | null;

  constructor(container: HTMLElement) {
    super(container);
    this.formElement = this.container as HTMLFormElement;
    this.submitButton = this.container.querySelector('button[type="submit"]');
    this.errorsElement = this.container.querySelector(".form__errors");
  }

  set errors(value: string[]) {
    if (this.errorsElement) {
      this.errorsElement.textContent = value.join(", ");
    }
  }

  set valid(value: boolean) {
    if (this.submitButton) {
      this.submitButton.disabled = !value;
    }
  }

  protected abstract validate(): boolean;
}
