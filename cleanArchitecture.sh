#!/bin/bash

# Define root folder
ROOT_DIR="src"

# Define folder structure
FOLDERS=(
    "$ROOT_DIR/config"
    "$ROOT_DIR/core"
    "$ROOT_DIR/domain/models"
    "$ROOT_DIR/domain/interfaces"
    "$ROOT_DIR/domain/repositories"
    "$ROOT_DIR/application/useCases"
    "$ROOT_DIR/application/validators"
    "$ROOT_DIR/application/auth"
    "$ROOT_DIR/infrastructure/database"
    "$ROOT_DIR/infrastructure/email"
    "$ROOT_DIR/infrastructure/auth"
    "$ROOT_DIR/presentation/routes/v1"
    "$ROOT_DIR/presentation/routes/v2"
    "$ROOT_DIR/presentation/controllers"
    "$ROOT_DIR/presentation/middlewares"
)

# Define files
FILES=(
    "server.ts"
    "app.ts"
    ".env"
    "$ROOT_DIR/config/db.config.ts"
    "$ROOT_DIR/config/auth.config.ts"
    "$ROOT_DIR/config/mail.config.ts"
    "$ROOT_DIR/core/bcrypt.ts"
    "$ROOT_DIR/core/otp.ts"
    "$ROOT_DIR/core/googleAuth.ts"
    "$ROOT_DIR/core/validation.ts"
    "$ROOT_DIR/core/helpers.ts"
    "$ROOT_DIR/domain/models/User.ts"
    "$ROOT_DIR/domain/models/Admin.ts"
    "$ROOT_DIR/domain/models/SubAdmin.ts"
    "$ROOT_DIR/domain/models/Agent.ts"
    "$ROOT_DIR/domain/models/Developer.ts"
    "$ROOT_DIR/domain/interfaces/IUser.ts"
    "$ROOT_DIR/domain/interfaces/IAdmin.ts"
    "$ROOT_DIR/domain/interfaces/IAgent.ts"
    "$ROOT_DIR/domain/repositories/UserRepository.ts"
    "$ROOT_DIR/domain/repositories/AdminRepository.ts"
    "$ROOT_DIR/application/useCases/userService.ts"
    "$ROOT_DIR/application/useCases/adminService.ts"
    "$ROOT_DIR/application/useCases/agentService.ts"
    "$ROOT_DIR/application/validators/userValidator.ts"
    "$ROOT_DIR/application/validators/adminValidator.ts"
    "$ROOT_DIR/application/auth/authService.ts"
    "$ROOT_DIR/application/auth/otpService.ts"
    "$ROOT_DIR/application/auth/jwtService.ts"
    "$ROOT_DIR/infrastructure/database/index.ts"
    "$ROOT_DIR/infrastructure/email/emailService.ts"
    "$ROOT_DIR/infrastructure/email/emailTemplates.ts"
    "$ROOT_DIR/infrastructure/auth/jwt.ts"
    "$ROOT_DIR/infrastructure/auth/googleAuth.ts"
    "$ROOT_DIR/presentation/routes/v1/userRoutes.ts"
    "$ROOT_DIR/presentation/routes/v1/adminRoutes.ts"
    "$ROOT_DIR/presentation/routes/v1/authRoutes.ts"
    "$ROOT_DIR/presentation/routes/v2/userRoutes.ts"
    "$ROOT_DIR/presentation/routes/v2/adminRoutes.ts"
    "$ROOT_DIR/presentation/routes/v2/authRoutes.ts"
    "$ROOT_DIR/presentation/controllers/userController.ts"
    "$ROOT_DIR/presentation/controllers/adminController.ts"
    "$ROOT_DIR/presentation/controllers/authController.ts"
    "$ROOT_DIR/presentation/middlewares/authMiddleware.ts"
    "$ROOT_DIR/presentation/middlewares/errorHandler.ts"
)

# Create directories
echo "Creating folder structure..."
for folder in "${FOLDERS[@]}"; do
    mkdir -p "$folder"
done

# Create files
echo "Creating files..."
for file in "${FILES[@]}"; do
    touch "$file"
done

echo "Folder structure and files created successfully!"