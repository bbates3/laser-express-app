INSERT INTO customers (name, phone, streetaddress, city, state) VALUES ($1,$2,$3,$4,$5)
RETURNING customerId;