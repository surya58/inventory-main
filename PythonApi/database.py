from typing import Dict, List, Optional
from models import Product, ProductCreate, ProductUpdate


class InMemoryDB:
    def __init__(self):
        self._items: Dict[int, Product] = {}
        self._next = 1

    def _sku_unique(self, sku: str, ignore_id: Optional[int] = None):
        for p in self._items.values():
            if p.sku.lower() == sku.lower() and p.id != ignore_id:
                raise ValueError("SKU must be unique")

    def list(self) -> List[Product]:
        return list(self._items.values())

    def get(self, pid: int) -> Optional[Product]:
        return self._items.get(pid)

    def create(self, data: ProductCreate) -> int:
        self._sku_unique(data.sku)
        pid = self._next; self._next += 1
        self._items[pid] = Product(id=pid, **data.model_dump())
        return pid

    def update(self, pid: int, data: ProductUpdate) -> Product:
        cur = self._items.get(pid)
        if not cur: raise KeyError
        patch = data.model_dump(exclude_unset=True)
        if "sku" in patch: self._sku_unique(patch["sku"], ignore_id=pid)
        new = cur.model_dump(); new.update(patch)
        self._items[pid] = Product(**new)
        return self._items[pid]

    def delete(self, pid: int) -> None:
        if pid not in self._items: raise KeyError
        del self._items[pid]

db = InMemoryDB()
