import {INCREMENT, LOAD_ALL_ARTICLES, LOAD_ARTICLE, LOAD_ARTICLE_COMMENTS,LOAD_COMMENTS_FOR_PAGE, START, SUCCESS, FAIL, DELETE_ARTICLE, CHANGE_DATE_RANGE, CHANGE_SELECTION, ADD_COMMENT} from '../constants'
import {push, replace} from 'react-router-redux';


export function increment() {
  return {
    type: INCREMENT
  };
}


export function deleteArticle(id) {
  return {
    type: DELETE_ARTICLE,
    payload: { id }
  };
}


export function changeDateRange(dateRange) {
  return {
    type: CHANGE_DATE_RANGE,
    payload: {dateRange}
  };
}


export function changeSelection(selected) {
  return {
    type: CHANGE_SELECTION,
    payload: {selected}
  };
}


export function addComment(comment, articleId) {
  return {
    type: ADD_COMMENT,
    payload: {comment, articleId},
    generateId: true
  };
}


export function loadAllArticles() {
  return {
    type: LOAD_ALL_ARTICLES,
    callAPI: 'api/article'
  };
}


export function loadArticle(id) {
  return (dispatch) => {
    dispatch({
      type: LOAD_ARTICLE + START,
      payload: { id }
    });

    setTimeout(() => {
      fetch(`/api/article/${id}`)
        .then((res) => {
          if (res.status >= 400) {
            throw new Error(res.statusText);
          }
          return res.json();
        })
        .then((response) => dispatch({
          type: LOAD_ARTICLE + SUCCESS,
          payload: { id, response }
        }))
        .catch((error) => {
          dispatch({
            type: LOAD_ARTICLE + FAIL,
            payload: {id, error}
          });

          dispatch(replace('/error'));
        })
    }, 1000);
  };
}


export function loadArticleComments(articleId) {
  return {
    type: LOAD_ARTICLE_COMMENTS,
    payload: {articleId},
    callAPI: `/api/comment?article=${articleId}`
  };
}


export function checkAndLoadCommentsForPage(page) {
  return (dispatch, getState) => {
    const {comments: {pagination}} = getState();
    if (pagination.getIn([page, 'loading']) || pagination.getIn([page, 'ids'])) return;

    dispatch({
      type: LOAD_COMMENTS_FOR_PAGE,
      payload: {page},
      callAPI: `/api/comment?limit=5&offset=${(page - 1) * 5}`
    });
  };
}