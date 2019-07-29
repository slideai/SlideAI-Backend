function generateRandomId() {
  const random = () => Math.floor(Math.random() * Date.now());
  return `${random()}_${random()}`;
}

module.exports = generateRandomId;