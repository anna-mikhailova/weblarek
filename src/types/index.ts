export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
  }
  
  export interface IBuyer {
    payment: 'online' | 'upon receipt' | undefined;
    email: string;
    phone: string;
    address: string;
  }

  export interface IOrder extends IBuyer {
    total: number;  
    items: string[];    
  }
  
  export type ValidationResult = {
    payment?: string;
    email?: string;
    phone?: string;
    address?: string;
  }

  export type OrderResult = {
    id: string;     
    total: number;  
  }

