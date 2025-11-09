import { Component } from "../base/Component";
import { IForm } from "../../types";
import { ensureElement } from "../../utils/utils";

export abstract class Form<T> extends Component<T> implements IForm<T> {
  protected formElement: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.formElement = this.container as HTMLFormElement;
    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      this.container
    );
    this.errorsElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container
    );
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }

  set buttonText(value: string) {
    this.submitButton.textContent = value;
  }

  set buttonDisabledOption(value: boolean) {
    this.submitButton.disabled = value;
  }
}
