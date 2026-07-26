# Deploy von Supabase Edge Functions über die Management API.
#
# Hintergrund: `npx supabase functions deploy` scheitert auf diesem Rechner am
# Firmen-TLS (Avast-Interception; weder Deno-CLI noch curl vertrauen der Kette).
# PowerShell/.NET nutzt den Windows-Zertifikatsspeicher und kommt durch.
#
# Nutzung:
#   .\scripts\deploy-functions.ps1 -Token "sbp_..." -Functions evaluate-drill,frameworks-interviewer
#
# Token: https://supabase.com/dashboard/account/tokens (Personal Access Token,
# danach am besten widerrufen). verify_jwt bleibt true — so sind die Functions
# aktuell deployed (verifizierter Stand 2026-07-16), der Anon-Key ist ein JWT.

param(
    [Parameter(Mandatory = $true)][string]$Token,
    [string[]]$Functions = @("evaluate-drill", "frameworks-interviewer"),
    [string]$ProjectRef = "iorbjccohzkfcdtfhtyp"
)

$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$root = Split-Path -Parent $PSScriptRoot

foreach ($fn in $Functions) {
    $indexPath = Join-Path $root "supabase\functions\$fn\index.ts"
    if (-not (Test-Path $indexPath)) { throw "Function-Quelldatei fehlt: $indexPath" }

    $boundary = "----pumpkin" + [Guid]::NewGuid().ToString("N")
    $nl = "`r`n"
    $metadata = '{"entrypoint_path":"index.ts","name":"' + $fn + '","verify_jwt":true}'
    $fileBytes = [IO.File]::ReadAllBytes($indexPath)

    $pre = "--$boundary$nl" +
        "Content-Disposition: form-data; name=`"metadata`"$nl$nl" +
        "$metadata$nl" +
        "--$boundary$nl" +
        "Content-Disposition: form-data; name=`"file`"; filename=`"index.ts`"$nl" +
        "Content-Type: application/typescript$nl$nl"
    $post = "$nl--$boundary--$nl"

    $preBytes = [Text.Encoding]::UTF8.GetBytes($pre)
    $postBytes = [Text.Encoding]::UTF8.GetBytes($post)
    $body = New-Object byte[] ($preBytes.Length + $fileBytes.Length + $postBytes.Length)
    [Array]::Copy($preBytes, 0, $body, 0, $preBytes.Length)
    [Array]::Copy($fileBytes, 0, $body, $preBytes.Length, $fileBytes.Length)
    [Array]::Copy($postBytes, 0, $body, $preBytes.Length + $fileBytes.Length, $postBytes.Length)

    $uri = "https://api.supabase.com/v1/projects/$ProjectRef/functions/deploy?slug=$fn"
    try {
        $resp = Invoke-RestMethod -Uri $uri -Method Post `
            -Headers @{ Authorization = "Bearer $Token" } `
            -ContentType "multipart/form-data; boundary=$boundary" `
            -Body $body -TimeoutSec 120
        Write-Host ("OK: {0} deployed (id {1}, version {2})" -f $fn, $resp.id, $resp.version)
    }
    catch {
        $detail = ""
        if ($_.Exception.Response) {
            $reader = New-Object IO.StreamReader($_.Exception.Response.GetResponseStream())
            $detail = $reader.ReadToEnd()
        }
        throw "Deploy von '$fn' fehlgeschlagen: $($_.Exception.Message) $detail"
    }
}

Write-Host "Fertig. Smoke-Test siehe DEPLOY.md."
