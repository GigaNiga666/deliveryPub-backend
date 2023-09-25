
create TABLE category (
    id SMALLSERIAL PRIMARY KEY,
    category_title VARCHAR(255) NOT NULL,
    class_title VARCHAR(25) NOT NULL
);

create TABLE product (
    id SMALLSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,
    price INT2 NOT NULL,
    alcohol_percent INT2,
    volume FLOAT(3) NOT NULL,
    bitterness INT2,
    country VARCHAR(255),
    brewery_name VARCHAR(255),
    style_name VARCHAR(255),
    compound VARCHAR(255),
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(id)
);