import { IEvents } from "../base/Events";
import { IModal } from "../../types";
import { ensureElement } from "../../utils/utils";

export class Modal implements IModal {
  private container: HTMLElement;
  private contentElement: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(containerId: string, private events: IEvents) {
    this.container = document.getElementById(containerId) as HTMLElement;
    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container
    );

    this.closeButton.addEventListener("click", () => {
      this.events.emit("modal:close");
    });
    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.events.emit("modal:close");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.events.emit("modal:close");
      }
    });
  }

  set content(content: HTMLElement) {
    this.contentElement.replaceChildren(content);
  }

  set isOpen(value: boolean) {
    this.container.classList.toggle("modal_active", value);
  }
}
