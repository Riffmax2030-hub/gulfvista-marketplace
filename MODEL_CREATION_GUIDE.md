# Model Creation Guide - Preventing Database Issues

This guide helps developers create new SQLAlchemy models without creating duplicate index errors.

## Quick Reference

### ✅ CORRECT Patterns

```python
# Pattern 1: Unique column (auto-creates index)
email = Column(String(255), unique=True, nullable=False)

# Pattern 2: Indexed column (regular index)
status = Column(String(50), index=True, nullable=False)

# Pattern 3: Composite index (multiple columns)
__table_args__ = (
    Index("ix_composite", "field1", "field2"),
)

# Pattern 4: Unique constraint + other indices
__table_args__ = (
    Index("ix_other_field", "other_field"),
    Index("ix_composite", "field1", "field2"),
)
```

### ❌ WRONG Patterns (DO NOT USE)

```python
# Wrong 1: Duplicate index on unique column
unique=True, index=True  # index=True is redundant!

# Wrong 2: Index at column + __table_args__
Column(..., index=True)  AND  Index("name", "field") in __table_args__

# Wrong 3: unique=True + Index() in __table_args__
unique=True  AND  Index("ix_name", "field") in __table_args__
```

---

## Detailed Decision Tree

When adding a new column, follow this decision tree:

```
Does the column need an index?
├─ NO → Just add the column without index=True
│
└─ YES → 
   ├─ Is it a UNIQUE field (like email, username)?
   │  ├─ YES → Use unique=True  (auto-creates unique index)
   │  │        DO NOT add index=True
   │  │        DO NOT add Index() in __table_args__
   │  │
   │  └─ NO → Is this a COMPOSITE index (multiple columns)?
   │     ├─ YES → Add Index() in __table_args__ with multiple columns
   │     │        DO NOT use column-level index=True
   │     │
   │     └─ NO → Single column, regular index
   │        └─ Use Column(..., index=True)
   │           DO NOT add Index() in __table_args__
```

---

## Template Models

### Template 1: Simple Model with Various Columns

```python
class ExampleModel(Base):
    """Example model template."""
    __tablename__ = "examples"
    __table_args__ = (
        # Only add composite or when index=True is NOT used on columns
        Index("ix_composite_field", "field1", "field2"),
    )
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Unique field - auto-creates index
    # NOTE: Do NOT add index=True or Index() definition
    email = Column(String(255), unique=True, nullable=False)
    
    # Regular indexed field
    # NOTE: Do NOT add Index() in __table_args__
    status = Column(String(50), index=True, nullable=False)
    
    # Non-indexed field
    description = Column(Text, nullable=True)
    
    # Foreign key - gets indexed automatically
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Timestamps - usually indexed
    created_at = Column(DateTime(timezone=True), 
                       default=datetime.now(UTC), nullable=False, index=True)
```

### Template 2: Model with Composite Indices

```python
class CompositeModel(Base):
    """Model with composite indices."""
    __tablename__ = "composites"
    __table_args__ = (
        # Composite index - multiple columns
        Index("ix_composite_user_status", "user_id", "status"),
        # Single column indices - use Index() here (NOT column-level)
        Index("ix_created_at", "created_at"),
    )
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), 
                       default=datetime.now(UTC), nullable=False)
```

### Template 3: Model with Unique & Regular Indices

```python
class MixedModel(Base):
    """Model with both unique and regular indices."""
    __tablename__ = "mixed"
    __table_args__ = (
        # Only need Index() for non-unique fields here
        Index("ix_category", "category"),
        Index("ix_updated_at", "updated_at"),
    )
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Unique field (do NOT add anything else)
    code = Column(String(50), unique=True, nullable=False)
    
    # Regular indexed field (do NOT add Index() in __table_args__)
    category = Column(String(50), index=True, nullable=False)
    
    # Non-indexed field
    name = Column(String(255), nullable=False)
    
    # Indexed timestamp
    updated_at = Column(DateTime(timezone=True), nullable=False, index=True)
```

---

## Index Types & When to Use Them

