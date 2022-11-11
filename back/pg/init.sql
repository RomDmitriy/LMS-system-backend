--
-- PostgreSQL database cluster dump
--

-- Started on 2022-10-26 20:30:36

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE api;
ALTER ROLE api WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:38ZiKd0jndNXWUjU7UB9LQ==$6C1tXGSSAiR4TUptRjEg3r3SHF7a/uKJLE2I2KnAbQw=:7+LQnMT+IW2LlRxNcKRXHUjeng3IUYwnuBJXHh0lWYM=';
CREATE ROLE express;
ALTER ROLE express WITH NOSUPERUSER INHERIT NOCREATEROLE NOCREATEDB LOGIN NOREPLICATION NOBYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:GEXYNF48ZCIxcF1QWOOnZg==$ZmPipU2M3q7XSHWMxrGZxiJ1iUgt/IABMEPqTDLYmJI=:hWS+7L/0MCRRSstlLIf3VvafwKcmtpVDjVYC2N6q7lU=';




--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4 (Debian 14.4-1.pgdg110+1)
-- Dumped by pg_dump version 14.4

-- Started on 2022-10-26 20:30:36

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- Completed on 2022-10-26 20:30:36

--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4 (Debian 14.4-1.pgdg110+1)
-- Dumped by pg_dump version 14.4

-- Started on 2022-10-26 20:30:36

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16386)
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- TOC entry 3483 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


--
-- TOC entry 850 (class 1247 OID 16397)
-- Name: enum_courses_user_level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_courses_user_level AS ENUM (
    '0',
    '1',
    '2',
    '3'
);


ALTER TYPE public.enum_courses_user_level OWNER TO postgres;

--
-- TOC entry 853 (class 1247 OID 16406)
-- Name: user_level; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_level AS ENUM (
    '0',
    '1',
    '2',
    '3'
);


ALTER TYPE public.user_level OWNER TO postgres;

--
-- TOC entry 237 (class 1255 OID 16415)
-- Name: auto_clear_email_tokens(); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.auto_clear_email_tokens()
    LANGUAGE sql
    AS $$
    DELETE FROM email_verify WHERE expiration_time < (now() at time zone 'utc');
    $$;


ALTER PROCEDURE public.auto_clear_email_tokens() OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 16416)
-- Name: block_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.block_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.block_type_id_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 211 (class 1259 OID 16417)
-- Name: block_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.block_types (
    id integer DEFAULT nextval('public.block_type_id_seq'::regclass) NOT NULL,
    type character varying(16) NOT NULL
);


ALTER TABLE public.block_types OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 16421)
-- Name: blocks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.blocks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.blocks_id_seq OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 16422)
-- Name: blocks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blocks (
    id integer DEFAULT nextval('public.blocks_id_seq'::regclass) NOT NULL,
    module_id integer NOT NULL,
    local_id integer NOT NULL,
    type_id integer NOT NULL,
    content text,
    title character varying(32) DEFAULT 'Без_названия'::character varying NOT NULL
);


ALTER TABLE public.blocks OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16428)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16429)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer DEFAULT nextval('public.categories_id_seq'::regclass) NOT NULL,
    title text NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16435)
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.courses_id_seq OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16436)
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses (
    id integer DEFAULT nextval('public.courses_id_seq'::regclass) NOT NULL,
    title text,
    description text,
    author_id integer NOT NULL,
    trailer_url text,
    main_topics text[],
    image_url text,
    is_visible boolean DEFAULT false NOT NULL,
    price integer DEFAULT 0,
    category_id integer,
    user_level public.enum_courses_user_level DEFAULT '0'::public.enum_courses_user_level
);


ALTER TABLE public.courses OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16445)
-- Name: courses_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.courses_tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.courses_tags_id_seq OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16446)
-- Name: courses_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.courses_tags (
    course_id integer NOT NULL,
    tag_id integer NOT NULL,
    id integer DEFAULT nextval('public.courses_tags_id_seq'::regclass) NOT NULL
);


ALTER TABLE public.courses_tags OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16450)
-- Name: email_verify; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_verify (
    token text NOT NULL,
    expiration_time timestamp without time zone NOT NULL
);


ALTER TABLE public.email_verify OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16455)
-- Name: feedbacks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.feedbacks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.feedbacks_id_seq OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16456)
-- Name: feedbacks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.feedbacks (
    id integer DEFAULT nextval('public.feedbacks_id_seq'::regclass) NOT NULL,
    course_id integer NOT NULL,
    author_id integer NOT NULL,
    description text,
    date timestamp without time zone NOT NULL,
    mark numeric(2,1)
);


ALTER TABLE public.feedbacks OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16606)
-- Name: mentor_verify_query_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mentor_verify_query_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.mentor_verify_query_id_seq OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16613)
-- Name: mentor_verify_query; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mentor_verify_query (
    id integer DEFAULT nextval('public.mentor_verify_query_id_seq'::regclass) NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.mentor_verify_query OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16462)
-- Name: modules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modules (
    id integer DEFAULT nextval('public.block_type_id_seq'::regclass) NOT NULL,
    local_id integer NOT NULL,
    section_id integer NOT NULL,
    title text NOT NULL
);


