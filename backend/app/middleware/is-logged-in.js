function isLoggedIn(req, res, next) {
  // isAuthenticated() è un metodo aggiunto automaticamente da Passport
  if (req.isAuthenticated()) {
    return next();
  }
  
  // Se non è autenticato, mandiamo un errore 401 (Unauthorized)
  res.status(401).json({ message: "Devi effettuare il login per accedere a questa risorsa" });
}

module.exports = isLoggedIn;