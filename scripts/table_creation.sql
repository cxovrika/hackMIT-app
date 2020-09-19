DROP SCHEMA IF EXISTS hackmit;
create schema hackmit;
USE hackmit;

-- drop table if exists users;
create table users(
	ID int not null auto_increment,
    username varchar(256) unique,
    password varchar(256),
    email varchar(256) unique,
    primary key(ID)
);

-- drop table if exists rooms;
create table rooms(
	ID int not null auto_increment,
    roomID varchar(256) unique not null,
    roomCreatorID int,
    primary key(ID),
    foreign key(roomCreatorID) references users(ID)
);

-- drop table if exists room_users;
create table room_users(
	userID int not null, 
    roomID int not null,
    foreign key(userID) references users(ID),
    foreign key(roomID) references rooms(ID)
);

 -- use hackmit;
select * from users;
select * from rooms;
select * from room_users;
