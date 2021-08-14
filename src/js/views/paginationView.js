import View from './View';
import icons from 'url:../../img/icons.svg';
import { RES_PER_PAGE } from '../config';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');
  _currentPage;

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goTo = +btn.dataset.goto;

      handler(goTo);
    });
  }

  _generateMarkup() {
    this._currentPage = this._data.page;
    const numPages = Math.ceil(this._data.results.length / RES_PER_PAGE);

    // Page 1, we have other pages
    if (this._currentPage === 1 && numPages > 1) {
      return this._generateMarkupButton(false);
    }

    // Last page
    if (this._currentPage === numPages && numPages > 1) {
      return this._generateMarkupButton(true);
    }

    // Other page
    if (this._currentPage < numPages) {
      return (
        this._generateMarkupButton(true) + this._generateMarkupButton(false)
      );
    }

    // Page 1, no other page

    return ``;
  }

  _generateMarkupButton(prev) {
    return `
    <button class="btn--inline pagination__btn--${
      prev ? 'prev' : 'next'
    }" data-goto="${this._currentPage + (prev ? -1 : 1)}">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-${prev ? 'left' : 'right'}"></use>
      </svg>
      <span>Page ${this._currentPage + (prev ? -1 : 1)}</span>
    </button>
  `;
  }
}

export default new PaginationView();
