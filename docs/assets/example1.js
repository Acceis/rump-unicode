app.post('/api/password/reset', function(req, res) {
  var email = req.body.email;
  db.get('SELECT id, email, FROM users WHERE email = ?',
    [email.toLowerCase()],
    (err, user) => {
      if (err) {
        console.error(err.message);
        res.status(400).send();
      } else {
        generateTemporaryPassword((tempPassword) => {
          accountRepository.resetPassword(user.id, tempPassword, () => {
            messenger.sendPasswordResetEmail(email, tempPassword);
            res.status(204).send();
          });
        });
      }
    });
});
