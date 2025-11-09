import { IProduct, IProductListModel } from "../../types";
import { IEvents } from "../base/Events";

export class ProductList implements IProductListModel {
  private products: IProduct[];
  private selectedProduct: IProduct | null;
  private events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
    this.products = [];
    this.selectedProduct = null;
  }

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit("productModel:setProducts");
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  setSelectedProduct(product: IProduct | null): void {
    this.selectedProduct = product;
    this.events.emit("productModel:setSelected");
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
