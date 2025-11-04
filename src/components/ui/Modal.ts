import { IEvents } from '../base/Events';
import { IModal } from '../../types';

export class Modal implements IModal {
    private container: HTMLElement;
    private contentElement: HTMLElement;
    private closeButton: HTMLButtonElement;

    constructor(containerId: string, private events: IEvents) {
        this.container = document.getElementById(containerId) as HTMLElement;
        this.contentElement = this.container.querySelector('.modal__content') as HTMLElement;
        this.closeButton = this.container.querySelector('.modal__close') as HTMLButtonElement;

        this.closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.close();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                this.close();
            }
        });
    }

    open(content?: HTMLElement) {
        if (content) {
            this.setContent(content);
        }
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this.events.emit('modal:close');
    }

    setContent(content: HTMLElement) {
        this.contentElement.replaceChildren(content);
    }
}
