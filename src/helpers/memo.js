const Memo = (fn) => {
  let wrapper = {};

  return (...args) => {
    const [memoBy, ...fnArgs] = args;
    if (!(memoBy in wrapper)) {
      wrapper[memoBy] = fn.apply(null, fnArgs);
    }

    return wrapper[memoBy];
  };
};

export default Memo;
