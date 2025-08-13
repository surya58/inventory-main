from pydantic import BaseModel, Field
from typing import Optional

class ProductBase(BaseModel):
    name: str
    sku: str
    price: float = Field(gt=0)
    stock: int = Field(ge=0)
    category: str

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[float] = Field(default=None, gt=0)
    stock: Optional[int] = Field(default=None, ge=0)
    category: Optional[str] = None

class Product(ProductBase):
    id: int
