/**
 * Sleep for the specified number of milliseconds.
 *
 * @param amountInMillis
 * @returns {Promise<void>}
 */
async function sleep(amountInMillis) {
  await new Promise(res => setTimeout(res, amountInMillis));
}

module.exports = {
  sleep,
};
