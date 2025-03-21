const authguard = (req, res, next) => {
    console.log("Session User:", req.session.user); // 👀 Vérifie si le rôle est bien défini

    if (!req.session.user) {
        return res.redirect('/login');
    }

    if (req.session.user.role === 'ADMIN') {
        return res.redirect('/admin'); // 🔥 Redirige les admins
    }

    next();
};

module.exports = authguard;
 