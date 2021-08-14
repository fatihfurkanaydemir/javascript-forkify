import { API_KEY, API_URL, RES_PER_PAGE } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
  },
  bookmarks: [],
};

const createRecipeOject = function (data) {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    state.recipe = createRecipeOject(data);

    if (state.bookmarks.some((bookmark) => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map((recipe) => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });

    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * RES_PER_PAGE;
  const end = page * RES_PER_PAGE;

  return state.search.results.slice(start, end);
};

export const updateServings = function (servings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity *= servings / state.recipe.servings;
  });

  state.recipe.servings = servings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  state.bookmarks.splice(
    state.bookmarks.findIndex((el) => el.id === id),
    1
  );

  state.recipe.bookmarked = false;
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

export const uploadRecipe = async function (recipe) {
  const ingredients = Object.entries(recipe)
    .filter((entry) => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map((ing) => {
      const ingArr = ing[1].split(',').map((el) => el.trim());

      if (ingArr.length !== 3) throw new Error('Wrong ingredient format');

      const [quantity, unit, description] = ingArr;

      return { quantity: quantity ? +quantity : null, unit, description };
    });

  const newRecipe = {
    title: recipe.title,
    source_url: recipe.sourceUrl,
    image_url: recipe.image,
    publisher: recipe.publisher,
    cooking_time: +recipe.cookingTime,
    servings: +recipe.servings,
    ingredients,
  };

  const data = await AJAX(`${API_URL}?key=${API_KEY}`, newRecipe);
  state.recipe = createRecipeOject(data);
  addBookmark(state.recipe);
};

init();
