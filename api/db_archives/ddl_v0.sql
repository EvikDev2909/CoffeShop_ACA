CREATE SCHEMA app;

CREATE TABLE app.roles (
	id SERIAL PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE app.pages (
	id SERIAL PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	route VARCHAR(300) NOT NULL,
	active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE app.role_page (
	role_id INTEGER NOT NULL REFERENCES app.roles(id),
    page_id INTEGER NOT NULL REFERENCES app.pages(id),
    PRIMARY KEY (role_id, page_id)
);

CREATE TABLE app.users (
	id SERIAL PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	document VARCHAR(30) NOT NULL UNIQUE,
	password_hash VARCHAR(255) NOT NULL,
	active BOOLEAN NOT NULL DEFAULT TRUE,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	role_id INT NOT NULL REFERENCES app.roles(id)
);

CREATE TABLE app.categories (
	id SERIAL PRIMARY KEY,
	name VARCHAR(150) NOT NULL,
	active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE app.products (
	id SERIAL PRIMARY KEY,
	name VARCHAR(300) NOT NULL,
	price NUMERIC(10,2) NOT NULL CHECK(price >= 0),
	cost NUMERIC(10,2) NOT NULL CHECK(cost >= 0),
	available BOOLEAN NOT NULL DEFAULT TRUE,
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	updated_at TIMESTAMP,
	category_id INT NOT NULL REFERENCES app.categories(id)
);

CREATE TABLE app.orders (
	id SERIAL PRIMARY KEY,
	customer_name VARCHAR (150) NOT NULL,
	total NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK(total >= 0),
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	state VARCHAR(100) NOT NULL default 'creado' CHECK (state IN ('creado', 'en_preparacion', 'listo', 'entregado', 'cancelado')),
	user_id INT NOT NULL REFERENCES app.users(id)
);

CREATE TABLE app.order_details(
	id SERIAL PRIMARY KEY,
	order_id INT NOT NULL REFERENCES app.orders(id),
	product_id INT NOT NULL REFERENCES app.products(id),
	quantity INT NOT NULL CHECK(quantity > 0),
	price NUMERIC(10,2) NOT NULL CHECK(price >= 0),
	subtotal NUMERIC(10,2) NOT NULL CHECK(subtotal >= 0),
	notes TEXT
);

