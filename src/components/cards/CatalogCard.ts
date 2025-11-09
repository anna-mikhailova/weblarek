import { Card } from "../uibase/Card";
import { categoryMap } from "../../utils/constants";
import { ensureElement } from "../../utils/utils";
import { ICatalogCard, ICatalogCardData, ICardActions } from "../../types";

export class CatalogCard
  extends Card<ICatalogCardData>
  implements ICatalogCard
{
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );

    if (actions?.onCatalogCardClick) {
      this.container.addEventListener("click", actions.onCatalogCardClick);
    }
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
}
