import { Component } from "../base/Component";
import { formatPriceForCard } from "../../utils/format";
import { ICard } from "../../types";
import { ensureElement } from "../../utils/utils";

export abstract class Card<T> extends Component<T> implements ICard<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.container
    );
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number) {
    this.priceElement.textContent = formatPriceForCard(value);
  }
}
