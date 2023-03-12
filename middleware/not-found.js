const notFound = (req, res) => res.status(404).send('<h1> Route doesnt exist </h1>')

module.exports = notFound