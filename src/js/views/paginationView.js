import View from './View';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _page;

  addHandlerPage(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      //   console.log(btn);
      if (!btn) return;
      handler(+btn.dataset.goto);
    });
  }

  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const prevBtn =
      this._data.page - 1 >= 1
        ? `<button data-goto="${
            this._data.page - 1
          }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._data.page - 1}</span>
    </button>`
        : '';
    const nextBtn =
      this._data.page + 1 <= numPages
        ? `<button data-goto="${
            this._data.page + 1
          }" class="btn--inline pagination__btn--next">
        <span>Page ${this._data.page + 1}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>`
        : '';
    return (
      prevBtn +
      `<span class="pagination__page">${this._data.page}</span>` +
      nextBtn
    );
  }
}

export default new PaginationView();
