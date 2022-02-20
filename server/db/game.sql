-- Table: public.game

DROP TABLE IF EXISTS public.game;

CREATE TABLE IF NOT EXISTS public.game
(
    id serial,
    name character varying(255) NOT NULL,
    ended boolean DEFAULT false,
    CONSTRAINT game_pkey PRIMARY KEY (id)
)