## Entity Relationship Diagram (ERD)

```mermaid
erDiagram

    EVENTS {
        int id PK
        string title
        text description
        datetime date
        string venue
        decimal price
        int capacity
        datetime created_at
        datetime updated_at 
    }

    USERS {
        int id PK
        string name
        string email
        string password
        datetime created_at
        datetime updated_at    
    }

    ORDERS {
        int id PK
        int user_id FK
        int event_id FK
        boolian isPaid "default: false"
        int quantity
        datetime created_at
        datetime updated_at
    }

    USERS ||--o{ ORDERS : places
    EVENTS ||--o{ ORDERS : included_in
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


