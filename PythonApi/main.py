from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from models import Product, ProductCreate, ProductUpdate
from database import db

app = FastAPI(title="Product Inventory API", version="v1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

@app.get("/api/products", response_model=List[Product])
def list_products(): return db.list()

@app.get("/api/products/{id}", response_model=Product)
def get_product(id: int):
    p = db.get(id)
    if not p: raise HTTPException(404, "Product not found")
    return p

@app.post("/api/products", response_model=int)
def create_product(payload: ProductCreate):
    try: return db.create(payload)
    except ValueError as e: raise HTTPException(400, str(e))

@app.put("/api/products/{id}", response_model=Product)
def update_product(id: int, payload: ProductUpdate):
    try: return db.update(id, payload)
    except KeyError: raise HTTPException(404, "Product not found")
    except ValueError as e: raise HTTPException(400, str(e))

@app.delete("/api/products/{id}")
def delete_product(id: int):
    try: db.delete(id); return {"ok": True}
    except KeyError: raise HTTPException(404, "Product not found")
