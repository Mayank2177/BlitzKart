ecommerce-backend/
├── cmd/
│   └── api/
│       └── main.go              # Application entry point (Wire up deps, start server)
│
├── internal/                    # Private application code (not importable by other projects)
│   ├── config/
│   │   ├── config.go            # Load env vars, app settings
│   │   └── database.go          # GORM connection & initialization
│   │
│   ├── repositories/      # GORM Models (Database Schema)
│   │   ├── interfaces.go
│   │   ├── product.go
│   │   ├── order.go
│   │   ├── order_item.go
│   │   └── cart.go
│   │   
│   │  
│   ├── models/                  # GORM Models (Database Schema)
│   │   ├── user.go
│   │   ├── product.go
│   │   ├── order.go
│   │   ├── order_item.go
│   │   └── cart.go
│   │
│   ├── repositories/            # Data Access Layer (Direct DB interactions via GORM)
│   │   ├── user_repo.go
│   │   ├── product_repo.go
│   │   ├── order_repo.go
│   │   └── interfaces.go        # Define interfaces for repos (great for mocking in tests)
│   │
│   ├── services/                # Business Logic Layer (Validation, Transactions, Rules)
│   │   ├── auth_service.go      # Password hashing, JWT generation
│   │   ├── product_service.go   # Stock checks, pricing logic
│   │   ├── order_service.go     # Order creation, inventory deduction, payments
│   │   └── cart_service.go
│   │
│   ├── handlers/                # HTTP Layer (Gin Controllers)
│   │   ├── auth_handler.go      # Parse request -> Call Service -> Send Response
│   │   ├── product_handler.go
│   │   ├── order_handler.go
│   │   └── middleware/          # Gin-specific middleware
│   │       ├── auth.go          # JWT Verification
│   │       ├── cors.go          # CORS handling
│   │       └── logger.go        # Request logging
│   │
│   ├── dto/                     # Data Transfer Objects (Request/Response shapes)
│   │   ├── requests/
│   │   │   ├── auth_req.go      # Login/Register input structs
│   │   │   └── order_req.go
│   │   └── responses/
│   │       ├── common_resp.go   # Standard API response wrapper
│   │       └── product_resp.go
│   │
│   ├── utils/                   # Helper functions
│   │   ├── password.go          # Bcrypt wrappers
│   │   ├── token.go             # JWT helpers
│   │   └── validator.go         # Custom validation rules
│   │
│   └── routes/
│       └── router.go            # Define all API routes and bind handlers
│
├── pkg/                         # Public library code (optional, for shared utils across projects)
│   └── logger/
│       └── logger.go
│
├── migrations/                  # SQL migration files (if not using AutoMigrate)
│   ├── 001_create_users.up.sql
│   └── 001_create_users.down.sql
│
├── tests/                       # Integration & End-to-End tests
│   ├── handlers/
│   └── services/
│
├── .env                         # Environment variables (DB_URL, JWT_SECRET, PORT)
├── .gitignore
├── go.mod
├── go.sum
├── Dockerfile
├── docker-compose.yml           # Spin up Postgres, Redis, App locally
└── README.md