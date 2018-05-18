create table if not exists responses (
	data text
);

create table if not exists answers (
	session_id integer not null,
	data text,
	foreign key(session_id) references responses(ROWID)
);

create table if not exists texts (
	session_id integer not null,
	data text,
	foreign key(session_id) references responses(ROWID)
);

create table if not exists discarded (
	session_id integer not null,
	questions text,
	foreign key(session_id) references responses(ROWID)
);

create table if not exists boundaries (
	session_id integer not null,
	boundaries text,
	foreign key(session_id) references responses(ROWID)
);