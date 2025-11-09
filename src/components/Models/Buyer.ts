import { IBuyerModel, IBuyer, ValidationResult } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer implements IBuyerModel {
  private payment: "card" | "cash" | undefined;
  private email: string;
  private phone: string;
  private address: string;
  private events: IEvents;

  constructor(events: IEvents) {
    this.payment = undefined;
    this.email = "";
    this.phone = "";
    this.address = "";
    this.events = events;
  }

  setPayment(payment: "card" | "cash"): void {
    this.payment = payment;
    this.events.emit("buyerModel:setPayment");
  }

  setEmail(email: string): void {
    this.email = email;
    this.events.emit("buyerModel:setEmail");
  }

  setPhone(phone: string): void {
    this.phone = phone;
    this.events.emit("buyerModel:setPhone");
  }

  setAddress(address: string): void {
    this.address = address;
    this.events.emit("buyerModel:setAddress");
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = undefined;
    this.email = "";
    this.phone = "";
    this.address = "";
  }

  validate(): ValidationResult {
    const errors: ValidationResult = {};

    if (!this.payment) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (!this.email) {
      errors.email = "Укажите email";
    }

    if (!this.phone) {
      errors.phone = "Укажите телефон";
    }

    if (!this.address) {
      errors.address = "Укажите адрес";
    }
    return errors;
  }
}
