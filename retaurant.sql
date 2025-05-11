Create database european_restaurant_db;

-- table Users
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Insert into Users(username, password, email, phone_number, address) values
('Username1', '123456', 'username1@gmail.com', '0123456789', 'Đồng Tháp'),
('Username2', '123456', 'username2@gmail.com', '0123456789', 'Đồng Tháp'),
('Username3', '123456', 'username3@gmail.com', '0123456789', 'Đồng Tháp'),
('Username4', '123456', 'username4@gmail.com', '0123456789', 'Đồng Tháp')

select * from Users



CREATE TABLE Restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(255),
    description TEXT,
    opening_hours VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO Restaurants (name, address, phone_number, email, description, opening_hours)
VALUES
('Nhà hàng Âu EU 1', 'Quận 1', '0123456789', 'Euquan1@gmail.com', 'Chi tiết nhà hàng EU quận 1', '9 giờ 30'),
('Nhà hàng Âu EU 2', 'Quận 2', '0123456789', 'Euquan2@gmail.com', 'Chi tiết nhà hàng EU quận 2', '9 giờ 30'),
('Nhà hàng Âu EU 3', 'Quận 3', '0123456789', 'Euquan3@gmail.com', 'Chi tiết nhà hàng EU quận 3', '9 giờ 30'),
('Nhà hàng Âu EU 4', 'Quận 4', '0123456789', 'Euquan4@gmail.com', 'Chi tiết nhà hàng EU quận 4', '9 giờ 30'),
('Nhà hàng Âu EU 5', 'Quận 5', '0123456789', 'Euquan5@gmail.com', 'Chi tiết nhà hàng EU quận 5', '9 giờ 30');

select * from Restaurants


CREATE TABLE Tables (
    table_id SERIAL PRIMARY KEY,
    restaurant_id INT NOT NULL,
    table_number INT NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    status VARCHAR(20) CHECK (status IN ('Available', 'Reserved', 'Occupied')),
	created_at = NOW() WHERE created_at IS NULL,
	updated_at = NOW() WHERE updated_at IS NULL
    UNIQUE (restaurant_id, table_number),
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE
);

insert into Tables (restaurant_id, table_number, capacity, status) values
(1, 1, 4, 'Available'),
(1, 2, 5, 'Available'),
(1, 3, 9, 'Available'),
(1, 4, 2, 'Available'),
(1, 5, 7, 'Available'),
(1, 6, 10, 'Available'),
(2, 1, 4, 'Available'),
(2, 2, 5, 'Available'),
(2, 3, 9, 'Available'),
(2, 4, 2, 'Available'),
(2, 5, 7, 'Available'),
(2, 6, 10, 'Available'),
(3, 1, 4, 'Available'),
(3, 2, 5, 'Available'),
(3, 4, 2, 'Available'),
(3, 5, 7, 'Available'),
(3, 6, 10, 'Available'),
(4, 1, 2, 'Available'),
(4, 5, 7, 'Available'),
(4, 6, 10, 'Available'),
(5, 4, 2, 'Available'),
(5, 5, 7, 'Available'),
(5, 2, 5, 'Available')

select * from Tables


CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    table_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
    status VARCHAR(20) CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE,
    FOREIGN KEY (table_id) REFERENCES Tables(table_id) ON DELETE SET NULL
);	

CREATE TABLE OrderItems (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price_at_time_of_order DECIMAL(10,2) NOT NULL CHECK (price_at_time_of_order >= 0),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
	FOREIGN KEY (menu_item_id) REFERENCES Dishes(dish_id) ON DELETE CASCADE
);
INSERT INTO OrderItems (order_id, dish_id, quantity, price_at_time_of_order) VALUES
(67, 1, 2, 150.00),
(67, 3, 1, 80.00),
(68, 2, 3, 120.50),
(68, 4, 1, 99.00),
(69, 5, 2, 200.00),
(69, 6, 1, 75.00),
(70, 7, 1, 300.00),
(70, 8, 2, 125.50),
(71, 9, 3, 180.00),
(71, 10, 1, 90.00),
(72, 1, 2, 250.75),
(72, 2, 1, 60.00),
(73, 3, 1, 99.99),
(73, 4, 2, 200.00),
(74, 5, 3, 45.00),
(74, 6, 1, 130.00),
(75, 1, 2, 350.00),
(75, 2, 1, 185.00),
(75, 3, 1, 210.00),
(75, 4, 2, 280.00);

