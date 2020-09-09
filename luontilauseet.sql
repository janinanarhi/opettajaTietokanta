drop database if exists opettajatietokanta; 
create database opettajatietokanta;

create table opettajatietokanta.opettaja(
    opettajaID integer not null primary key,
    sukunimi varchar(50) not null,
    etunimi varchar(50) not null, 
    soitin varchar(55) not null,
    soitinryhmä varchar(32) not null,
    toimenkuva varchar(55) null,
    aloitusvuosi date null
);

create user if not exists 'janina'@'localhost' identified by 'P030609';
grant all privileges on opettajatietokanta.* to 'janina'@'localhost';

insert into opettajatietokanta.opettaja (opettajaID, sukunimi, etunimi, soitin, soitinryhmä, toimenkuva, aloitusvuosi)
values(1, 'Saarikorpi', 'Kaisa', 'piano', 'kosketinsoittimet', 'rehtori ja opettaja', '2012-01-01');

insert into opettajatietokanta.opettaja (opettajaID, sukunimi, etunimi, soitin, soitinryhmä, toimenkuva, aloitusvuosi) 
values(2, 'Närhi', 'Janina', 'piano', 'kosketinsoittimet', 'opettaja ja nettisivujen päivittäjä', '2013-01-01');

insert into opettajatietokanta.opettaja (opettajaID, sukunimi, etunimi, soitin, soitinryhmä, toimenkuva, aloitusvuosi) 
values(3, 'Sivonen', 'Heikki','huilu', 'puupuhaltimet', 'opettaja', '2016-08-13');

insert into opettajatietokanta.opettaja (opettajaID, sukunimi, etunimi, soitin, soitinryhmä, toimenkuva, aloitusvuosi) 
values(4, 'Teppo', 'Johannes', 'sello', 'jousisoittimet', 'opettaja', '2017-09-20');

insert into opettajatietokanta.opettaja (opettajaID, sukunimi, etunimi, soitin, soitinryhmä, toimenkuva, aloitusvuosi) 
values(5, 'Juvonen', 'Henna', 'pop/jazz laulu', 'laulu', 'opettaja', '2017-09-20');
