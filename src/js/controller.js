// 导入icons文件

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE } from './config.js';

// if (module.hot) module.hot.accept();

const controlRecipes = async function (e) {
  try {
    // get id from url
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Loading recipe
    recipeView.renderSpinner();
    // Update results view to mark selected search result
    // 避免刚刷新页面时由于getSearchResultPage返回空数组而导致
    // 渲染错误信息，model.getSearchResultPage()会在没有
    // query搜索词时返回undefined，在有搜索词但是没有搜索结果
    // 时返回空数组[]
    if (model.getSearchResultPage())
      resultsView.update(model.getSearchResultPage());
    bookmarksView.update(model.state.bookmarks);

    // get data from model
    await model.loadRecipe(id);

    // Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    // Get query from searchView
    const query = searchView.getQuery();
    if (!query) return;

    // Spinner
    resultsView.renderSpinner();

    // Get result from model with query
    await model.loadSearchResults(query);

    const pagedResults = model.getSearchResultPage();
    resultsView.render(pagedResults);

    // Render pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};

// @param: direction: 1=>nextPage, 0=>prevPage
const controlPagination = function (targetPage) {
  // Spinner
  resultsView.renderSpinner();
  // Get page result and in the function state.search.page will be set to targetPage
  const pagedResults = model.getSearchResultPage(targetPage);

  // Render result page
  resultsView.render(pagedResults);
  // Render pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings of model.state
  model.updateServings(newServings);

  // Update the recipeView
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // Update icon
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    // Display success message
    addRecipeView.renderMessage();

    // Render bookmark
    bookmarksView.render(model.state.bookmarks);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Change id in the url without refresh
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close upload window
    setTimeout(
      addRecipeView.closeWindow.bind(addRecipeView),
      MODAL_CLOSE * 1000
    );
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};

// controlRecipes();
const init = function () {
  // addHandler
  // 必须在加载页面之后首先加载bookmark， 否则在controlRecipes中调用的bookmarksView.update()
  // 会更新尚未加载bookmarks的书签界面，此时的bookmarks中的组件数量少于要更新的组件数量，会出现
  // 数组越界
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerPage(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};

const newFeature = function () {
  console.log('new feature');
};

init();
