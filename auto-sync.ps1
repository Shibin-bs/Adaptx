$ErrorActionPreference = "Continue"
$Repo = "C:\Adaptx"

Set-Location $Repo

Write-Host "ADAPT-X AUTO-SYNC STARTED" -ForegroundColor Cyan
Write-Host "Checking for changes every 30 seconds..."
Write-Host "Press Ctrl+C to stop."

while ($true) {
    try {
        $changes = git status --porcelain

        if ($changes) {
            Write-Host "Changes detected. Waiting for files to settle..." -ForegroundColor Yellow
            Start-Sleep -Seconds 10

            $changes = git status --porcelain

            if ($changes) {
                git add -A

                $staged = git diff --cached --quiet

                if ($LASTEXITCODE -ne 0) {
                    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

                    git commit -m "Auto-save: $timestamp"

                    if ($LASTEXITCODE -eq 0) {
                        git push

                        if ($LASTEXITCODE -eq 0) {
                            Write-Host "Successfully backed up to GitHub!" -ForegroundColor Green
                        }
                        else {
                            Write-Host "Push failed. Your commit is saved locally; check GitHub connection." -ForegroundColor Red
                        }
                    }
                }
            }
        }
    }
    catch {
        Write-Host "Auto-sync error: $_" -ForegroundColor Red
    }

    Start-Sleep -Seconds 30
}
