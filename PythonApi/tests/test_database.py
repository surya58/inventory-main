def test_create_multiple_products(self):
    """Test creating multiple products with unique IDs and varied data"""
    product_data = [
        ProductCreate(name="Laptop", sku="LAP123", price=1200.0, stock=10, category="Electronics"),
        ProductCreate(name="Smartphone", sku="PHN456", price=800.0, stock=15, category="Electronics"),
        ProductCreate(name="Headphones", sku="HDP789", price=150.0, stock=50, category="Audio"),
        ProductCreate(name="Desk Chair", sku="CHR101", price=300.0, stock=5, category="Furniture"),
        ProductCreate(name="Coffee Maker", sku="COF202", price=99.99, stock=25, category="Kitchen"),
        ProductCreate(name="Running Shoes", sku="RUN303", price=120.0, stock=20, category="Sports"),
        ProductCreate(name="Backpack", sku="BKP404", price=60.0, stock=30, category="Accessories"),
    ]

    ids = []
    for product in product_data:
        ids.append(self.db.create_product(product))

    # IDs should be sequential starting from 1
    assert ids == list(range(1, len(product_data) + 1))

    # Verify all products are stored correctly
    stored_products = self.db.get_all_products()
    assert len(stored_products) == len(product_data)
    for created, stored in zip(product_data, stored_products):
        assert created.name == stored.name
        assert created.sku == stored.sku
        assert created.price == stored.price
        assert created.stock == stored.stock
        assert created.category == stored.category


def test_bulk_product_creation(self):
    """Test adding a large number of products at once"""
    for i in range(1, 51):
        self.db.create_product(ProductCreate(
            name=f"Product{i}",
            sku=f"SKU{i:03d}",
            price=float(i * 10),
            stock=i * 2,
            category="Bulk"
        ))

    products = self.db.get_all_products()
    assert len(products) == 50
    assert products[0].name == "Product1"
    assert products[-1].name == "Product50"
