# ----------- BUILD STAGE -----------
FROM maven:3.8.4-openjdk-17-slim AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests


# ----------- RUN STAGE -----------
FROM openjdk:17-ea-3-jdk-slim

WORKDIR /app

# Copy jar từ build stage
COPY --from=build /app/target/FinalProject-0.0.1-SNAPSHOT.jar app.jar

# Tạo thư mục output để lưu file Hoadon.docx / pdf
RUN mkdir -p /app/output

EXPOSE 8036

ENTRYPOINT ["java", "-jar", "app.jar"]
