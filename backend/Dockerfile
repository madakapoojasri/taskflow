# ---------- Stage 1: build the jar ----------
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

# Copy the Maven wrapper and pom first, so dependency downloads are cached
COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -q dependency:go-offline

COPY src src
RUN ./mvnw -q clean package -DskipTests

# ---------- Stage 2: small runtime image ----------
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Keep memory use inside small free-tier containers
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=65", "-XX:+UseSerialGC", "-jar", "app.jar"]