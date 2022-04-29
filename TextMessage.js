class TextMessage {
  constructor({ text, onComplete }) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
  }

  createElement() {
    // create the element
    this.element = document.createElement('div');
    this.element.classList.add('TextMessage');

    this.element.innerHTML = `
      <p class="TextMessage_p">${this.text}</p>
    `;

    this.actionListener = new KeyPressListener('Enter', () => {
      this.actionListener.unbind();
      this.done();
    });
  }

  done() {
    this.element.remove();
    this.onComplete();
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
  }
}
