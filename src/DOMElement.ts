// It's better to provide a Params type when
// we have a lot of arguments, it makes it look like named parameters and is very convinient

type DOMElementConstructorParams = {
  styles: string | string[];
  parent?: HTMLElement | null;
  text?: Promise<string | string[]> | string | string[];
  link?: string;
};

export class DOMElement {
  parent: HTMLElement;
  // The name seems inappropriate, it's better to rename the field to something like classList
  styles: string | string[];
  element: HTMLElement;

  constructor(params: DOMElementConstructorParams) {
    // We can also provide a default value for the parent field but it's up to you if you want to keep it this way
    this.parent = params.parent ?? document.body;
    this.styles = params.styles;
    this.element = document.createElement('div');
    this.element = this.addStyles(this.styles);
    // Use curly braces for if's content
    if (params.text) this.addText(params.text);
  }

  appendToDom(): HTMLElement {
    const elementAlreadyAppended = this.parent.querySelector(`.${this.styles}`) !== null;
    // Use curly braces for if's content
    if (!elementAlreadyAppended) this.parent.appendChild(this.element);
    return this.element;
  }

  prependToDom(overwrite?: boolean): HTMLElement {
    const existedElement = this.parent.querySelector(`:scope > .${this.styles}`);
    if (existedElement) {
      // Use curly braces for if's content
      if (overwrite) this.parent.removeChild(existedElement);
      else return this.element;
    }
    this.parent.prepend(this.element);
    return this.element;
  }

  addStyles(styles: string | string[]): HTMLElement {
    this.style(this.element, styles);
    return this.element;
  }

  private async addText(text: Promise<string | string[]> | string | string[]) {
    // Use curly braces for if's content
    if (text instanceof Promise) text = await text;
    if (typeof text === 'string') {
      this.appendText(text);
    } // Add curly braces, also replace . with ?. or it will throw an error in some cases
    else
      text.forEach((textElement) => {
        this.appendText(textElement);
      });
  }

  private appendText(text: string) {
    const textElem = document.createElement('span');
    const textNode = document.createTextNode(text);
    textElem.appendChild(textNode);
    this.element.appendChild(textElem);
  }

  private style(elem: HTMLElement, styles: string | string[]): HTMLElement {
    if (typeof styles === 'string') {
      elem.classList.add(styles);
    } else {
      // Replace . with ?. or it will throw an error in some cases
      styles.forEach((style) => {
        elem.classList.add(style);
      });
    }
    return elem;
  }
}
