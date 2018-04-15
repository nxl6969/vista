-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 14, 2018 at 01:48 PM
-- Server version: 10.1.21-MariaDB
-- PHP Version: 7.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nxl6969`
--
DROP DATABASE IF EXISTS nxl6969;
CREATE DATABASE nxl6969;

USE nxl6969;
-- --------------------------------------------------------

--
-- Table structure for table `image`
--

CREATE TABLE `image` (
  `user_id` int(11) DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `location` int(11) DEFAULT NULL,
  `uploaded` date DEFAULT NULL,
  `image_tags` varchar(255)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `location`
--
CREATE TABLE `location` (
  `location_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `lat` varchar(255) DEFAULT NULL,
  `lng` varchar(255) DEFAULT NULL,
  `description` text,
  `tags` varchar(50)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

SELECT * FROM image;
SELECT * FROM location;


--
-- Dumping data for table `location`
--

INSERT INTO `location` (`location_id`, `name`, `lat`, `lng`, `description`, `tags`) VALUES
(1, 'Lovrijenac', '42.641153', '18.104232', 'The monumental fortress, called the Gibraltar of Dubrovnik, rises 37 meters above sea level, and through its history has had many roles. The primary reason for its construction was a defensive nature, with main goal of protecting freedom of Dubrovnik.', 'Historical fortress'),
(2, 'Boninovo', '42.6458845', '18.0966753', 'Boninovo is a humongous cliff, known for love locks. It offers a beautiful view of the sea and the horizon.', 'Beautiful Cliff'),
(3, 'Pile', '42.641482', '18.106054', 'The starting point of Vista application, offering beautiful view of the city walls.', 'City Walls');

-- --------------------------------------------------------
INSERT INTO nxl6969.image (user_id, image_path, location, uploaded, image_tags)
VALUES 
(3, 'lovrijenac.jpg', 1, '2017-09-15', '#lovrijenac #pretty #dubrovnik #vista'),
(3, 'boninovo.jpg', 2, '2018-02-16', '#boninovo #dubrovnik #vista'),
(3, 'lovrijenac2.jpg', 1, '2017-05-12', '#lovrijenac #view #sea #vista #beautiful'),
(3, 'lovrijenac3.jpg', 1, '2016-09-22', '#dubrovnik #lovrijenac #vista #happy'),
(3, 'lovrijenac4.jpg', 1, '2016-10-19', '#lovrijenac #pretty #view #amazing'),
(3, 'pile.jpg', 3, '2015-08-22', '#pile #gate #summer #hot #ree'),
(3, 'pile2.jpg', 3, '2018-04-26', '#pile #restaurant #expensive #butworth');


--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `token`) VALUES
(3, 'asdasdadasda');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `image`
--
ALTER TABLE `image`
  ADD KEY `image_user_user_id_fk` (`user_id`),
  ADD KEY `image_location_location_id_fk` (`location`);

--
-- Indexes for table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`location_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_user_id_uindex` (`user_id`),
  ADD UNIQUE KEY `user_token_uindex` (`token`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `image`
--
ALTER TABLE `image`
  ADD CONSTRAINT `image_location_location_id_fk` FOREIGN KEY (`location`) REFERENCES `location` (`location_id`),
  ADD CONSTRAINT `image_user_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
