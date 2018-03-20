create table responses (
	data text
);

create table answers (
	session_id integer not null,
	data text,
	foreign key(session_id) references responses(ROWID)
);