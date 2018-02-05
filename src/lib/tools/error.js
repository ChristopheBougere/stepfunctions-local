function errorMatches(error, catchErrors) {
  return catchErrors.some((e) => {
    if (e === 'States.ALL') {
      return true;
    }
    return e === (error.name || error.error);
  });
}

module.exports = {
  errorMatches,
};
