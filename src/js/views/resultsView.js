import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

class ResultsView extends previewView {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipe found for your query. Please try again!';
  _message = '';
}

export default new ResultsView();
