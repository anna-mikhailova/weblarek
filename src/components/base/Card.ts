import { Component } from "../base/Component";
import { categoryMap } from "../../utils/constants";
import { formatPriceForCard } from "../../utils/format";
import { ICard } from "../../types";

export abstract class Card<T> extends Component<T> implements ICard<T> {
  protected categoryElement: HTMLElement | null;
  protected titleElement: HTMLElement | null;
  protected imageElement: HTMLImageElement | null;
  protected priceElement: HTMLElement | null;

  constructor(container: HTMLElement) {
    super(container);
    this.categoryElement = this.container.querySelector(".card__category");
    this.titleElement = this.container.querySelector(".card__title");
    this.imageElement = this.container.querySelector(".card__image");
    this.priceElement = this.container.querySelector(".card__price");
  }

  set category(value: string) {
    if (this.categoryElement) {
      this.categoryElement.textContent = value;
      const className =
        (categoryMap as Record<string, string>)[value] || categoryMap["другое"];
      this.categoryElement.className = `card__category ${className}`;
    }
  }

  set title(value: string) {
    if (this.titleElement) {
      this.titleElement.textContent = value;
    }
  }

  set image(value: { src: string; alt: string }) {
    if (this.imageElement) {
      this.setImage(this.imageElement, value.src, value.alt);
    }
  }

  set price(value: number) {
    if (this.priceElement) {
      this.priceElement.textContent = formatPriceForCard(value);
    }
  }
}
