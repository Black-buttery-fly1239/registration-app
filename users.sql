create table town(
	id serial not null primary key,
	towns text not null,
    codes text not null
);

create table reg (
	id serial not null primary key,
    regNumber text not null,
    theRegCode int not null,
	foreign key (theRegCode) references town(id)
);


INSERT INTO town(towns, codes) VALUES('Malmesbury', 'CK');
INSERT INTO town(towns, codes) VALUES('Belville', 'CY');
INSERT INTO town(towns, codes) VALUES('Cape Town', 'CA');