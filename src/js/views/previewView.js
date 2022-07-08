import icons from 'url:../../img/icons.svg';
import View from './View';

export default class PreviewView extends View {
  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join();
  }
  _generateMarkupPreview(rec) {
    const id = window.location.hash.slice(1);

    return `
    <li class="preview">
        <a class="preview__link ${
          id === rec.id ? 'preview__link--active' : ''
        }" href="#${rec.id}">
          <figure class="preview__fig">
            <img src="${rec.image}" alt="Test" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${rec.title}</h4>
            <p class="preview__publisher">${rec.publisher}</p>
            <div class="preview__user-generated ${rec.key ? '' : 'hidden'}">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
    </li>
    `;
  }
}
