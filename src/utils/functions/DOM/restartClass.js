const restartClass = (element, cls) => {
  element.classList?.remove(cls);
  void element.offsetWidth;
  element.classList?.add(cls);
};

export default restartClass;
