import { API_URL, KEY, RESULT_PER_PAGE } from './config.js';
import { getJSON, sendJSON } from './helpers.js';
const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RESULT_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
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
    // 如果recipe.key存在，则创建一个{ key: recipe.key }
    // 并将其解构(...)即添加到recipe对象中
    ...(recipe.key && { key: recipe.key }),
  };
};

const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}?key=${KEY}`);
    // console.log(data);
    state.recipe = createRecipeObject(data);
    // console.log(state.recipe);

    // Add bookmarked
    if (state.bookmarks.some(bookmarked => bookmarked.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    // Temp error handling
    console.error(`${err}!!!!`);
    throw err;
  }
};

const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    state.search.page = 1;
    const result = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = result.data.recipes.map(rec => {
      return {
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getSearchResultPage = function (page = state.search.page) {
  if (!state.search.query) return;
  state.search.page = page;
  // Start: (page - 1) * 10
  // End  : page * 10
  return state.search.results.slice(
    (page - 1) * state.search.resultsPerPage,
    page * state.search.resultsPerPage
  );
};

const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ingredient => {
    if (!ingredient.quantity) return;
    ingredient.quantity =
      (newServings / state.recipe.servings) * ingredient.quantity;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('Bookmarks', JSON.stringify(state.bookmarks));
};

const addBookmark = function (recipe) {
  // Add bookmark to array
  state.bookmarks.push(recipe);

  // Log
  // console.log(`Bookmarked recipe ${recipe.id}`);
  // console.log(`Currentb bookmark array: `, state.bookmarks);

  // Mark current recipe as "bookmarked"
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

const deleteBookmark = function (id) {
  // Get index of the item we want to delete
  const index = state.bookmarks.findIndex(rec => rec.id === id);

  // Mark current recipe as "NOT bookmarked"
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  // Delete (1) item in bookmarks array from (index)
  state.bookmarks.splice(index, 1);

  // Log
  // console.log(`Delete bookmark recipe ${id}`);
  // console.log(`Currentb bookmark array: `, state.bookmarks);

  persistBookmarks();
};

const uploadRecipe = async function (newRecipe) {
  const ingredients = Object.entries(newRecipe)
    .filter(entry => entry[0].startsWith('ingredient'))
    .map(ing => {
      const ingArr = ing[1].split(',').map(str => str.trim());
      // const ingArr = ing[1].replaceAll(' ', '').split(',');
      if (ingArr.length !== 3)
        throw new Error(
          'Wrong ingredient format! Please use the correct format'
        );

      const [quantity, unit, description] = ingArr;

      return { quantity: +quantity || null, unit, description };
    });

  const recipe = {
    title: newRecipe.title,
    publisher: newRecipe.publisher,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    servings: +newRecipe.servings,
    cooking_time: +newRecipe.cookingTime,
    ingredients,
  };

  const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
  // console.log(data);
  // Store it in state.recipe
  state.recipe = createRecipeObject(data);
  // Add bookmark
  addBookmark(state.recipe);
};

const init = function () {
  const storage = localStorage.getItem('Bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear('Bookmarks');
};

// clearBookmarks();

export {
  state,
  loadRecipe,
  loadSearchResults,
  getSearchResultPage,
  updateServings,
  addBookmark,
  deleteBookmark,
  uploadRecipe,
};
