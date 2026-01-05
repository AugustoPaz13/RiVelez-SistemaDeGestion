$headers = @{ "Content-Type" = "application/json" }
$body = @{
    username = "gerente_v4"
    password = "admin123"
    nombre = "Gerente Cuatro"
    role = "GERENTE"
} | ConvertTo-Json

Write-Host "Sending Body: $body"

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -Headers $headers -Body $body
    Write-Host "Success:"
    $response | ConvertTo-Json
} catch {
    Write-Host "Error Status: $($_.Exception.Response.StatusCode)"
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        if ($stream) {
            $reader = New-Object System.IO.StreamReader($stream)
            $respBody = $reader.ReadToEnd()
            Write-Host "Error Response Body: $respBody"
        }
    }
}
