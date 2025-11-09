import { Card } from "../uibase/Card";
import { IBasketCard, IBasketCardData, ICardActions } from "../../types";
import { ensureElement } from "../../utils/utils";

export class BasketCard extends Card<IBasketCardData> implements IBasketCard {
  protected deleteButton: HTMLButtonElement;
  protected indexElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container
    );
    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container
    );

    if (actions?.onRemoveFromBasket) {
      this.deleteButton?.addEventListener("click", actions.onRemoveFromBasket!);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = value.toString();
  }
}
