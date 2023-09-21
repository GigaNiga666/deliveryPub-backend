
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
    alcohol_percent INT2 NOT NULL,
    liter FLOAT(3) NOT NULL,
    bitterness INT2 NOT NULL,
    country VARCHAR(255) NOT NULL,
    brewery_name VARCHAR(255) NOT NULL,
    style_name VARCHAR(255) NOT NULL,
    category_id INTEGER,
    FOREIGN KEY (category) REFERENCES category(id)
);