### 1. Unique Index (`unique=True`)
**Use when:** Field must be unique (email, username, code)
```python
email = Column(String(255), unique=True, nullable=False)
```
**Database Effect:** Creates UNIQUE INDEX automatically

---

### 2. Regular Index (`index=True`)
**Use when:** Field is frequently queried/filtered (status, category)
```python
status = Column(String(50), index=True, nullable=False)
```
**Database Effect:** Creates regular INDEX for faster lookups

---

### 3. Composite Index (`Index() in __table_args__`)
**Use when:** Often query multiple columns together
```python
__table_args__ = (
    Index("ix_user_status", "user_id", "status"),
)
```
**Database Effect:** Creates single INDEX on (user_id, status)

---

### 4. No Index (default)
**Use when:** Column is rarely used in WHERE clauses
```python
description = Column(Text, nullable=True)
```
**Database Effect:** No index created, saves space

---

## Common Pitfalls & How to Avoid Them

### Pitfall 1: Over-indexing
**Problem:** Adding index to every column
**Effect:** Slows down writes, wastes space
**Solution:** Only index columns used in WHERE clauses, JOINs, or ORDER BY

### Pitfall 2: Duplicate Indices
**Problem:** Defining same index multiple ways
```python
email = Column(String(255), unique=True, index=True)  # ❌ WRONG
Index("ix_email", "email")  # ❌ WRONG
```
**Effect:** Database initialization errors
**Solution:** Pick ONE method, use comments to document

### Pitfall 3: Forgetting Foreign Key Indices
**Problem:** Foreign keys not indexed
```python
user_id = Column(Integer, ForeignKey("users.id"))  # Missing index
```
**Effect:** Slow JOINs
**Solution:** Add index=True for frequently joined columns
```python
user_id = Column(Integer, ForeignKey("users.id"), index=True)
```

### Pitfall 4: Composite Without Documentation
**Problem:** Composite indices confuse future developers
**Solution:** Add comments explaining the index
```python
__table_args__ = (
    # Used for queries filtering by (user_id, status)
    Index("ix_user_status", "user_id", "status"),
)
```

---

## Verification Checklist

After adding a new model:

- [ ] Model file saved to `backend/models.py`
- [ ] Class inherits from `Base`
- [ ] `__tablename__` defined
- [ ] At least one `id` primary key
- [ ] All indices defined correctly (no duplicates)
- [ ] All comments added explaining index strategy
- [ ] Run: `python verify_database_tables.py`
- [ ] Run: `python test_backend_quick.py`
- [ ] Server logs show no "DuplicateTable" or "DuplicateIndex" errors
- [ ] API endpoints for new model work correctly

---

## Testing New Models

```bash
# 1. Verify database schema
python backend/verify_database_tables.py

# 2. Run quick tests
python backend/test_backend_quick.py

# 3. Check server logs
# Look for these messages:
# ✅ Database schema initialized. Found X tables
# ✅ Database initialized
# ✅ Backend fully initialized - All features active

# 4. Test API endpoints for your model
curl http://localhost:8000/api/v1/yourmodel
```

---

## Questions to Ask Yourself

Before adding indices:
1. Will this column be in a WHERE clause? → Add index
2. Will this column be in an ORDER BY? → Consider index
3. Will this column be in a JOIN? → Add index
4. Is this field UNIQUE? → Use `unique=True`
5. Are there composite queries? → Use composite Index()

---

## References

- SQLAlchemy Indexes: https://docs.sqlalchemy.org/en/20/core/indexes.html
- SQLAlchemy Constraints: https://docs.sqlalchemy.org/en/20/core/constraints.html
- PostgreSQL Indexes: https://www.postgresql.org/docs/current/sql-createindex.html
- Existing Models: `backend/models.py` (reference implementations)

---

## Help & Support

If you encounter index-related errors:

1. Check this guide's "Pitfalls" section
2. Review PERMANENT_DATABASE_FIX.md
3. Look for protective comments in models.py
4. Verify your model against Template models above
5. Run: `python COMPLETE_FIX.py` (if database is corrupted)