ALTER TABLE public.modules OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16468)
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.permissions_id_seq OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16469)
-- Name: permission_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permission_types (
    id integer DEFAULT nextval('public.permissions_id_seq'::regclass) NOT NULL,
    name character varying
);


ALTER TABLE public.permission_types OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16475)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16476)
-- Name: sections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sections_id_seq OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16477)
-- Name: sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sections (
    id integer DEFAULT nextval('public.sections_id_seq'::regclass) NOT NULL,
    course_id integer NOT NULL,
    local_id integer NOT NULL,
    title text NOT NULL
);


ALTER TABLE public.sections OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16483)
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tags_id_seq OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16484)
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id integer DEFAULT nextval('public.tags_id_seq'::regclass) NOT NULL,
    title character varying(16) NOT NULL
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16488)
-- Name: user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER TABLE public.user_permissions_id_seq OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16489)
-- Name: user_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_permissions (
    id integer DEFAULT nextval('public.user_permissions_id_seq'::regclass) NOT NULL,
    user_id integer NOT NULL,
    course_id integer,
    permission_id integer NOT NULL
);


ALTER TABLE public.user_permissions OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16493)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16494)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer DEFAULT nextval('public.users_id_seq'::regclass) NOT NULL,
    email character varying(64) NOT NULL,
    password text NOT NULL,
    about text,
    refresh_token text,
    is_verified boolean DEFAULT false NOT NULL,
    avatar_url text,
    first_name character varying(32) NOT NULL,
    second_name character varying(32) NOT NULL,
    third_name character varying(32) NOT NULL,
    is_accepted boolean DEFAULT true NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 3452 (class 0 OID 16417)
-- Dependencies: 211
-- Data for Name: block_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.block_types (id, type) VALUES (1, 'HTML_TEXT');
INSERT INTO public.block_types (id, type) VALUES (2, 'VIDEO_LINK');
INSERT INTO public.block_types (id, type) VALUES (3, 'FILE');
INSERT INTO public.block_types (id, type) VALUES (4, 'IMAGE');


--
-- TOC entry 3454 (class 0 OID 16422)
-- Dependencies: 213
-- Data for Name: blocks; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.blocks (id, module_id, local_id, type_id, content, title) VALUES (330, 80, 0, 1, '<p><span style="color: rgb(77, 81, 86);">DOM — это независящий от платформы и языка программный интерфейс, позволяющий программам и скриптам получить доступ к содержимому HTML-, XHTML- и XML-документов, а также изменять содержимое, структуру и оформление таких документов. Модель DOM не накладывает ограничений на структуру документа.</span></p>', 'Определение DOM');
INSERT INTO public.blocks (id, module_id, local_id, type_id, content, title) VALUES (331, 80, 1, 2, 'https://www.youtube.com/embed/UbUQqcy7e9s/embed/undefined/embed/undefined/embed/undefined', 'Видео');
INSERT INTO public.blocks (id, module_id, local_id, type_id, content, title) VALUES (332, 80, 2, 3, 'https://cl17777-441f0272-079d-4489-a9ed-a811e18f057f.s3.timeweb.com/courses/75/ef60486b-d9c2-491b-bdff-a8bb4706328b.1662536201420.xls', 'dsdsssfsd');
INSERT INTO public.blocks (id, module_id, local_id, type_id, content, title) VALUES (345, 87, 0, 1, '<p>Текст</p>', 'Заголовок');
INSERT INTO public.blocks (id, module_id, local_id, type_id, content, title) VALUES (357, 82, 0, 1, '<p>установка</p>', 'Установка ангуляра');
INSERT INTO public.blocks (id, module_id, local_id, type_id, content, title) VALUES (358, 82, 1, 3, 'https://cl17777-441f0272-079d-4489-a9ed-a811e18f057f.s3.timeweb.com/courses/75/92d77453-e4b3-4dab-bde9-f52df36131f6.1663094030517.doc', 'Установка');
INSERT INTO public.blocks (id, module_id, local_id, type_id, content, title) VALUES (287, 81, 0, 1, '<p><strong>Чем занимается Data Scientist?</strong></p><p>Data Scientist применяет методы науки о данных (Data Science) для обработки больших объемов информации. Он строит и тестирует математические модели поведения данных. Это помогает найти в них закономерности или спрогнозировать будущие значения. Например, по данным о спросе на товары в прошлом, дата-сайентист поможет компании спрогнозировать продажи в следующем году. Модели строят с помощью алгоритмов машинного обучения, а с базами данных работают через SQL.</p>', 'Название блока');
INSERT INTO public.blocks (id, module_id, local_id, type_id, content, title) VALUES (288, 81, 2, 2, 'https://www.youtube.com/embed/pLZyMbPTKOg', 'Название блока');
INSERT INTO public.blocks (id, module_id, local_id, type_id, content, title) VALUES (289, 81, 3, 3, 'https://cl17777-441f0272-079d-4489-a9ed-a811e18f057f.s3.timeweb.com/courses/76/358264cf-d74a-4029-85c7-bbfbd7d98d89.1662553220546.png', 'Название блока');
INSERT INTO public.blocks (id, module_id, local_id, type_id, content, title) VALUES (248, 77, 0, 1, '<p>Специалист в области Data Science строит на основе данных модели, которые помогают принимать решения в науке, бизнесе и повседневной жизни.</p><p>Суть данной технологии лежит в размещении данных, то есть информации, в некой базе, из которой эту информацию можно просмотреть, использовать, изменить и так далее. Однако такие базы должны быть не только понятны людям, сколько понятны программам и компьютеру. Простейшей формой базы данных может является таблица Excel.</p><p>Датасаентист работает с данными так же, как ученый в любой другой сфере. Он использует математическую статистику, логические принципы и современные инструменты визуализации, чтобы получить результат.</p>', 'Название блока');
INSERT INTO public.blocks (id, module_id, local_id, type_id, content, title) VALUES (249, 77, 1, 2, 'https://www.youtube.com/embed/pLZyMbPTKOg', 'Название блока');
INSERT INTO public.blocks (id, module_id, local_id, type_id, content, title) VALUES (250, 77, 2, 4, 'https://cl17777-441f0272-079d-4489-a9ed-a811e18f057f.s3.timeweb.com/courses/72/5f3ec2b3-7734-4ec7-a2df-d6d2263eda8f.1662491092414.jpg', 'Название блока');
INSERT INTO public.blocks (id, module_id, local_id, type_id, content, title) VALUES (251, 77, 3, 3, 'https://cl17777-441f0272-079d-4489-a9ed-a811e18f057f.s3.timeweb.com/courses/72/cde07008-8ef1-4105-9957-125c9819c115.1662491113341.xls', 'Название блока');
INSERT INTO public.blocks (id, module_id, local_id, type_id, content, title) VALUES (333, 80, 3, 1, '<p><span style="color: rgb(33, 37, 41);">Анонимной в JavaScript называют функцию с которой не связано никакое имя или другими словами у такой функции нет имени. Также можно сказать, что если после ключевого слова&nbsp;</span><code style="color: rgb(113, 111, 110); background-color: rgb(240, 240, 244);">function</code><span style="color: rgb(33, 37, 41);">&nbsp;или перед знаком стрелочной функции&nbsp;</span><code style="color: rgb(113, 111, 110); background-color: rgb(240, 240, 244);">=&gt;</code><span style="color: rgb(33, 37, 41);">&nbsp;не стоит имя - функция анонимная. Однако если такую функцию положить в переменную она уже считается именованной.</span></p>', 'Определение Анонимной функции');