select * from orderItems



CREATE TABLE Reservations (
    reservation_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    restaurant_id INT NOT NULL,
    table_id INT NOT NULL,
    reservation_time TIMESTAMP NOT NULL,
    number_of_guests INT NOT NULL CHECK (number_of_guests > 0),
    status VARCHAR(20) CHECK (status IN ('Pending', 'Confirmed', 'Cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE,
    FOREIGN KEY (table_id) REFERENCES Tables(table_id) ON DELETE CASCADE
);


INSERT INTO Reservations (user_id, restaurant_id, table_id, reservation_time, number_of_guests, status) VALUES
(1, 1, 37, '2025-03-10 18:30:00', 4, 'Pending'),
(3, 1, 39, '2025-03-10 19:30:00', 6, 'Cancelled'),
(4, 1, 40, '2025-03-10 20:00:00', 3, 'Pending'),
(5, 2, 41, '2025-03-11 18:30:00', 5, 'Confirmed'),
(1, 2, 42, '2025-03-11 19:00:00', 2, 'Pending'),
(3, 2, 44, '2025-03-11 20:00:00', 3, 'Confirmed'),
(4, 3, 45, '2025-03-12 18:30:00', 6, 'Pending'),
(5, 3, 46, '2025-03-12 19:00:00', 4, 'Confirmed'),
(1, 3, 47, '2025-03-12 19:30:00', 3, 'Cancelled'),
(3, 4, 49, '2025-03-13 18:30:00', 5, 'Confirmed'),
(4, 4, 50, '2025-03-13 19:00:00', 3, 'Pending'),
(5, 4, 51, '2025-03-13 19:30:00', 4, 'Cancelled'),
(1, 4, 52, '2025-03-13 20:00:00', 2, 'Confirmed'),
(3, 5, 54, '2025-03-14 19:00:00', 3, 'Confirmed'),
(4, 5, 55, '2025-03-14 19:30:00', 4, 'Cancelled'),
(5, 5, 56, '2025-03-14 20:00:00', 2, 'Pending');





CREATE TABLE Admin (
    admin_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

insert into Admin (username, password, email, phone_number) values
('Admin1','123456', 'admin1@gmail.com', '0123456879')

CREATE TABLE Staff (
    staff_id SERIAL PRIMARY KEY,
    restaurant_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(100), 
    phone_number VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    salary DECIMAL(10,2) DEFAULT 0,
    hire_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Active',
    FOREIGN KEY (restaurant_id) REFERENCES Restaurants(restaurant_id) ON DELETE CASCADE
);

INSERT INTO Staff (restaurant_id, name, position, phone_number, email, salary, hire_date, status) VALUES
(1, 'Nguyễn Văn A', 'Bếp trưởng', '0912345678', 'nguyenvana@example.com', 15000000.00, '2023-05-10', 'Active'),
(1, 'Trần Thị B', 'Phục vụ', '0923456789', 'tranthib@example.com', 7000000.00, '2023-06-15', 'Active'),
(1, 'Lê Văn C', 'Thu ngân', '0934567890', 'levanc@example.com', 9000000.00, '2023-07-20', 'Active'),
(1, 'Phạm Minh D', 'Quản lý', '0945678901', 'phamminhd@example.com', 20000000.00, '2023-04-05', 'Active'),
(1, 'Bùi Thanh E', 'Pha chế', '0956789012', 'buithanhe@example.com', 8000000.00, '2023-08-25', 'Active'),

(2, 'Đỗ Hồng F', 'Bếp trưởng', '0967890123', 'dohongf@example.com', 16000000.00, '2023-05-12', 'Active'),
(2, 'Vũ Quang G', 'Phục vụ', '0978901234', 'vuquangg@example.com', 7500000.00, '2023-06-18', 'Active'),
(2, 'Lý Thị H', 'Thu ngân', '0989012345', 'lythih@example.com', 9200000.00, '2023-07-22', 'Inactive'),
(2, 'Hồ Văn I', 'Quản lý', '0990123456', 'hovani@example.com', 21000000.00, '2023-04-08', 'Active'),
(2, 'Tạ Minh J', 'Pha chế', '0901234567', 'taminhj@example.com', 8200000.00, '2023-08-28', 'Active'),

(3, 'Cao Thị K', 'Bếp trưởng', '0911111111', 'caothik@example.com', 15500000.00, '2023-05-14', 'Inactive'),
(3, 'Phan Tuấn L', 'Phục vụ', '0922222222', 'phantuanl@example.com', 7200000.00, '2023-06-22', 'Active'),
(3, 'Đặng Thu M', 'Thu ngân', '0933333333', 'dangthum@example.com', 9100000.00, '2023-07-25', 'Active'),
(3, 'Ngô Hải N', 'Quản lý', '0944444444', 'ngohain@example.com', 20500000.00, '2023-04-10', 'Active'),
(3, 'Trịnh Hoàng O', 'Pha chế', '0955555555', 'trinhhoango@example.com', 8100000.00, '2023-08-30', 'Inactive'),

(4, 'Tôn Thất P', 'Bếp trưởng', '0966666666', 'tonthatp@example.com', 15800000.00, '2023-05-16', 'Active'),
(4, 'Lâm Thúy Q', 'Phục vụ', '0977777777', 'lamthuyq@example.com', 7300000.00, '2023-06-24', 'Inactive'),
(4, 'Đinh Phúc R', 'Thu ngân', '0988888888', 'dinhphucr@example.com', 9300000.00, '2023-07-28', 'Active'),
(4, 'Thái Văn S', 'Quản lý', '0999999999', 'thaivans@example.com', 22000000.00, '2023-04-12', 'Active'),
(4, 'Lương Bảo T', 'Pha chế', '0900000000', 'luongbaot@example.com', 8300000.00, '2023-09-02', 'Active');



CREATE TABLE DishCategories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO DishCategories (name) VALUES
('Món khai vị'),
('Món chính'),
('Món tráng miệng'),
('Đồ uống'),
('Hải sản');

CREATE TABLE Dishes (
    dish_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES DishCategories(category_id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE
);

INSERT INTO Dishes (category_id, name, description, price, image_url, is_available) VALUES
(1, 'Bò bít tết', 'Thịt bò nướng chín tới, ăn kèm với sốt tiêu đen.', 250000, 'images/bo_bit_tet.jpg', TRUE),
(1, 'Sườn cừu nướng', 'Sườn cừu ướp gia vị và nướng trên lửa than.', 320000, 'images/suon_cuu.jpg', TRUE),
(2, 'Mỳ Ý sốt bò bằm', 'Mỳ Ý với sốt thịt bò bằm, phô mai Parmesan.', 180000, 'images/my_y.jpg', TRUE),
(2, 'Pizza Hải sản', 'Pizza với tôm, mực, sốt cà chua và phô mai.', 220000, 'images/pizza_hai_san.jpg', TRUE),
(3, 'Salad cá hồi', 'Salad rau xanh với cá hồi tươi và nước sốt mè.', 150000, 'images/salad_ca_hoi.jpg', TRUE),
(3, 'Súp nấm kem', 'Súp kem với nấm hương, nấm mỡ và bơ.', 120000, 'images/sup_nam.jpg', TRUE),
(4, 'Kem dừa', 'Kem dừa tươi mát, ăn kèm với dừa sấy khô.', 90000, 'images/kem_dua.jpg', TRUE),
(4, 'Bánh tiramisu', 'Bánh Tiramisu với cà phê và kem phô mai.', 130000, 'images/tiramisu.jpg', TRUE),
(5, 'Nước ép cam', 'Nước ép cam tươi 100%, không đường.', 50000, 'images/nuoc_ep_cam.jpg', TRUE),
(5, 'Trà đào', 'Trà đào với miếng đào ngâm và đá lạnh.', 60000, 'images/tra_dao.jpg', TRUE);



CREATE TABLE OrderHistory (
    history_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    order_id INT REFERENCES Orders(order_id) ON DELETE CASCADE,
    dish_id INT REFERENCES Dishes(dish_id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    ,

INSERT INTO OrderHistory (user_id, order_id, dish_id, quantity, order_time) VALUES
(1, 67, 1, 2, '2024-03-01 12:30:00'),
(1, 67, 3, 1, '2024-03-01 12:35:00'),
(3, 69, 4, 1, '2024-03-03 14:10:00'),
(3, 69, 6, 2, '2024-03-03 14:15:00'),
(4, 70, 7, 3, '2024-03-04 19:30:00'),
(4, 70, 8, 1, '2024-03-04 19:35:00'),
(5, 71, 9, 4, '2024-03-05 13:20:00'),
(5, 71, 10, 2, '2024-03-05 13:25:00'),
(1, 72, 3, 1, '2024-03-06 17:50:00'),
(3, 73, 2, 2, '2024-03-07 20:10:00'),
(4, 73, 4, 1, '2024-03-07 20:15:00'),
(5, 74, 5, 3, '2024-03-08 11:30:00'),
(1, 74, 7, 2, '2024-03-08 11:35:00'),
(3, 75, 9, 2, '2024-03-09 15:45:00'),
(4, 67, 10, 3, '2024-03-10 18:20:00'),
(5, 68, 1, 1, '2024-03-10 18:25:00');


CREATE TABLE restaurant_dishes (
    restaurant_id INT REFERENCES restaurants(restaurant_id),
    dish_id INT REFERENCES dishes(dish_id),
    PRIMARY KEY (restaurant_id, dish_id)
);
INSERT INTO restaurant_dishes (restaurant_id, dish_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(2, 3), (2, 4), (2, 5), (2, 6), (2, 7),
(3, 1), (3, 2), (3, 6), (3, 7), (3, 8),
(4, 4), (4, 5), (4, 8), (4, 9), (4, 10);




ALTER TABLE dishes DROP CONSTRAINT dishes_restaurant_id_fkey;
ALTER TABLE dishes DROP COLUMN restaurant_id;

CREATE TABLE images (
    image_id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL
);

INSERT INTO images (image_url) VALUES
('https://example.com/images/dish1.jpg'),
('https://example.com/images/dish2.jpg'),
('https://example.com/images/dish3.jpg'),
('https://example.com/images/dish4.jpg'),
('https://example.com/images/dish5.jpg'),
('https://example.com/images/dish6.jpg'),
('https://example.com/images/dish7.jpg'),
('https://example.com/images/dish8.jpg'),
('https://example.com/images/dish9.jpg'),
('https://example.com/images/dish10.jpg'),
('https://example.com/images/dish11.jpg'),
('https://example.com/images/dish12.jpg'),
('https://example.com/images/dish13.jpg'),
('https://example.com/images/dish14.jpg'),
('https://example.com/images/dish15.jpg'),
('https://example.com/images/dish16.jpg'),
('https://example.com/images/dish17.jpg'),
('https://example.com/images/dish18.jpg'),
('https://example.com/images/dish19.jpg'),
('https://example.com/images/dish20.jpg');


CREATE TABLE dish_images (
    dish_id INT REFERENCES dishes(dish_id) ON DELETE CASCADE,
    image_id INT REFERENCES images(image_id) ON DELETE CASCADE,
    PRIMARY KEY (dish_id, image_id)
);

INSERT INTO dish_images (dish_id, image_id) VALUES
(1, 1), (1, 2),
(2, 3), (2, 4),
(3, 5), (3, 6),
(4, 7), (4, 8),
(5, 9), (5, 10),
(6, 11), (6, 12),
(7, 13), (7, 14),
(8, 15), (8, 16),
(9, 17), (9, 18),
(10, 19), (10, 20);



CREATE TABLE PaymentTransactions (
    transaction_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('QRCode', 'CreditCard', 'DebitCard', 'BankTransfer', 'MobilePayment', 'CashOnDelivery')),
    transaction_status VARCHAR(20) NOT NULL CHECK (transaction_status IN ('Pending', 'Completed', 'Failed', 'Refunded')),
    transaction_code VARCHAR(100) UNIQUE, -- Mã giao dịch từ cổng thanh toán (nếu có)
    payment_gateway VARCHAR(100), -- Tên cổng thanh toán (VD: Momo, ZaloPay, VietQR)
    qr_code_url TEXT, -- URL hoặc dữ liệu mã QR (nếu cần lưu)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

ALTER TABLE payment_transactions 
DROP CONSTRAINT fk_order;

ALTER TABLE payment_transactions 
ADD CONSTRAINT fk_order 
FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE;

SELECT pt.*
FROM payment_transactions pt
LEFT JOIN orders o ON pt.order_id = o.order_id
WHERE o.order_id IS NULL;

select * from orders
DELETE FROM dishes;
