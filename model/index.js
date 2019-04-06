module.exports = (currState = {}, action) => {
  switch (action.type) {
    case 'INIT_COLLECTION_LIST':
      return {
        ...currState,
        customList: [...action.data],
      };
    case 'SEARCH_START':
      return {
        ...currState, searchTerm: action.searchTerm,
      };
    case 'POPUPULAR_CONTENT_DISPLAY':
    case 'POPULAR_MOVIES':
      return {
        ...currState,
        searchResults: action.searchResults.results,
        totalPages: action.searchResults.total_pages,
        currPge: action.searchResults.page,
        selectedList: '',
        searchTerm: '',
      };
    case 'SEARCH_COMPLETE':
      return {
        ...currState,
        searchResults: action.searchResults.results,
        totalPages: action.searchResults.total_pages,
        currPge: action.searchResults.page,
        selectedList: '',
      };
    case 'CUSTOM_LIST_ITEM':
      if (currState.customList.indexOf(action.val) >= 0) {
        return { ...currState };
      }
      return {
        ...currState,
        customList: [...currState.customList, action.val],
      };


    case 'LIST_ITEM_SELECTED':
      return { ...currState, selectedList: action.value };

    case 'MOVIES_FOR_SELECTED_LIST':
    case 'UPDATED_MOVIES_FROM_LIST':
      return {
        ...currState,
        searchResults: action.value,
        totalPages: action.pageCount,
        currPge: action.currentPage,
        searchTerm: '',
      };

    case 'MOVIE_REMOVED_FROM_LIST':
      return { ...currState };

    default:
      return { ...currState };
  }
};
