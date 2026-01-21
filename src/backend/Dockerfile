# Build stage
FROM swift:6.0-noble AS build

WORKDIR /build

# Copy package files
COPY Package.swift ./

# Fetch dependencies
RUN swift package resolve

# Copy source files
COPY Sources ./Sources

# Build the application
RUN swift build -c release

# Runtime stage
FROM ubuntu:24.04

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    libssl3 \
    libcurl4 \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m -s /bin/bash trackshare

WORKDIR /app

# Copy the built binary from build stage
COPY --from=build /build/.build/release/App /app/

# Change ownership to non-root user
RUN chown -R trackshare:trackshare /app

# Switch to non-root user
USER trackshare

# Expose port
EXPOSE 8080

# Set environment variables
ENV HOSTNAME=0.0.0.0
ENV PORT=8080

# Run the application
ENTRYPOINT ["./App"]
CMD ["serve", "--env", "production", "--hostname", "0.0.0.0", "--port", "8080"]
