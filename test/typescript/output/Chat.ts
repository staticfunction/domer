class Chat {

    root: DocumentFragment;
    subject: HTMLLabelElement;
    message: HTMLParagraphElement;
    dataHolder: any;
    displayName: HTMLLabelElement;

    constructor() {
        this.root = document.createDocumentFragment();
        var n0 = document.createElement('div');
        this.subject = document.createElement('label');
        this.subject.setAttribute('class', 'header, important');
        this.message = document.createElement('p');
        this.dataHolder = document.createElement('data');
        var n4 = document.createElement('p');
        var n5 = document.createTextNode('This is some text with a ');
        var n6 = document.createElement('b');
        var n7 = document.createTextNode('bold word.');
        var n8 = document.createElement('div');
        this.displayName = document.createElement('label');
        this.root.appendChild(n0);
        n0.appendChild(this.subject);
        n0.appendChild(this.message);
        n0.appendChild(this.dataHolder);
        n0.appendChild(n4);
        n4.appendChild(n5);
        n4.appendChild(n6);
        n6.appendChild(n7);
        n0.appendChild(n8);
        n8.appendChild(this.displayName);
    }

    appendTo(parent:HTMLElement): void {
        parent.appendChild(this.root);
    }
}

export = Chat;