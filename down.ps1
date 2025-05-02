# down.ps1
$ErrorActionPreference = "Stop"

try {
    docker compose down --volumes --remove-orphans
    if ($LASTEXITCODE -ne 0) {
        throw "Error durante docker compose down"
    }
    Write-Host "Contenedores y volúmenes eliminados correctamente" -ForegroundColor Green
}
catch {
    Write-Error "Error durante la ejecución: $_"
    exit 1
}