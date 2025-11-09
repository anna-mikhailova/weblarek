import { Card } from "../uibase/Card";
import { categoryMap } from "../../utils/constants";
import { IPreviewCard, IPreviewCardData, ICardActions } from "../../types";
import { ensureElement } from "../../utils/utils";

export class PreviewCard
  extends Card<IPreviewCardData>
  implements IPreviewCard
{
  protected buttonElement: HTMLButtonElement;
  protected descriptionElement: HTMLElement;
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );

    if (actions?.onPreviewCardBasketClick) {
      this.buttonElement?.addEventListener(
        "click",
        actions.onPreviewCardBasketClick
      );
    }
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    const className =
      (categoryMap as Record<string, string>)[value] || categoryMap["другое"];
    this.categoryElement.className = `card__category ${className}`;
  }

  set image(value: { src: string; alt: string }) {
    this.setImage(this.imageElement, value.src, value.alt);
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  set buttonDisabledOption(value: boolean) {
    this.buttonElement.disabled = value;
  }
}
