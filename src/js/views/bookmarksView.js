import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

class BookmarksView extends previewView {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it!!';
  _message = 'No bookmarks yet. Find a nice recipe and bookmark it!!';

  render(data) {
    if (!data || (Array.isArray(data) && !data.length))
      return this.renderMessage();

    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    // console.log(this._parentElement);
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarksView();
