function generateRandomId() {
  const random = () => Math.floor(Math.random() * Date.now());
  return `${random()}`;
}

module.exports = generateRandomId;