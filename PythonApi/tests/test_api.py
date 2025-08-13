import pytest
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))
 
from fastapi.testclient import TestClient
from main import app
from database import db
 
 
@pytest.fixture(autouse=True)
def reset_database():
    """Reset the database before each test"""
    db._products.clear()
    db._next_id = 1
    yield
    db._products.clear()
    db._next_id = 1
 
 
class TestProductAPI:
    """Integration tests for the Product API endpoints"""
    def setup_method(self):
        """Create a test client for each test"""
        self.client = TestClient(app)
    def test_get_empty_products(self):
        """Test getting products when database is empty"""
        response = self.client.get("/api/products")
        assert response.status_code == 200
        assert response.json() == []
    def test_create_product(self):
        """Test creating a new product"""
        payload = {
            "name": "Laptop",
            "sku": "LAP123",
            "price": 1200.0,
            "stock": 10,
            "category": "Electronics"
        }
        response = self.client.post("/api/products", json=payload)
        assert response.status_code == 200
        assert response.json() == 1  # ID
        # Verify it was created
        products = self.client.get("/api/products").json()
        assert len(products) == 1
        assert products[0]["name"] == "Laptop"
        assert products[0]["sku"] == "LAP123"
        assert products[0]["price"] == 1200.0
        assert products[0]["stock"] == 10
        assert products[0]["category"] == "Electronics"
    def test_update_product(self):
        """Test updating an existing product"""
        create_response = self.client.post(
            "/api/products",
            json={"name": "Old Laptop", "sku": "OLAP", "price": 1000.0, "stock": 5, "category": "Electronics"}
        )
        product_id = create_response.json()
        update_response = self.client.put(
            f"/api/products/{product_id}",
            json={"name": "New Laptop", "sku": "NLAP", "price": 900.0, "stock": 8, "category": "Electronics"}
        )
        assert update_response.status_code == 200
        # Verify the update
        products = self.client.get("/api/products").json()
        assert products[0]["name"] == "New Laptop"
        assert products[0]["price"] == 900.0
        assert products[0]["stock"] == 8
    def test_update_nonexistent_product(self):
        """Test updating a product that doesn't exist"""
        response = self.client.put(
            "/api/products/999",
            json={"name": "Updated", "sku": "UPD", "price": 100.0, "stock": 1, "category": "Misc"}
        )
        assert response.status_code == 404
        assert response.json()["detail"] == "Product not found"
    def test_delete_product(self):
        """Test deleting an existing product"""
        id1 = self.client.post("/api/products", json={
            "name": "P1", "sku": "P1SKU", "price": 10.0, "stock": 2, "category": "Test"
        }).json()
        id2 = self.client.post("/api/products", json={
            "name": "P2", "sku": "P2SKU", "price": 20.0, "stock": 5, "category": "Test"
        }).json()
        delete_response = self.client.delete(f"/api/products/{id1}")
        assert delete_response.status_code == 200
        products = self.client.get("/api/products").json()
        assert len(products) == 1
        assert products[0]["id"] == id2
    def test_delete_nonexistent_product(self):
        """Test deleting a product that doesn't exist"""
        response = self.client.delete("/api/products/999")
        assert response.status_code == 404
        assert response.json()["detail"] == "Product not found"