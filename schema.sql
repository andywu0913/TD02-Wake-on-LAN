CREATE DATABASE IF NOT EXISTS `WakeOnLAN`
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;


-- DROP TABLE IF EXISTS `WakeOnLAN`.`macAddress`;
CREATE TABLE IF NOT EXISTS `WakeOnLAN`.`macAddress` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `macAddress` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `port` int unsigned COLLATE utf8mb4_general_ci NOT NULL DEFAULT 9,
  `ipAddress` varchar(16) COLLATE utf8mb4_general_ci NULL,
  `pingTime` varchar(16) COLLATE utf8mb4_general_ci NULL,
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updateTime` timestamp NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `WakeOnLAN`.`macAddress` AUTO_INCREMENT = 1;


INSERT INTO `WakeOnLAN`.`macAddress` (`name`, `macAddress`, `port`)
VALUES
  ('Andy', '18:C0:4D:4C:8F:8A', 9),
  ('SW', '18:C0:4D:4C:93:12', 9),
  ('QATest', '50:9A:4C:4D:53:E0', 9);
