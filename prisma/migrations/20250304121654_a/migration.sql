/*
  Warnings:

  - The values [SEMI_AUTOMATIC] on the enum `Car_transmission` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `car` MODIFY `transmission` ENUM('MANUAL', 'AUTOMATIC') NOT NULL;
