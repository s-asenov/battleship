const Ship = (name, length) => {
  let hits = 0;
  const position = [];

  const hit = () => {
    hits++;
  };

  const isSunk = () => {
    if (hits === length) {
      return true;
    }
    return false;
  };

  return {
    name,
    length,
    hit,
    isSunk,
    position,
  };
};

export default Ship;
