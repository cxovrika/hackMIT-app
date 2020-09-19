DROP SCHEMA IF EXISTS hackmit;
create schema hackmit;
USE hackmit;

-- drop table if exists users;
create table users(
	ID int not null auto_increment,
    user_name varchar(256),
    user_password varchar(256),
    email varchar(256),
    primary key(ID)
);

-- drop table if exists rooms;
create table rooms(
	ID int not null auto_increment,
    roomID varchar(256) not null,
    primary key(ID)
);

-- drop table if exists room_users;
create table room_users(
	userID int not null, 
    roomID int not null,
    user_status bool,
    foreign key(userID) references users(ID),
    foreign key(roomID) references rooms(ID)
);

 -- use hackmit;
select * from users;
select * from rooms;
select * from room_users;
