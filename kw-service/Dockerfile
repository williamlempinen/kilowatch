# build
FROM maven:3.9.8-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml ./
RUN mvn -q -DskipTests

COPY src ./src
RUN mvn -q clean package -DskipTests

# app
FROM eclipse-temurin:21-jre

WORKDIR /kw-service

COPY --from=build /app/target/*.jar /kw-service/app.jar

EXPOSE 8888

ENTRYPOINT ["java", "-jar", "/kw-service/app.jar"]
