
pipeline {
    agent { label 'windows-playwright' }

    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(
            numToKeepStr: '20',
            artifactNumToKeepStr: '10'
        ))
    }

    parameters {
        choice(
            name: 'MODE',
            choices: ['single', 'all'],
            description: 'Select test execution mode'
        )
        string(
            name: 'TICKET_ID',
            defaultValue: '3982',
            description: 'Ticket number for single mode'
        )
    }

    stages {
        stage('Run Playwright') {
            steps {
                powershell '''
                    $ErrorActionPreference = 'Stop'
                    $root = 'D:\\NewWeb UiTest'
                    Set-Location -LiteralPath $root

                    foreach ($folder in @('test-results', 'playwright-report')) {
                        if (Test-Path -LiteralPath $folder) {
                            Remove-Item -LiteralPath $folder -Recurse -Force
                        }
                    }

                    if ($env:MODE -eq 'single') {
                        $ticket = $env:TICKET_ID.Trim()

                        if ($ticket -notmatch '^[0-9]+$') {
                            throw 'Invalid ticket ID'
                        }

                        $found = @(
                            Get-ChildItem -LiteralPath (Join-Path $root 'TestCases') -Recurse -File |
                            Where-Object { $_.Name -eq "$ticket.spec.ts" }
                        )

                        if ($found.Count -ne 1) {
                            throw "Expected one test file for ticket $ticket; found $($found.Count)"
                        }

                        Write-Host "Running ticket $ticket"

                        $fileFilter = '[/\\\\]' + $ticket + '[.]spec[.]ts$'

                        & npx.cmd playwright test $fileFilter --config=playwright.ci.config.ts
                    }
                    elseif ($env:MODE -eq 'all') {
                        Write-Host 'Running full regression suite'

                        & npx.cmd playwright test --config=playwright.ci.config.ts
                    }
                    else {
                        throw 'Invalid execution mode'
                    }

                    exit $LASTEXITCODE
                '''
            }
        }
    }

    post {
        always {
            powershell '''
                $source = 'D:\\NewWeb UiTest'
                $target = Join-Path $env:WORKSPACE 'artifacts'

                if (Test-Path $target) {
                    Remove-Item -LiteralPath $target -Recurse -Force
                }

                New-Item -ItemType Directory -Path $target -Force | Out-Null

                foreach ($folder in @('test-results', 'playwright-report')) {
                    $from = Join-Path $source $folder

                    if (Test-Path $from) {
                        Copy-Item -LiteralPath $from -Destination $target -Recurse -Force
                    }
                }
            '''

            archiveArtifacts(
                artifacts: 'artifacts/**/*',
                allowEmptyArchive: true
            )

            junit(
                testResults: 'artifacts/test-results/junit.xml',
                allowEmptyResults: true
            )
        }
    }
}