--
-- TOC entry 3456 (class 0 OID 16429)
-- Dependencies: 215
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categories (id, title) VALUES (1, 'Madoka');
INSERT INTO public.categories (id, title) VALUES (2, 'test');
INSERT INTO public.categories (id, title) VALUES (3, 'Sleep');
INSERT INTO public.categories (id, title) VALUES (0, 'Web');


--
-- TOC entry 3458 (class 0 OID 16436)
-- Dependencies: 217
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.courses (id, title, description, author_id, trailer_url, main_topics, image_url, is_visible, price, category_id, user_level) VALUES (76, 'Анализ больших данных', '<p>В данном курсе вы получите навыки владения <strong>языком программирования Python</strong>, изучите основные библиотеки для анализа и работы с большими данными, научитесь проводить предварительную обработку данных и рассмотрите разные модели нейронных сетей для обучения в рамках решения задач по тематике курса.</p>', 23, '', '{}', 'https://www.bigdataschool.ru/wp-content/uploads/2019/03/bigdata3_1_5a6ea0b3d8f8d.jpg', true, 0, 2, '1');
INSERT INTO public.courses (id, title, description, author_id, trailer_url, main_topics, image_url, is_visible, price, category_id, user_level) VALUES (72, 'Data Science', '<p><span style="color: rgba(0, 0, 0, 0.86);">Вам интересно собирать информацию, анализировать и искать скрытые зависимости? Нравится выдвигать и проверять гипотезы? Поздравляем, это направление для вас! Мы научим работать с большим объемом данных и познакомим с технологией Big Data.</span></p>', 21, 'https://youtu.be/pLZyMbPTKOg', '{}', 'https://sun9-25.userapi.com/impg/_LyZisBv8GyJFWykbxgZwLNysyYQw7cBOpCs5w/wLIURdMVxqU.jpg?size=1280x1280&quality=95&sign=b4703878d241eeac0a4f28ae09e5e781&type=album', false, 0, 0, '1');
INSERT INTO public.courses (id, title, description, author_id, trailer_url, main_topics, image_url, is_visible, price, category_id, user_level) VALUES (71, 'Курс "Аналитик данных"', '<p><span style="background-color: rgb(243, 243, 245); color: rgb(0, 0, 0);">Научитесь анализировать данные с&nbsp;помощью сервисов аналитики и&nbsp;BI-инструментов, освоите Python и&nbsp;SQL. Сможете строить прогнозы на&nbsp;основе данных и&nbsp;помогать бизнесу принимать решения.</span></p>', 20, '', '{}', '', true, 0, 0, '1');
INSERT INTO public.courses (id, title, description, author_id, trailer_url, main_topics, image_url, is_visible, price, category_id, user_level) VALUES (78, 'Web-разработка', '<p>В данном курсе вы узнаете...</p>', 28, 'https://www.youtube.com/embed/iCx4oYgeUGw', '{}', 'https://png.pngtree.com/png-vector/20190613/ourlarge/pngtree-web-development-illustration-modern-can-be-used-for-landing-pages-web-png-image_1496222.jpg', true, 0, 0, '1');
INSERT INTO public.courses (id, title, description, author_id, trailer_url, main_topics, image_url, is_visible, price, category_id, user_level) VALUES (75, 'web', '<p><span style="color: rgb(77, 81, 86);">Веб-разработка — процесс создания веб-сайта или веб-приложения. Основными этапами процесса являются веб-дизайн, вёрстка страниц, программирование на стороне клиента и сервера, а также конфигурирование веб-сервера.</span></p>', 21, 'https://www.youtube.com/embed/iqtQJOXr40Q', '{A8,"HTML CSS",React}', 'https://bboom.pro/wp-content/uploads/2021/05/sozdanie-sajtov-21-1.jpg', true, 321321, 2, '2');


