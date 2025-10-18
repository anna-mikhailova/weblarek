import { IProduct } from '../../types';

export class Basket {
  private items: IProduct[];

  constructor() {
    this.items = [];
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.id !== productId);
  }

  clear(): void {
    this.items = [];
  }

  getTotalPrice(): number {
    let total = 0;
    for (const item of this.items) {
      total += item.price || 0;
    }
    return total;
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