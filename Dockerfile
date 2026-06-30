# Step 1: Build the application using Maven & Java 21
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy dependency definition and source code
COPY pom.xml .
COPY src ./src

# Compile and package the application (skipping tests for faster build)
RUN mvn clean package -DskipTests

# Step 2: Run the application using a lightweight JRE image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the generated JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose backend port
EXPOSE 8080

# Start command
ENTRYPOINT ["java", "-jar", "app.jar"]