--
-- TOC entry 3460 (class 0 OID 16446)
-- Dependencies: 219
-- Data for Name: courses_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.courses_tags (course_id, tag_id, id) VALUES (72, 2, 8);
INSERT INTO public.courses_tags (course_id, tag_id, id) VALUES (72, 3, 9);
INSERT INTO public.courses_tags (course_id, tag_id, id) VALUES (76, 3, 20);
INSERT INTO public.courses_tags (course_id, tag_id, id) VALUES (78, 1, 28);


--
-- TOC entry 3461 (class 0 OID 16450)
-- Dependencies: 220
-- Data for Name: email_verify; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3463 (class 0 OID 16456)
-- Dependencies: 222
-- Data for Name: feedbacks; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3477 (class 0 OID 16613)
-- Dependencies: 236
-- Data for Name: mentor_verify_query; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3464 (class 0 OID 16462)
-- Dependencies: 223
-- Data for Name: modules; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.modules (id, local_id, section_id, title) VALUES (80, 0, 293, 'Объектная модель документа');
INSERT INTO public.modules (id, local_id, section_id, title) VALUES (87, 0, 303, 'Название модуля');
INSERT INTO public.modules (id, local_id, section_id, title) VALUES (77, 0, 288, 'Введение');
INSERT INTO public.modules (id, local_id, section_id, title) VALUES (79, 0, 285, 'Название модуля');
INSERT INTO public.modules (id, local_id, section_id, title) VALUES (81, 0, 294, 'Основы DataScience');
INSERT INTO public.modules (id, local_id, section_id, title) VALUES (83, 1, 297, 'Реакт');
INSERT INTO public.modules (id, local_id, section_id, title) VALUES (85, 0, 300, 'Модуль 1');
INSERT INTO public.modules (id, local_id, section_id, title) VALUES (82, 0, 297, 'Ангуляр');


--
-- TOC entry 3466 (class 0 OID 16469)
-- Dependencies: 225
-- Data for Name: permission_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.permission_types (id, name) VALUES (1, 'CAN_VIEW_COURSE');
INSERT INTO public.permission_types (id, name) VALUES (2, 'CAN_EDIT_COURSE');
INSERT INTO public.permission_types (id, name) VALUES (3, 'CAN_DELEGATE_PERMISSIONS');
INSERT INTO public.permission_types (id, name) VALUES (4, 'CAN_CHECK_HOMEWORK');
INSERT INTO public.permission_types (id, name) VALUES (5, 'ADMINISTRATOR');
INSERT INTO public.permission_types (id, name) VALUES (6, 'MENTOR');


--
-- TOC entry 3469 (class 0 OID 16477)
-- Dependencies: 228
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.sections (id, course_id, local_id, title) VALUES (289, 72, 1, 'Cбор и анализ данных');
INSERT INTO public.sections (id, course_id, local_id, title) VALUES (290, 72, 2, 'Технологии Big Data');
INSERT INTO public.sections (id, course_id, local_id, title) VALUES (288, 72, 0, 'Работа с базами данных');
INSERT INTO public.sections (id, course_id, local_id, title) VALUES (293, 75, 0, 'основы веб разработки');
INSERT INTO public.sections (id, course_id, local_id, title) VALUES (294, 76, 0, 'Введение');
INSERT INTO public.sections (id, course_id, local_id, title) VALUES (295, 76, 1, 'Основы программирования Python');
INSERT INTO public.sections (id, course_id, local_id, title) VALUES (296, 76, 2, 'Новая секция');
INSERT INTO public.sections (id, course_id, local_id, title) VALUES (298, 75, 2, 'Новая секция');
INSERT INTO public.sections (id, course_id, local_id, title) VALUES (300, 78, 0, 'Введение в html 5');
INSERT INTO public.sections (id, course_id, local_id, title) VALUES (301, 78, 1, 'Angular');
INSERT INTO public.sections (id, course_id, local_id, title) VALUES (303, 75, 3, 'wqewewew');
INSERT INTO public.sections (id, course_id, local_id, title) VALUES (285, 71, 0, 'Секция 1. Введение в Python');
INSERT INTO public.sections (id, course_id, local_id, title) VALUES (286, 71, 1, 'Секция 2. SQL');
INSERT INTO public.sections (id, course_id, local_id, title) VALUES (287, 71, 2, 'Секция 3. Разработка собственного сервиса');
INSERT INTO public.sections (id, course_id, local_id, title) VALUES (297, 75, 1, 'Работа с фремворками');
INSERT INTO public.sections (id, course_id, local_id, title) VALUES (320, 75, 4, 'Новая секция');


