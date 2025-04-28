DROP TABLE IF EXISTS item CASCADE;

DROP TABLE IF EXISTS orders CASCADE;

DROP TABLE IF EXISTS order_item CASCADE;

DROP TABLE IF EXISTS menu CASCADE;

DROP TABLE IF EXISTS kitchen_confirm CASCADE;

DROP TABLE IF EXISTS requests CASCADE;

DROP TABLE IF EXISTS assistance CASCADE;

DROP TABLE IF EXISTS kitchen_orders CASCADE;

CREATE TABLE item (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  description VARCHAR(250),
  price DECIMAL(10, 2) NOT NULL,
  available BOOLEAN,
  category VARCHAR(30) NOT NULL,
  allergens VARCHAR(255),
  protein DECIMAL(10, 2),
  carbohydrates DECIMAL(10, 2),
  fat DECIMAL(10, 2),
  image_url VARCHAR(255)
);

INSERT INTO
  item (
    name,
    description,
    price,
    available,
    category,
    allergens,
    protein,
    carbohydrates,
    fat,
    image_url
  )
VALUES
  (
    'Tacos',
    'Soft or crispy tortillas filled with marinated meat of your choice, topped with fresh pineapple, cilantro, and zesty salsa.',
    8.99,
    TRUE,
    'food',
    'wheat',
    30.5,
    15.0,
    5.2,
    '/images/tacos.png'
  ),
  (
    'Burrito',
    'A hearty flour tortilla stuffed with seasoned chicken, rice, beans, and topped with flavorful green salsa.',
    10.99,
    TRUE,
    'food',
    'wheat, dairy',
    25.0,
    45.0,
    15.0,
    '/images/burrito.png'
  ),
  (
    'Burrito Bowl',
    'Want more burrito without the wrap? All the delicious ingredients of a burrito, served in a bowl without the tortilla, for a fresh and filling meal.',
    10.99,
    TRUE,
    'food',
    'wheat',
    30.5,
    15.0,
    5.2,
    '/images/bowl.png'
  ),
  (
    'Quesadilla',
    'A warm, grilled tortilla loaded with melted cheese, savory fillings, and served with a side of fresh salsa.',
    9.99,
    TRUE,
    'food',
    'wheat, dairy',
    35.5,
    20.0,
    5.2,
    '/images/quesadilla.png'
  ),
  (
    'Salad Bowl',
    'A vibrant mix of crisp greens, fresh vegetables, and traditional hominy soup with tender pork.',
    11.99,
    TRUE,
    'food',
    NULL,
    20.0,
    30.0,
    10.0,
    '/images/salad.png'
  ),
  (
    'Tortilla Chips',
    'Crunchy tortilla chips paired with a variety of flavorful dips, including guacamole, salsa, and queso.',
    4.99,
    TRUE,
    'food',
    'wheat',
    5.0,
    40.0,
    15.0,
    '/images/chips.png'
  ),
  (
    'High-Protein Bowl',
    'A power-packed bowl with extra protein, fewer carbs, and a mix of nutritious vegetables.',
    12.99,
    TRUE,
    'food',
    NULL,
    35.0,
    20.0,
    12.0,
    '/images/protein.jpg'
  ),
  (
    'Veggie-Lover Bowl',
    'A wholesome, meat-free bowl loaded with fresh vegetables, beans, and delicious toppings.',
    11.99,
    TRUE,
    'food',
    NULL,
    15.0,
    35.0,
    8.0,
    '/images/veggies.jpg'
  ),
  (
    'Coke',
    'The classic Coca-Cola experience—bold, fizzy, and refreshing.',
    2.99,
    TRUE,
    'drinks',
    NULL,
    0.0,
    39.0,
    0.0,
    '/images/coke.png'
  ),
  (
    'Diet Coke',
    'All the bold, refreshing flavor of Coca-Cola, but with zero sugar.',
    2.99,
    TRUE,
    'drinks',
    NULL,
    0.0,
    0.0,
    0.0,
    '/images/diet_coke.png'
  ),
  (
    'Fanta',
    'A sweet and fizzy orange-flavored soda that’s bursting with fruity goodness.',
    2.99,
    TRUE,
    'drinks',
    NULL,
    0.0,
    38.0,
    0.0,
    '/images/fanta.png'
  ),
  (
    'Sprite',
    'A crisp, lemon-lime flavored soda that’s caffeine-free and refreshingly light.',
    2.99,
    TRUE,
    'drinks',
    NULL,
    0.0,
    38.0,
    0.0,
    '/images/sprite.png'
  );

