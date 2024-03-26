const toggleTypes = (types = []) => {
  let position = 0;
  return {
    get getValue() {
      if (position > types.length - 1) {
        position = 0;
      }
      const returnToggleType = types[position];
      position++;
      return returnToggleType;
    },

    get current() {
      return types[position > types.length - 1 ? position - 1 : position];
    },

    toggle: () => {
      if (position >= types.length - 1) {
        position = 0;
      } else {
        position++;
      }
    }
  };
};

export default toggleTypes;
