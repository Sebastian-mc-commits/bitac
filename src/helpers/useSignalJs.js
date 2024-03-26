const useSignalJs = (value) => {
  
  return {
    get current() {
      return value;
    },

    set current(newValue) {
      value = newValue;

      if (typeof this.onHandlerChangeValue === "function") {
        this.onHandlerChangeValue(newValue);
      }
    },

    /**
     * @param {any} newValue
     */
    set __current__ (newValue) {
      value = newValue;
    },

    onHandlerChangeValue: "",

    setObjectChangeable (obj) {
      this.current = {
        ...this.current,
        ...obj
      }
    },

    setObjectUnchangeable (obj) {
      this.__current__ = {
        ...this.current,
        ...obj
      }
    }
  };
};

export default useSignalJs;
