
CREATE TABLE `tbl_user_master` (
  `userid` BIGINT(20) NOT NULL DEFAULT '0',
  `first_name` VARCHAR(45) DEFAULT '',
  `last_name` VARCHAR(45) DEFAULT '',
  `dob` DATE DEFAULT '0000-00-00',
  `age` INT(3) DEFAULT '0',
  `gender` TINYINT(2) DEFAULT '0' COMMENT '1 - Male, 2 - Female',
  `active_flag` TINYINT(2) DEFAULT '1' COMMENT '1 - Active, 0 - Not Active',
  `createdon` DATETIME DEFAULT '0000-00-00 00:00:00',
  `updatedon` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `marital_status` TINYINT(2) DEFAULT '0' COMMENT '1 - Single , 2 - Married,',
  `mobile` BIGINT(20) DEFAULT '0',
  `email` VARCHAR(50) DEFAULT '',
  `home_add` TEXT,
  `type_flag` TINYINT(2) DEFAULT '0' COMMENT '0-insured,1-Policy Holder,2-Both',
  `middle_name` VARCHAR(45) DEFAULT '',
  `area_name` VARCHAR(100) DEFAULT '',
  `city` VARCHAR(50) DEFAULT '',
  `state` VARCHAR(50) DEFAULT '',
  `pincode` INT(20) DEFAULT '0',
  `landline` VARCHAR(15) DEFAULT '0' COMMENT 'Landline number of the user if any',
  `waistline` VARCHAR(10) DEFAULT '',
  `weight` VARCHAR(10) DEFAULT '',
  `height` VARCHAR(10) DEFAULT '' COMMENT 'converted the ft issue from float to varchar',
  `education` VARCHAR(100) DEFAULT '',
  `occupation` VARCHAR(100) DEFAULT '',
  `panCard` VARCHAR(15) DEFAULT '' COMMENT 'pancard details for proposer',
  `adhaarCard` VARCHAR(20) DEFAULT '' COMMENT 'adhaar Card details',
  `annualIncome` VARCHAR(20) DEFAULT '0' COMMENT 'annual income details.',
  `gstnumber` VARCHAR(50) DEFAULT '',
  PRIMARY KEY (`userid`),
  KEY `idx_dob` (`dob`),
  KEY `idx_age` (`age`),
  KEY `idx_activeflg` (`active_flag`)
) ENGINE=INNODB DEFAULT CHARSET=latin1;

/*Data for the table `tbl_user_master` */


CREATE TABLE tbl_animalBag_master(
userID BIGINT(20) NOT NULL DEFAULT '0',
bagTagNumber BIGINT(20)  DEFAULT '0',
station VARCHAR(50) DEFAULT '',
gate VARCHAR(50) DEFAULT '',
flightNumber VARCHAR(50) DEFAULT '',
fromDate DATETIME DEFAULT '0000-00-00 00:00:00',
toDate DATETIME DEFAULT '0000-00-00 00:00:00',
petType  TINYINT(2) DEFAULT '0' COMMENT '1 - Dog, 2 - Cat',
cargoAirwayBillNumber VARCHAR(50) DEFAULT '',
passengerName  VARCHAR(50) DEFAULT ''  COMMENT 'passenger Name details.',
createdon DATETIME DEFAULT '0000-00-00 00:00:00',
updatedon TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
fromTime VARCHAR(10) DEFAULT ''  COMMENT 'From time details.',
toTime  VARCHAR(10) DEFAULT ''  COMMENT 'To time details.'
);


CREATE TABLE tbl_animalBag_master(
userID BIGINT(20) NOT NULL DEFAULT '0',
bagTagNumber BIGINT(20)  DEFAULT '0',
station VARCHAR(50) DEFAULT '',
gate VARCHAR(50) DEFAULT '',
flightNumber VARCHAR(50) DEFAULT '',
fromDate DATETIME DEFAULT '0000-00-00 00:00:00',
toDate DATETIME DEFAULT '0000-00-00 00:00:00',
petType  TINYINT(2) DEFAULT '0' COMMENT '1 - Dog, 2 - Cat',
cargoAirwayBillNumber VARCHAR(50) DEFAULT '',
passengerName  VARCHAR(50) DEFAULT ''  COMMENT 'passenger Name details.',
createdon DATETIME DEFAULT '0000-00-00 00:00:00',
updatedon TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
fromTime VARCHAR(10) DEFAULT ''  COMMENT 'From time details.',
toTime  VARCHAR(10) DEFAULT ''  COMMENT 'To time details.'
);
INSERT INTO tbl_animalbag_master
(`userID`,`bagTagNumber`,`station`,`gate`,`flightNumber`,`fromDate`,`toDate`,`petType`,`cargoAirwayBillNumber`,`passengerName`,`createdon`,`updatedon`,`fromTime`,`toTime`) 
VALUES 


( '123456','321546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '122456','321546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '123556','321546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '124456','321546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '123496','321546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '153456','32526','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '133456','325546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '123456','324546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '193456','323546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '183456','322546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '173456','321546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '163456','311546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '113456','321546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '143456','331546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '129456','341546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '128456','351546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '127456','361546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '126456','371546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '125456','381546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '121456','391546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '122456','421546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '123956','521546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '123856','621546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '123756','721546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '123656','821546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),
( '123556','921546','uk3218','uk102','UK-3769','2019-20-01 07:18:21','2019-22-01 08:18:21','1','crg156789','loyees','2019-20-01 07:18:21','2019-20-01 07:18:21','07:18:21','09:18:21'),

;
