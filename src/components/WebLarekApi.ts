import { IApi, IProduct, IOrder, OrderResult, IWebLarekApi } from '../types';
import { CDN_URL } from '../utils/constants';
import { IEvents } from './base/Events';

export class WebLarekApi implements IWebLarekApi {
  protected baseApi: IApi;
  protected cdn: string;

  constructor(baseApi: IApi, private events: IEvents) {
    this.baseApi = baseApi;
    this.cdn = CDN_URL;
    this.events = events;
  }

  async getProductList(): Promise<IProduct[]> {
    const response = await this.baseApi.get<{ items: IProduct[] }>('/product');
    return response.items.map(item => ({
      ...item,
      image: this.getFullImageUrl(item.image)
    }));
  }

  async postOrder(order: IOrder): Promise<OrderResult> {
    const response = await this.baseApi.post<OrderResult>('/order', order);
    this.events.emit("api:ordrePosted", {total: response.total});
    return response;
  }

  getFullImageUrl(imagePath: string): string {
    const imageWithPngExtension = imagePath.replace(/\.svg$/i, '.png');
    const cleanPath = imageWithPngExtension.startsWith('/') 
      ? imageWithPngExtension.substring(1) 
      : imageWithPngExtension;
    
    return `${this.cdn}/${cleanPath}`;
  }
}