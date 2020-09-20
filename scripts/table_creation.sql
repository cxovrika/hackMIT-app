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
    roomName varchar(256) not null,
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

create table categories(
	ID int not null auto_increment,
    name varchar(256) unique not null,
    primary key(ID)
);


insert into users value
(null, "admin", "admin", "admin"),
(null, "root", "root", "root"),
(null, "a", "a", "a"),
(null, "b", "b", "b");

insert into rooms value
(null, 0, 'admin room', 1),
(null, 1, 'root room', 2),
(null, 5, 'a room', 3);

insert into categories value
(null, 'Computer Science'),
(null, 'Mathematics'),
(null, 'Physics');

 -- use hackmit;
select * from users;
select * from rooms;
select * from room_users;
select * from categories;

-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root'
-- flush privileges;