--
-- TOC entry 3471 (class 0 OID 16484)
-- Dependencies: 230
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tags (id, title) VALUES (1, 'Angular');
INSERT INTO public.tags (id, title) VALUES (2, 'Vue.js');
INSERT INTO public.tags (id, title) VALUES (3, 'Python');


--
-- TOC entry 3473 (class 0 OID 16489)
-- Dependencies: 232
-- Data for Name: user_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (181, 26, NULL, 6);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (182, 28, NULL, 6);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (183, 30, NULL, 6);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (184, 32, NULL, 6);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (30, 20, 71, 2);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (31, 20, 71, 3);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (32, 21, 72, 2);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (33, 21, 72, 3);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (38, 21, 75, 2);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (39, 21, 75, 3);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (40, 23, 76, 2);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (41, 23, 76, 3);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (57, 20, 71, 1);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (58, 21, 72, 1);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (61, 21, 75, 1);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (62, 23, 76, 1);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (63, 24, NULL, 5);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (67, 28, 78, 1);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (68, 28, 78, 2);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (69, 28, 78, 3);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (73, 21, NULL, 6);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (74, 6, NULL, 6);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (158, 37, 71, 1);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (169, 11, NULL, 6);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (170, 37, 75, 1);
INSERT INTO public.user_permissions (id, user_id, course_id, permission_id) VALUES (174, 24, 71, 1);


