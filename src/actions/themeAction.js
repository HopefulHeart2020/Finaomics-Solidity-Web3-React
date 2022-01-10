export const UPDATE_THEME = "UPDATE_THEME";

export function setTheme(payload) {
  return {
    type: UPDATE_THEME,
    payload,
  };
}
