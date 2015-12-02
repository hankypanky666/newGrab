drop database if exists grabber;

create database if not exists grabber;

use grabber;

drop table if exists tblUsers;

create table if not exists tblUsers(
   userId integer primary key auto_increment,
   username varchar(100) unique,
   password varchar(100)
)engine=innodb DEFAULT CHARSET=utf8;


drop table if exists tblConfigs;

create table if not exists tblConfigs(
    configId integer primary key auto_increment,
    configName varchar(255) unique,
    config varchar(500)
)engine=innodb DEFAULT CHARSET=utf8;

drop table if exists tblArticles;

create table if not exists tblArticles(
    articleId integer primary key auto_increment,
    userId integer,
    nameArticle varchar(500),
    content mediumtext,
    link varchar(500)
)engine=innodb DEFAULT CHARSET=utf8;