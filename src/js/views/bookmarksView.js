import previewView from './previewView';
import View from './View';

class BookmarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _successMessage = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data.reduce(
      (acc, recipe) => acc + previewView.render(recipe, false),
      ''
    );
  }
}

export default new BookmarksView();
