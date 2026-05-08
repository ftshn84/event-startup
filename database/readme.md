## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    EVENTS {
        int id PK
        decimal price
        string currency
        string title
        text description
        timestamptz created_at
        timestamptz updated_at
    }
     USERS {
        int id PK
        string full_name
        string email
        timestamptz created_at
        timestamptz updated_at
    }
```

## SQL Queries

### Events

Get all events:

```sql
SELECT id, price, currency, title, description, created_at, updated_at
FROM events
ORDER BY id ASC;
```

Get event by ID:

```sql
SELECT id, price, currency, title, description, created_at, updated_at
FROM events
WHERE id = 1;
```

### Users

Get all users:

```sql
SELECT id, full_name, email, created_at, updated_at
FROM users
ORDER BY id ASC;
```

Get user by ID:

```sql
SELECT id, full_name, email, created_at, updated_at
FROM users
WHERE id = 1;
```


