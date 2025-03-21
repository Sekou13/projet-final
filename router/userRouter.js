const { PrismaClient } = require('@prisma/client');
const hashPassword = require("../services/extension/hashPassword");
const bcrypt = require("bcrypt");

const userRouter = require('express').Router();

const prisma = new PrismaClient({ log: ['warn', 'error'] }).$extends(hashPassword);

userRouter.get('/register', (req, res) => {
    res.render('pages/register.html.twig', { title: 'Inscription' });
});

userRouter.post("/register", async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            throw {
                firstName: !firstName ? "Le nom est requis" : null,
                lastName: !lastName ? "Le prénom est requis" : null,
                email: !email ? "L'email est requis" : null,
                password: !password ? "Le mot de passe est requis" : null,
                confirmPassword: !confirmPassword ? "La confirmation du mot de passe est requise" : null,
            };
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            throw { password: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre" };
        }

        if (password !== confirmPassword) {
            throw { confirmPassword: "Les mots de passe ne correspondent pas" };
        }

        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password, 
            },
        });

        res.redirect('/login');
    } catch (error) {
        if (error.code === 'P2002') {
            error = { email: "Cet email est déjà utilisé" };
        }

       
        res.render('pages/register.html.twig', { title: 'Inscription', error });
    }
});

userRouter.get('/login', (req, res) => {
    res.render('pages/login.html.twig', { title: 'Login' });
});

userRouter.post('/login', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email: req.body.email }
        });

        if (user && await bcrypt.compare(req.body.password, user.password)) {
            req.session.user = user;
            
            if (user.role === 'ADMIN') {
                return res.redirect('/admin'); // 🔥 Redirige directement les admins
            }

            return res.redirect('/'); // Redirige les autres utilisateurs vers la page d'accueil
        } 

        throw { email: 'Email ou mot de passe incorrect' };
    } catch (error) {
        console.log(error);
        res.render('pages/login.html.twig', { title: 'Connexion', error });
    }
});

userRouter.get('/', (req, res) => {
    res.render('pages/index.html.twig', { title: 'Accueil' });
});

userRouter.get('/userInfo', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); 
    }
    
    res.render('pages/userInfo.html.twig', { 
        title: 'Mon Profil', 
        user: req.session.user 
    });
});

userRouter.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

userRouter.post('/editUser', async (req, res) => { 
    try {
        const { firstName, lastName, email } = req.body;
        
        if (!req.session.user) {
            return res.redirect('/login');
        }

        // Convertir l'ID en nombre entier
        const userId = parseInt(req.session.user.id, 10);
        if (isNaN(userId)) {
            throw new Error("ID utilisateur invalide");
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: { firstName, lastName, email },
        });

        req.session.user = user;
        
        res.redirect('/userInfo');

    } catch (error) {
        console.log(error);
        res.render('pages/userInfo.html.twig', { title: 'Mon Profil', error });
    }
});


userRouter.get('/editUser', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.session.user.id },
        });

        if (!user) {
            return res.redirect('/userInfo'); 
        }

        res.render('pages/editUser.html.twig', { title: 'Modifier mon Profil', user });
    } catch (error) {
        console.error(error);
        res.redirect('/userInfo'); 
    }
});





module.exports = userRouter;  