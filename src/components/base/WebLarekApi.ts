import { IApi, IProduct, IOrder, OrderResult } from '../../types';
import { CDN_URL } from '../../utils/constants';

export class WebLarekApi {
  protected baseApi: IApi;
  protected cdn: string;

  constructor(baseApi: IApi) {
    this.baseApi = baseApi;
    this.cdn = CDN_URL;
  }

  async getProductList(): Promise<IProduct[]> {
    const response = await this.baseApi.get<{ items: IProduct[] }>('/product');
    return response.items.map(item => ({
      ...item,
      image: this.getFullImageUrl(item.image)
    }));
  }

  async postOrder(order: IOrder): Promise<OrderResult> {
    return await this.baseApi.post<OrderResult>('/order', order);
  }

  private getFullImageUrl(imagePath: string): string {
    const imageWithPngExtension = imagePath.replace(/\.svg$/i, '.png');
    const cleanPath = imageWithPngExtension.startsWith('/') 
      ? imageWithPngExtension.substring(1) 
      : imageWithPngExtension;
    
    return `${this.cdn}/${cleanPath}`;
  }
}