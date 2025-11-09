import { IProduct, IBasketModel } from "../../types";
import { IEvents } from "../base/Events";

export class Basket implements IBasketModel {
  private items: IProduct[];
  private events: IEvents;

  constructor(events: IEvents) {
    this.items = [];
    this.events = events;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    this.events.emit("basketModel:addItem");
  }

  removeItem(productId: string): void {
    this.items = this.items.filter((item) => item.id !== productId);
    this.events.emit("basketModel:removeItem");
  }

  clear(): void {
    this.items = [];
    this.events.emit("basketModel:removeItem");
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price || 0), 0);
  }

  getItemsCount(): number {
    return this.items.length;
  }

  contains(productId: string): boolean {
    for (const item of this.items) {
      if (item.id === productId) {
        return true;
      }
    }
    return false;
  }
}
