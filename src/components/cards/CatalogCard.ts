import { Card } from "../base/Card";
import { IEvents } from "../base/Events";
import { ICatalogCard, ICatalogCardData } from "../../types";

export class CatalogCard
  extends Card<ICatalogCardData>
  implements ICatalogCard
{
  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.container.addEventListener("click", () => {
      this.events.emit("card:select", { id: this.container.dataset.id });
    });
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }
}
