import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { formatNumber } from '../../utils/format';
import { ISuccess, ISuccessData } from '../../types';

export class Success extends Component<ISuccessData> implements ISuccess{
    private descriptionElement: HTMLElement | null;
    private closeButton: HTMLButtonElement | null;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);
        this.descriptionElement = this.container.querySelector('.order-success__description');
        this.closeButton = this.container.querySelector('.order-success__close');

        this.closeButton?.addEventListener('click', () => {
            this.events.emit('success:close');
        });
    }

    set total(value: number) {
        if (this.descriptionElement) {
            const formattedTotal = formatNumber(value);
            this.descriptionElement.textContent = `Списано ${formattedTotal} синапсов`;
        }
    }
}