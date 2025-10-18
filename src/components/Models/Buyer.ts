import { IBuyer, ValidationResult } from '../../types';

export class Buyer {
  private payment: 'Онлайн' | 'При получении' | undefined;
  private email: string;
  private phone: string;
  private address: string;

  constructor() {
    this.payment = undefined;
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  setPayment(payment: 'Онлайн' | 'При получении'): void {
    this.payment = payment;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setPhone(phone: string): void {
    this.phone = phone;
  }

  setAddress(address: string): void {
    this.address = address;
  }

  setAllData(payment: 'Онлайн' | 'При получении', email: string, phone: string, address: string): void {
    this.payment = payment;
    this.email = email;
    this.phone = phone;
    this.address = address;
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address
    };
  }

  clear(): void {
    this.payment = undefined;
    this.email = '';
    this.phone = '';
    this.address = '';
  }

  validate(): ValidationResult {
    const errors: ValidationResult = {};

    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }

    if (!this.email) {
      errors.email = 'Укажите email';
    } else if (!this.isValidEmail(this.email)) {
      errors.email = 'Некорректный формат email';
    }

    if (!this.phone) {
      errors.phone = 'Укажите телефон';
    }

    if (!this.address) {
      errors.address = 'Укажите адрес';
    }

    return errors;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}