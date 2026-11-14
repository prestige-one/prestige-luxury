$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$driveLetter = 90..71 | ForEach-Object { [string][char]$_ } | Where-Object { -not (Test-Path ($_.ToString() + ':\')) } | Select-Object -First 1
if (-not $driveLetter) { throw 'No free drive letter is available for the local development server.' }
$mappedDrive = $driveLetter + ':'
$previousNodeOptions = $env:NODE_OPTIONS
$previousLocation = Get-Location
try {
    subst.exe $mappedDrive $projectRoot
    if ($LASTEXITCODE -ne 0) { throw 'Unable to create the development drive alias.' }
    Set-Location ($mappedDrive + '\web')
    $env:NODE_OPTIONS = ($previousNodeOptions + ' --preserve-symlinks --preserve-symlinks-main').Trim()
    node ($mappedDrive + '\web\node_modules\next\dist\bin\next') dev ($mappedDrive + '\web') --webpack
} finally {
    Set-Location $previousLocation
    $env:NODE_OPTIONS = $previousNodeOptions
    subst.exe $mappedDrive /D
}
