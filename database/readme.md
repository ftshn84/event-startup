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
        int user_id FK
        int item_id FK
        boolian isPaid "default: false"
        datetime created_at
        datetime updated_at
    }
    ORDER_ITEMS {
        int id PK
        int event_id FK
        int quantity
    }

    USERS ||--o{ ORDERS : places
    EVENTS ||--o{ ORDER_ITEMS : included_in
    ORDER_ITEMS ||--o{ ORDERS : included_in
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