const setStyles = ({ element = document.head, getStyles = "" }) => {
  const styles = document.createElement("style");

  styles.innerHTML = getStyles;

  element.appendChild(styles);
};

export default setStyles;
