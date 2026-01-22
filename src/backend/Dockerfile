# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["TrackShare.Api/TrackShare.Api.csproj", "TrackShare.Api/"]
RUN dotnet restore "TrackShare.Api/TrackShare.Api.csproj"

# Copy the rest of the code and build
COPY . .
WORKDIR "/src/TrackShare.Api"
RUN dotnet build "TrackShare.Api.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "TrackShare.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Copy published files
COPY --from=publish /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "TrackShare.Api.dll"]
