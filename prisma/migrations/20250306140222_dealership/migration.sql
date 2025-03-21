/*
  Warnings:

  - Added the required column `mail` to the `Dealership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Dealership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Dealership` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `car` DROP FOREIGN KEY `Car_dealershipId_fkey`;

-- DropIndex
DROP INDEX `Car_dealershipId_fkey` ON `car`;

-- AlterTable
ALTER TABLE `car` MODIFY `dealershipId` INTEGER NULL;

-- AlterTable
ALTER TABLE `dealership` ADD COLUMN `mail` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Car` ADD CONSTRAINT `Car_dealershipId_fkey` FOREIGN KEY (`dealershipId`) REFERENCES `Dealership`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
