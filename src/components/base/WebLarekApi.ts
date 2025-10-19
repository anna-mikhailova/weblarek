import { IApi, IProduct, IOrder, OrderResult } from '../../types';

export class WebLarekApi {
  protected baseApi: IApi;

  constructor(baseApi: IApi) {
    this.baseApi = baseApi;
  }

  async getProductList(): Promise<IProduct[]> {
    const response = await this.baseApi.get<{ items: IProduct[] }>('/product');
    return response.items;
  }

  async postOrder(order: IOrder): Promise<OrderResult> {
    return await this.baseApi.post<OrderResult>('/order', order);
  }
}