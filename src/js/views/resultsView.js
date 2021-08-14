import previewView from './previewView';
import View from './View';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query.';
  _successMessage = '';

  _generateMarkup() {
    return this._data.reduce(
      (acc, recipe) => acc + previewView.render(recipe, false),
      ''
    );
  }
}

export default new ResultsView();
