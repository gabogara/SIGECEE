const reducers = (state = {}, action) => {
  switch (action.type) {
    case "USER_LOGIN_REQUEST":
      return { loading: true };
    case "USER_LOGIN_SUCCESS":
      return {
        ...state,
        auth: true,
        selected: "ddlPrincipal",
        userInfo: action.payload,
      };
    case "USER_LOGIN_FAIL":
      return { loading: true, error: action.payload };
    case "USER_LOGOUT":
      return {};
    case "QUESTION_SAVE":
      return { ...state, questionId: action.payload };
    case "QUESTION_DISCARD":
      return { ...state, questionId: {} };
    case "ADD_SELECTED":
      return { ...state, selected: action.payload };
    case "ADD_SELECTED_OPTION":
      return { ...state, option: action.payload };
    case "TAB_ADD_SELECTED":
      return { ...state, tab_add: true };
    case "TAB_ADD_SELECTED_REMOVE":
      return { ...state, tab_add: false };
    case "TAB_SELECTED_CENSUS":
      return { ...state, tab_census: action.payload };
    case "CURRENT_CENSUS_INFO":
      return { ...state, census_info: action.payload };
    case "USER_SAVE":
      return {
        ...state,
        userInfo: action.payload,
      };
    default:
      return state;
  }
};

export default reducers;
