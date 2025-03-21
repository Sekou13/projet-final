const { PrismaClient } = require('@prisma/client');
const express = require("express");

const adminRouter = express.Router();
const prisma = new PrismaClient({ log: ['warn', 'error'] });

// Middleware pour vérifier si l'utilisateur est ADMIN
const adminGuard = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'ADMIN') {
        return res.status(403).send("Accès interdit 🚫");
    }
    next();
};

adminRouter.get('/admin', adminGuard, (req, res) => {
    res.render('pages/adminPage.html.twig', { title: 'Admin' });
});

adminRouter.get('/addCar', adminGuard, (req, res) => {
    res.render('pages/addCar.html.twig', { title: 'Ajouter une voiture' });
});



module.exports = adminRouter;
