## Entity Relationship Diagram With Mermaild (ERD)

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
        int user_id FK "nullable"
        decimal total_amount 
        boolian ispaid "default: false"
        datetime created_at
        datetime updated_at
    }
    ORDER_ITEMS {
        int id PK
        int order_id FK
        int event_id FK
        int quantity
        decimal price
    }

    USERS ||--o{ ORDERS : place
    EVENTS ||--o{ ORDER_ITEMS : included_in
    ORDERS ||--o{ ORDER_ITEMS : has
```

## SQL Queries

### Events

Get all events:

```sql
SELECT *
FROM events
ORDER BY id ASC;
```

Get event by ID:

```sql
SELECT *
FROM events
WHERE id = @id;
```

### Users

Get all users:

```sql
SELECT *
FROM users
ORDER BY id ASC;
```

Get user by ID:

```sql
SELECT *
FROM users
WHERE id = @id;
```

### Orders

Get all orders:

```sql
SELECT *
FROM orders
ORDER BY id ASC;
```

Get order by ID:

```sql
SELECT *
FROM orders
WHERE id = @id;
```

## Exported ERD diagram from PostgreSQL by pgAdmin4

![PostgreSQL ERD](./postgreSQL-erd-diagram.png)

See the [postgreSQL-erd-diagram.pgerd](postgreSQL-erd-diagram.pgerd) as the pgAdmin ERD source file.