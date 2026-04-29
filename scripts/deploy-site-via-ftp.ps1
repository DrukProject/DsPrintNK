param(
    [string]$ConfigPath = "deploy-ftp.local.json"
)

$ErrorActionPreference = "Stop"

function Join-RemotePath {
    param(
        [string]$Base,
        [string]$Child
    )

    $normalizedBase = ($Base -replace "\\", "/").Trim()
    $normalizedChild = ($Child -replace "\\", "/").Trim()

    if ([string]::IsNullOrWhiteSpace($normalizedBase)) {
        return "/" + $normalizedChild.TrimStart("/")
    }

    return ($normalizedBase.TrimEnd("/") + "/" + $normalizedChild.TrimStart("/"))
}

function New-FtpUri {
    param(
        [string]$Server,
        [int]$Port,
        [string]$RemotePath
    )

    $path = ($RemotePath -replace "\\", "/").TrimStart("/")
    if ($Port -gt 0) {
        return "ftp://{0}:{1}/{2}" -f $Server, $Port, $path
    }

    return "ftp://{0}/{1}" -f $Server, $path
}

function Invoke-FtpRequest {
    param(
        [string]$Method,
        [string]$Uri,
        [System.Net.NetworkCredential]$Credential,
        [bool]$UseSsl,
        [bool]$Passive,
        [byte[]]$Payload
    )

    $request = [System.Net.FtpWebRequest]::Create($Uri)
    $request.Method = $Method
    $request.Credentials = $Credential
    $request.EnableSsl = $UseSsl
    $request.UsePassive = $Passive
    $request.KeepAlive = $false
    $request.UseBinary = $true

    if ($null -ne $Payload) {
        $request.ContentLength = $Payload.Length
        $requestStream = $request.GetRequestStream()
        $requestStream.Write($Payload, 0, $Payload.Length)
        $requestStream.Close()
    }

    try {
        $response = $request.GetResponse()
        $response.Close()
        return $true
    } catch [System.Net.WebException] {
        throw $_
    }
}

function Ensure-FtpDirectory {
    param(
        [string]$Server,
        [int]$Port,
        [string]$RemoteDir,
        [System.Net.NetworkCredential]$Credential,
        [bool]$UseSsl,
        [bool]$Passive
    )

    $segments = ($RemoteDir -replace "\\", "/").Trim("/") -split "/"
    $current = ""

    foreach ($segment in $segments) {
        if ([string]::IsNullOrWhiteSpace($segment)) {
            continue
        }

        $current = Join-RemotePath -Base $current -Child $segment
        $uri = New-FtpUri -Server $Server -Port $Port -RemotePath $current

        try {
            Invoke-FtpRequest -Method ([System.Net.WebRequestMethods+Ftp]::MakeDirectory) -Uri $uri -Credential $Credential -UseSsl $UseSsl -Passive $Passive | Out-Null
        } catch [System.Net.WebException] {
            $response = $_.Exception.Response
            if ($response) {
                $statusCode = [int]$response.StatusCode
                $response.Close()
                if ($statusCode -in 550, 521) {
                    continue
                }
            }

            throw
        }
    }
}

function Publish-FtpFile {
    param(
        [string]$Server,
        [int]$Port,
        [string]$LocalPath,
        [string]$RemotePath,
        [System.Net.NetworkCredential]$Credential,
        [bool]$UseSsl,
        [bool]$Passive
    )

    $bytes = [System.IO.File]::ReadAllBytes($LocalPath)
    $uri = New-FtpUri -Server $Server -Port $Port -RemotePath $RemotePath
    Invoke-FtpRequest -Method ([System.Net.WebRequestMethods+Ftp]::UploadFile) -Uri $uri -Credential $Credential -UseSsl $UseSsl -Passive $Passive -Payload $bytes | Out-Null
    Write-Host "Uploaded: $RemotePath"
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$resolvedConfigPath = Join-Path $repoRoot $ConfigPath

if (-not (Test-Path $resolvedConfigPath)) {
    throw "Config file not found: $resolvedConfigPath. Copy deploy-ftp.local.example.json to deploy-ftp.local.json and fill in your FTP data."
}

$config = Get-Content $resolvedConfigPath -Raw | ConvertFrom-Json
$credential = New-Object System.Net.NetworkCredential($config.username, $config.password)

$distRoot = Join-Path $env:TEMP ("dsprint-dist-" + [guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $distRoot | Out-Null

$publicFiles = @(
    "index.html",
    "calculator.html",
    "materials.html",
    "order.html",
    "gallery.html",
    "price-lab.html",
    "terms.html",
    "privacy.html"
)

$publicDirs = @(
    "assets",
    "photos"
)

foreach ($file in $publicFiles) {
    Copy-Item (Join-Path $repoRoot $file) (Join-Path $distRoot $file) -Force
}

foreach ($dir in $publicDirs) {
    Copy-Item (Join-Path $repoRoot $dir) (Join-Path $distRoot $dir) -Recurse -Force
}

try {
    Ensure-FtpDirectory -Server $config.server -Port $config.port -RemoteDir $config.remoteDir -Credential $credential -UseSsl ([bool]$config.useSsl) -Passive ([bool]$config.passive)

    $relativePaths = Get-ChildItem -Path $distRoot -Recurse -File -Name
    foreach ($relativePath in $relativePaths) {
        $relativePath = $relativePath -replace "\\", "/"
        $localPath = Join-Path $distRoot ($relativePath -replace "/", "\")
        $remotePath = Join-RemotePath -Base $config.remoteDir -Child $relativePath
        $remoteDir = Split-Path $remotePath -Parent

        Ensure-FtpDirectory -Server $config.server -Port $config.port -RemoteDir $remoteDir -Credential $credential -UseSsl ([bool]$config.useSsl) -Passive ([bool]$config.passive)
        Publish-FtpFile -Server $config.server -Port $config.port -LocalPath $localPath -RemotePath $remotePath -Credential $credential -UseSsl ([bool]$config.useSsl) -Passive ([bool]$config.passive)
    }

    Write-Host ""
    Write-Host "FTP deploy completed."
    Write-Host ("Remote dir: " + $config.remoteDir)
} finally {
    if (Test-Path $distRoot) {
        Remove-Item $distRoot -Recurse -Force
    }
}
