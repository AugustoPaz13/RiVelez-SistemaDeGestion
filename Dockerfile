# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app
COPY app/package*.json ./
RUN npm install
COPY app/ ./
RUN npm run build

# Stage 2: Build Backend
FROM maven:3.9.6-eclipse-temurin-21 AS backend-build
WORKDIR /backend
COPY backend/pom.xml .
COPY backend/src ./src
# Copy frontend build to backend static resources
COPY --from=frontend-build /app/dist ./src/main/resources/static
RUN mvn clean package -DskipTests

# Stage 3: Run
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-build /backend/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