--
-- TOC entry 3475 (class 0 OID 16494)
-- Dependencies: 234
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, email, password, about, refresh_token, is_verified, avatar_url, first_name, second_name, third_name, is_accepted) VALUES (6, 'aleksandr52.02@mail.ru', '$2b$10$u/osIusIKHsmnwiy95ZzhOvpmT54fCOupF/yIT4n73JL5bUm0.qkq', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE2NjY4MDM2MjgsImV4cCI6MTY2OTM5NTYyOH0.ezIIcrj6ZPhYC4y507dTGpVFDvGGLh8V96uvP1Eg6Yw', false, NULL, 'Александр', 'Жуков', 'Вячеславович', true);
INSERT INTO public.users (id, email, password, about, refresh_token, is_verified, avatar_url, first_name, second_name, third_name, is_accepted) VALUES (11, 'roman@ya.ru', '$2b$10$rsM4lw6E0WGc3ybLJNX2Seb5RmZcMaifiGJ8J8RmzIossSKMp/ELy', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjY2ODAzNTg4LCJleHAiOjE2NjkzOTU1ODh9.xJClpCN2nph6qpOePbGvLCb2cFiSA3tjV1ID15kpWZk', false, NULL, 'Роман', 'Козлов', 'а это вам зачем', true);
INSERT INTO public.users (id, email, password, about, refresh_token, is_verified, avatar_url, first_name, second_name, third_name, is_accepted) VALUES (24, 'konodioda@gmail.com', '$2b$10$1.hdtGMOHcz30xkBGES/MeAa96M1PE4cXmH0/zLlwDzIJu7Ku8i8e', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjY2ODAzOTUzLCJleHAiOjE2NjkzOTU5NTN9.pnNfwBDmlv_Ix9ss0g9VrHXecriZIB4XV3nYe8Ek4zs', false, NULL, 'Админ', 'Админов', 'Иванович', true);
INSERT INTO public.users (id, email, password, about, refresh_token, is_verified, avatar_url, first_name, second_name, third_name, is_accepted) VALUES (20, 'tikae155@gmail.com', '$2b$10$9GaAM2OI973ljl0mNdNt2.JfcFmsgJEEGxs2dr4Xo5c8pGHPXcNlC', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjYyNTM1OTk5LCJleHAiOjE2NjUxMjc5OTl9.sP4qCJiHz7q0zLXWqusQ0syXvcaNN6u47ee6AVrK6Vw', false, NULL, 'Андрей', 'Василенко', 'Васильевич', true);
INSERT INTO public.users (id, email, password, about, refresh_token, is_verified, avatar_url, first_name, second_name, third_name, is_accepted) VALUES (26, 'borodinatl@mail.ru', '$2b$10$xnLrwzdWd3fXivH2JjsCFez46UE4K84Dq59.iKvh2tS8hM8whTDO6', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjYsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjYzMDU2OTE2LCJleHAiOjE2NjU2NDg5MTZ9.YFOZuI2pt0-Dngm6dNCB2uJCSZjC1cThJlZpPS6w090', false, NULL, 'Татьяна', 'Бородина', 'Леонидовна', true);
INSERT INTO public.users (id, email, password, about, refresh_token, is_verified, avatar_url, first_name, second_name, third_name, is_accepted) VALUES (23, 'borodinatl02@yandex.ru', '$2b$10$9QnNWYt5FKzdzEyUwC3BP.CQqcSH4USB/GC/.UnOk9QCiOo3zAgou', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjYyNjIzMzE1LCJleHAiOjE2NjUyMTUzMTV9.wfg4tDsITUhRPdW633pMbjeyxCmNY--e9MyDldS9e3U', false, NULL, 'Татьяна', 'Бородина', 'Леонидовна', true);
INSERT INTO public.users (id, email, password, about, refresh_token, is_verified, avatar_url, first_name, second_name, third_name, is_accepted) VALUES (28, 'borodinatl01@mail.ru', '$2b$10$AvXNCBgA9Od/Bnups8aeOuU38440Omq1aPu4qKv3IY3zLZhA/FYvm', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjgsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjYzMDU3MTE4LCJleHAiOjE2NjU2NDkxMTh9.fuMMiyMFktYCvHlpnisF39LJLq0QwsLS_o1FgOIk3UY', false, NULL, 'Татьяна', 'Бородина', 'Леонидовна', true);
INSERT INTO public.users (id, email, password, about, refresh_token, is_verified, avatar_url, first_name, second_name, third_name, is_accepted) VALUES (30, 'ivanov02@mail.ru', '$2b$10$XsG361kOyyyEIsNvOIlhqujC6pw/NVCUpr7eeHq1I/aJprcCCaJZ.', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzAsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjYzMDU3NTc3LCJleHAiOjE2NjU2NDk1Nzd9.aZcQsiFTmuxXl4ZlRfy0WAA-tsQD5puxJC8oeCzphu0', false, NULL, 'Иван', 'Иванов', 'Иванович', true);
INSERT INTO public.users (id, email, password, about, refresh_token, is_verified, avatar_url, first_name, second_name, third_name, is_accepted) VALUES (32, 'email@email.com', '$2b$10$NFPsvl8PxXDF0UtOzGBkDO3dVRvH6TzI2bgzW4Vj/Ul7VKVtDh50i', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzIsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjYzNTk2MDQ2LCJleHAiOjE2NjYxODgwNDZ9.PLioWP9o469TypbLr3aeK4O0bhd0vKGrzKrMgC3KM4A', false, NULL, 'Имя', 'Фамилия', 'Отчество', true);
INSERT INTO public.users (id, email, password, about, refresh_token, is_verified, avatar_url, first_name, second_name, third_name, is_accepted) VALUES (37, 'ksidyagin@mail.ru', '$2b$10$yuB4R1RJxZqNqOu5TyM04ef47L9XeoOX9LVKU17zu/O1aaejrw9FC', 'Я ВАМ ЗАПРЕЩАЮ СРАТБ В ЛМС БЛЯТБ', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzcsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjY2NzMwODkyLCJleHAiOjE2NjkzMjI4OTJ9.T95d9tff8d6J7UKmmxlRSzlF-d93ZrN0a3OBmREM2KU', false, 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Jason_Statham_2018.jpg', 'Jason', 'Statham', 'Хуетчество', true);
INSERT INTO public.users (id, email, password, about, refresh_token, is_verified, avatar_url, first_name, second_name, third_name, is_accepted) VALUES (21, 'timkar164@gmail.com', '$2b$10$kskyJBeifhDzJu8JAUXjduuu95fy/B0kSfC/ezu/7VEZ25qUMSBZG', 'qeqeqeqeqweq', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjEsInR5cGUiOiJyZWZyZXNoIiwiaWF0IjoxNjY2Nzk5MDU3LCJleHAiOjE2NjkzOTEwNTd9.yoxbcYoJRTfCB1DZJfbX9yRr_zqyySir3C_mP4bO69o', false, 'https://i.ytimg.com/vi/hCqUw7g7KJg/maxresdefault.jpg', 'Тимофей', 'Карклин', 'Дмитриевич', true);


--
-- TOC entry 3512 (class 0 OID 0)
-- Dependencies: 210
-- Name: block_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.block_type_id_seq', 102, true);


--
-- TOC entry 3513 (class 0 OID 0)
-- Dependencies: 212
-- Name: blocks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.blocks_id_seq', 358, true);


--
-- TOC entry 3514 (class 0 OID 0)
-- Dependencies: 214
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 3, true);


--
-- TOC entry 3515 (class 0 OID 0)
-- Dependencies: 216
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_id_seq', 105, true);


--
-- TOC entry 3516 (class 0 OID 0)
-- Dependencies: 218
-- Name: courses_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_tags_id_seq', 36, true);


--
-- TOC entry 3517 (class 0 OID 0)
-- Dependencies: 221
-- Name: feedbacks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.feedbacks_id_seq', 70, true);


--
-- TOC entry 3518 (class 0 OID 0)
-- Dependencies: 235
-- Name: mentor_verify_query_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mentor_verify_query_id_seq', 4, true);


--
-- TOC entry 3519 (class 0 OID 0)
-- Dependencies: 224
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.permissions_id_seq', 6, true);


--
-- TOC entry 3520 (class 0 OID 0)
-- Dependencies: 226
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 4, true);


--
-- TOC entry 3521 (class 0 OID 0)
-- Dependencies: 227
-- Name: sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sections_id_seq', 320, true);


--
-- TOC entry 3522 (class 0 OID 0)
-- Dependencies: 229
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tags_id_seq', 3, true);


--
-- TOC entry 3523 (class 0 OID 0)
-- Dependencies: 231
-- Name: user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_permissions_id_seq', 184, true);


--
-- TOC entry 3524 (class 0 OID 0)
-- Dependencies: 233
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 40, true);


--
-- TOC entry 3279 (class 2606 OID 16502)
-- Name: permission_types Permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permission_types
    ADD CONSTRAINT "Permissions_pkey" PRIMARY KEY (id);


--
-- TOC entry 3261 (class 2606 OID 16504)
-- Name: blocks block_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT block_id_pkey PRIMARY KEY (id);


--
-- TOC entry 3265 (class 2606 OID 16506)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3277 (class 2606 OID 16508)
-- Name: modules content_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT content_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3269 (class 2606 OID 16510)
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- TOC entry 3271 (class 2606 OID 16512)
-- Name: courses_tags courses_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses_tags
    ADD CONSTRAINT courses_tags_pkey PRIMARY KEY (id);


--
-- TOC entry 3275 (class 2606 OID 16514)
-- Name: feedbacks feedbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_pkey PRIMARY KEY (id);


--
-- TOC entry 3295 (class 2606 OID 16620)
-- Name: mentor_verify_query mentor_verify_id_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mentor_verify_query
    ADD CONSTRAINT mentor_verify_id_pkey PRIMARY KEY (id);


--
-- TOC entry 3297 (class 2606 OID 16622)
-- Name: mentor_verify_query mentor_verify_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mentor_verify_query
    ADD CONSTRAINT mentor_verify_user_id_unique UNIQUE (user_id);


--
-- TOC entry 3259 (class 2606 OID 16516)
-- Name: block_types module_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.block_types
    ADD CONSTRAINT module_types_pkey PRIMARY KEY (id);


--
-- TOC entry 3281 (class 2606 OID 16518)
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- TOC entry 3283 (class 2606 OID 16520)
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- TOC entry 3267 (class 2606 OID 16522)
-- Name: categories title; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT title UNIQUE (title);


--
-- TOC entry 3285 (class 2606 OID 16524)
-- Name: tags title_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT title_unique UNIQUE (title);


--
-- TOC entry 3263 (class 2606 OID 16526)
-- Name: blocks unique_block; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT unique_block UNIQUE (module_id, local_id);


--
-- TOC entry 3287 (class 2606 OID 16528)
-- Name: user_permissions unique_permissions; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT unique_permissions UNIQUE (user_id, course_id, permission_id);


--
-- TOC entry 3273 (class 2606 OID 16530)
-- Name: courses_tags unique_row; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses_tags
    ADD CONSTRAINT unique_row UNIQUE (course_id, tag_id, id);


--
-- TOC entry 3289 (class 2606 OID 16532)
-- Name: user_permissions user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 3291 (class 2606 OID 16534)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3293 (class 2606 OID 16536)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3300 (class 2606 OID 16537)
-- Name: courses category_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT category_id FOREIGN KEY (category_id) REFERENCES public.categories(id) NOT VALID;


--
-- TOC entry 3308 (class 2606 OID 16542)
-- Name: user_permissions course_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT course_id FOREIGN KEY (course_id) REFERENCES public.courses(id) NOT VALID;


--
-- TOC entry 3307 (class 2606 OID 16547)
-- Name: sections course_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT course_id FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- TOC entry 3302 (class 2606 OID 16552)
-- Name: courses_tags course_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses_tags
    ADD CONSTRAINT course_id FOREIGN KEY (course_id) REFERENCES public.courses(id) NOT VALID;


--
-- TOC entry 3301 (class 2606 OID 16557)
-- Name: courses courses_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- TOC entry 3304 (class 2606 OID 16562)
-- Name: feedbacks feedbacks_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);


--
-- TOC entry 3305 (class 2606 OID 16567)
-- Name: feedbacks feedbacks_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id);


--
-- TOC entry 3311 (class 2606 OID 16623)
-- Name: mentor_verify_query mentor_verify_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mentor_verify_query
    ADD CONSTRAINT mentor_verify_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 3298 (class 2606 OID 16572)
-- Name: blocks module_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT module_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id);


--
-- TOC entry 3309 (class 2606 OID 16577)
-- Name: user_permissions permission_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT permission_id FOREIGN KEY (permission_id) REFERENCES public.permission_types(id) NOT VALID;


--
-- TOC entry 3306 (class 2606 OID 16582)
-- Name: modules section_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT section_id FOREIGN KEY (section_id) REFERENCES public.sections(id) NOT VALID;


--
-- TOC entry 3303 (class 2606 OID 16587)
-- Name: courses_tags tag_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses_tags
    ADD CONSTRAINT tag_id FOREIGN KEY (tag_id) REFERENCES public.tags(id) NOT VALID;


--
-- TOC entry 3299 (class 2606 OID 16592)
-- Name: blocks type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocks
    ADD CONSTRAINT type_fkey FOREIGN KEY (type_id) REFERENCES public.block_types(id);


--
-- TOC entry 3310 (class 2606 OID 16597)
-- Name: user_permissions user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES public.users(id) NOT VALID;


--
-- TOC entry 3484 (class 0 OID 0)
-- Dependencies: 237
-- Name: PROCEDURE auto_clear_email_tokens(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON PROCEDURE public.auto_clear_email_tokens() TO express;


--
-- TOC entry 3485 (class 0 OID 0)
-- Dependencies: 210
-- Name: SEQUENCE block_type_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.block_type_id_seq TO express;


--
-- TOC entry 3486 (class 0 OID 0)
-- Dependencies: 211
-- Name: TABLE block_types; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.block_types TO express;


--
-- TOC entry 3487 (class 0 OID 0)
-- Dependencies: 212
-- Name: SEQUENCE blocks_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.blocks_id_seq TO express;


--
-- TOC entry 3488 (class 0 OID 0)
-- Dependencies: 213
-- Name: TABLE blocks; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.blocks TO express;


--
-- TOC entry 3489 (class 0 OID 0)
-- Dependencies: 214
-- Name: SEQUENCE categories_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.categories_id_seq TO express;


--
-- TOC entry 3490 (class 0 OID 0)
-- Dependencies: 215
-- Name: TABLE categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.categories TO express;


--
-- TOC entry 3491 (class 0 OID 0)
-- Dependencies: 216
-- Name: SEQUENCE courses_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.courses_id_seq TO express;


--
-- TOC entry 3492 (class 0 OID 0)
-- Dependencies: 217
-- Name: TABLE courses; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.courses TO express;


--
-- TOC entry 3493 (class 0 OID 0)
-- Dependencies: 218
-- Name: SEQUENCE courses_tags_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.courses_tags_id_seq TO express;


--
-- TOC entry 3494 (class 0 OID 0)
-- Dependencies: 219
-- Name: TABLE courses_tags; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.courses_tags TO express;


--
-- TOC entry 3495 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE email_verify; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.email_verify TO express;


--
-- TOC entry 3496 (class 0 OID 0)
-- Dependencies: 221
-- Name: SEQUENCE feedbacks_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.feedbacks_id_seq TO express;


--
-- TOC entry 3497 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE feedbacks; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.feedbacks TO express;


--
-- TOC entry 3498 (class 0 OID 0)
-- Dependencies: 235
-- Name: SEQUENCE mentor_verify_query_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,UPDATE ON SEQUENCE public.mentor_verify_query_id_seq TO express;


--
-- TOC entry 3499 (class 0 OID 0)
-- Dependencies: 236
-- Name: TABLE mentor_verify_query; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.mentor_verify_query TO express;


--
-- TOC entry 3500 (class 0 OID 0)
-- Dependencies: 223
-- Name: TABLE modules; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.modules TO express;


--
-- TOC entry 3501 (class 0 OID 0)
-- Dependencies: 224
-- Name: SEQUENCE permissions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.permissions_id_seq TO express;


--
-- TOC entry 3502 (class 0 OID 0)
-- Dependencies: 225
-- Name: TABLE permission_types; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.permission_types TO express;


--
-- TOC entry 3503 (class 0 OID 0)
-- Dependencies: 226
-- Name: SEQUENCE roles_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.roles_id_seq TO express;


--
-- TOC entry 3504 (class 0 OID 0)
-- Dependencies: 227
-- Name: SEQUENCE sections_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.sections_id_seq TO express;


--
-- TOC entry 3505 (class 0 OID 0)
-- Dependencies: 228
-- Name: TABLE sections; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.sections TO express;


--
-- TOC entry 3506 (class 0 OID 0)
-- Dependencies: 229
-- Name: SEQUENCE tags_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.tags_id_seq TO express;


--
-- TOC entry 3507 (class 0 OID 0)
-- Dependencies: 230
-- Name: TABLE tags; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.tags TO express;


--
-- TOC entry 3508 (class 0 OID 0)
-- Dependencies: 231
-- Name: SEQUENCE user_permissions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.user_permissions_id_seq TO express;


--
-- TOC entry 3509 (class 0 OID 0)
-- Dependencies: 232
-- Name: TABLE user_permissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.user_permissions TO express;


--
-- TOC entry 3510 (class 0 OID 0)
-- Dependencies: 233
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.users_id_seq TO express;


--
-- TOC entry 3511 (class 0 OID 0)
-- Dependencies: 234
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.users TO express;


-- Completed on 2022-10-26 20:30:38

--
-- PostgreSQL database dump complete
--

-- Completed on 2022-10-26 20:30:38

--
-- PostgreSQL database cluster dump complete
--

