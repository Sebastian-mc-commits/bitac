const compareObjects = (...args) => {
  const equalObjects = [];
  for (let i = 0; i < args.length; i++) {
    for (let j = i + 1; j < args.length; j++) {
      const { onCompareObjName = i, ...obj1 } = args[i];
      let areObjEqual = true;

      if (Object.keys(obj1).length || Object.keys(args[j]).length) {
        for (let key in args[j]) {
          if ((key in obj1 && obj1[key] !== args[j][key]) || args) {
            areObjEqual = false;
            break;
          }
        }
      } else {
        areObjEqual = false;
      }

      if (!areObjEqual) continue;
      const index = equalObjects.findIndex(
        ({ name }) => name === onCompareObjName
      );
      if (index === -1) {
        equalObjects.push({
          name: onCompareObjName,
          values: [args[j].onCompareObjName]
        });

        continue;
      }

      equalObjects[index] = {
        ...equalObjects[index],
        values: [...equalObjects[index].values, args[j].onCompareObjName]
      };
    }
  }
  return equalObjects;
};

export default compareObjects;
