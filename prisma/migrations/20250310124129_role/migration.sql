-- AlterTable
ALTER TABLE `dealership` ADD COLUMN `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'ADMIN';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER';