CREATE TABLE menu (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(30) NOT NULL,
  image_url VARCHAR(255),
  available BOOLEAN DEFAULT true,
  is_vegetarian BOOLEAN DEFAULT false,
  allergens VARCHAR(255),
  calories INT
);

INSERT INTO
  menu (
    name,
    description,
    price,
    category,
    image_url,
    available,
    is_vegetarian,
    allergens,
    calories
  )
VALUES
  (
    'Tacos',
    'Soft or crispy tortillas filled with marinated meat of your choice, topped with fresh pineapple, cilantro, and zesty salsa.',
    8.99,
    'food',
    '/images/tacos.png',
    true,
    false,
    'wheat',
    350
  ),
  (
    'Burrito',
    'A hearty flour tortilla stuffed with seasoned chicken, rice, beans, and topped with flavorful green salsa.',
    10.99,
    'food',
    '/images/burrito.png',
    true,
    false,
    'wheat, dairy',
    600
  ),
  (
    'Burrito Bowl',
    'Want more burrito without the wrap? All the delicious ingredients of a burrito, served in a bowl without the tortilla, for a fresh and filling meal.',
    10.99,
    'food',
    '/images/bowl.png',
    true,
    false,
    'dairy',
    550
  ),
  (
    'Quesadilla',
    'A warm, grilled tortilla loaded with melted cheese, savory fillings, and served with a side of fresh salsa.',
    9.99,
    'food',
    '/images/quesadilla.png',
    true,
    false,
    'wheat, dairy',
    500
  ),
  (
    'Salad Bowl',
    'A vibrant mix of crisp greens, fresh vegetables, and traditional hominy soup with tender pork.',
    11.99,
    'food',
    '/images/salad.png',
    true,
    false,
    null,
    400
  ),
  (
    'Tortilla Chips',
    'Crunchy tortilla chips paired with a variety of flavorful dips, including guacamole, salsa, and queso.',
    4.99,
    'food',
    '/images/chips.png',
    true,
    true,
    'wheat',
    250
  ),
  (
    'High-Protein Bowl',
    'A power-packed bowl with extra protein, fewer carbs, and a mix of nutritious vegetables.',
    12.99,
    'food',
    '/images/protein.jpg',
    true,
    false,
    null,
    650
  ),
  (
    'Veggie-Lover Bowl',
    'A wholesome, meat-free bowl loaded with fresh vegetables, beans, and delicious toppings.',
    11.99,
    'food',
    '/images/veggies.jpg',
    true,
    true,
    null,
    400
  ),
  (
    'Coke',
    'The classic Coca-Cola experience—bold, fizzy, and refreshing.',
    2.99,
    'drinks',
    '/images/coke.png',
    true,
    true,
    null,
    140
  ),
  (
    'Diet Coke',
    'All the bold, refreshing flavor of Coca-Cola, but with zero sugar.',
    2.99,
    'drinks',
    '/images/diet_coke.png',
    true,
    true,
    null,
    0
  );

CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100),
  table_number INT,
  order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  requests TEXT,
  item_id INT,
  FOREIGN KEY (item_id) REFERENCES menu(id)
);

CREATE TABLE order_item (
  id SERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL,
  item_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (item_id) REFERENCES item(id)
);

CREATE TABLE kitchen_confirm (
  id SERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL,
  item_id BIGINT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (item_id) REFERENCES item(id)
);

CREATE TABLE assistance (
  id SERIAL PRIMARY KEY,
  table_number INT NOT NULL,
  assistance_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE requests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  table_number INTEGER NOT NULL,
  request TEXT NOT NULL,
  request_time TIMESTAMP NOT NULL,
  status VARCHAR(50) NOT NULL
);

DROP TABLE IF EXISTS kitchen_order_items CASCADE;

CREATE TABLE kitchen_orders (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100),
  table_number INT,
  order_time TIMESTAMP,
  total DECIMAL(10, 2) NOT NULL,
  requests TEXT,
  confirmed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kitchen_order_items (
  id SERIAL PRIMARY KEY,
  kitchen_order_id BIGINT NOT NULL,
  item_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (kitchen_order_id) REFERENCES kitchen_orders(id),
  FOREIGN KEY (item_id) REFERENCES item(id)
);

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS payment VARCHAR(20) DEFAULT 'unpaid';