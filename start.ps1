# start.ps1

# Detener la ejecución si hay algún error
$ErrorActionPreference = "Stop"

try {
    # Construir y levantar los contenedores
    docker compose build --pull
    if ($LASTEXITCODE -ne 0) {
        throw "Error durante docker compose build"
    }

    docker compose up --remove-orphans
    if ($LASTEXITCODE -ne 0) {
        throw "Error durante docker compose up"
    }
}
catch {
    Write-Error "Error durante la ejecución: $_"
    exit 1
}