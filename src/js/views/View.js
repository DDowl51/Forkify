import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the recieved object to the DOM
   * @param {Object | Array} data - The data you want to render on page (e.g. recipe)
   * @returns {undefined | string}
   * @this {Object} View instance
   * @author ddowl
   * @todo Finish implementation
   */
  render(data) {
    if (!data || (Array.isArray(data) && !data.length))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    // console.log(this._parentElement);
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * 更新界面中的数据
   * @param {Object | Array} data - 如果界面中原有的数据与(data)不一样，则更新原有的数据
   * @returns
   */
  update(data) {
    if (!data || (Array.isArray(data) && !data.length))
      return this.renderError();

    this._data = data;
    const newMarkup = this._generateMarkup();
    // convert string to DOM
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    newElements.forEach((element, index) => {
      if (!element.isEqualNode(curElements[index])) {
        // 判断element是否含有文本
        if (element.firstChild?.nodeValue.trim() !== '')
          curElements[index].textContent = element.textContent;

        // 更新组件的属性(Attributes)
        Array.from(element.attributes).forEach(attr =>
          curElements[index].setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner = function () {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };

  renderError(message = this._errorMessage) {
    console.error(`renderError called from component`, this._parentElement);
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
