create table if not exists uploads (
	responses text,
	answers text,
	question_texts text
);

create table if not exists discarded_questions (
	session_id integer not null,
	discarded_questions text,
	foreign key(session_id) references uploads(ROWID)
);

create table if not exists boundaries (
	session_id integer not null,
	boundaries text,
	foreign key(session_id) references uploads(ROWID)
);

create table if not exists subboundaries (
	session_id integer not null,
	subboundaries text,
	foreign key(session_id) references uploads(ROWID)
);

create table if not exists question_discriminations (
	session_id integer not null,
	question_discriminations text,
	foreign key(session_id) references uploads(ROWID)
);

create table if not exists question_weights (
	session_id integer not null,
	question_weights text,
	foreign key(session_id) references uploads(ROWID)
);

create table if not exists student_locations (
	session_id integer not null,
	student_locations text,
	foreign key(session_id) references uploads(ROWID)
);