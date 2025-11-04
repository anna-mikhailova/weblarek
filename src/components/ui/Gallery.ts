import { Component } from "../base/Component";
import { IGalleryData } from "../../types";

export class Gallery extends Component<IGalleryData> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set items(products: HTMLElement[]) {
    this.container.replaceChildren(...products);
  }
}
