import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentEl.insertAdjacentHTML('beforeend', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner() {
    const html = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>`;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', html);
  }

  renderError(message = this._errorMessage) {
    this._clear();

    const html = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
          `;

    this._parentEl.insertAdjacentHTML('afterbegin', html);
  }

  renderMessage(message = this._successMessage) {
    this._clear();

    const html = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
          `;

    this._parentEl.insertAdjacentHTML('afterbegin', html);
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }
}
