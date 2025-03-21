const { PrismaClient } = require('@prisma/client');

const express = require("express");

const carRouter = require('express').Router();

const prisma = new PrismaClient({ log: ['warn', 'error'] });


carRouter.get('/cars', async (req, res) => {
    try {
        // Récupérer toutes les voitures depuis la base de données
        const cars = await prisma.car.findMany({
            include: {
                images: true, // Récupérer les images associées
            },
        });

        // Passer les voitures récupérées à la vue
        res.render('pages/cars.html.twig', { 
            title: 'Nos Véhicules', 
            cars: cars 
        });
    } catch (error) {
        console.error(error);
       throw error;
    }
});

carRouter.get('/addCar', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'ADMIN') {
        return res.status(403).send("Accès interdit ");
    }

    res.render('pages/addCar.html.twig', { title: 'Ajouter une voiture' });
});

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/cars"); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nom unique du fichier
    },
});

// Filtrer les fichiers (autoriser uniquement les images)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Type de fichier non autorisé"), false);
    }
};

// Initialiser Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite à 5 Mo
});

carRouter.post("/addCar", upload.array("images", 5), async (req, res) => {
    try {
        const { model, year, brand, price, horsepower, transmission, fuelType, mileage, color, status, dealershipId } = req.body;

        const car = await prisma.car.create({
            data: {
                model,
                year: parseInt(year),
                brand,
                price: parseInt(price),
                horsepower: parseInt(horsepower),
                transmission: transmission.toUpperCase(),
                fuelType: fuelType.toUpperCase(),
                mileage: parseInt(mileage),
                color,
                status: status.toUpperCase(),

            },
        });
        

        // Enregistrer les images associées
        const imagePaths = req.files.map(file => ({
            url: `/uploads/cars/${file.filename}`,
            carId: car.id,
        }));

        await prisma.carImage.createMany({
            data: imagePaths,
        });

        res.redirect("/cars"); // Redirection vers la liste des voitures
    } catch (error) {
        console.error(error);
        res.status(500).send("Erreur serveur");
    }
});

carRouter.post("/deleteCar", async (req, res) => {
    try {
        const { carId } = req.body;

        await prisma.car.delete({
            where: { id: parseInt(carId) },
        });

        res.redirect("/cars"); 
    } catch (error) {
        console.error(error);
        res.render('pages/cars.html.twig', { title: 'Nos Véhicules', error });
    }
});

module.exports = carRouter;




