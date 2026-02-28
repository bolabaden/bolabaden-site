$ErrorActionPreference = 'Stop'

function Wait-ForHttp($url, $maxAttempts = 90) {
  for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
    try {
      $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 3
      if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 500) { return $true }
    } catch {}
    Start-Sleep -Seconds 1
  }
  return $false
}

function Assert-Contains($content, $needle, $label) {
  if ($content -notmatch [regex]::Escape($needle)) {
    throw "Assertion failed ($label): expected to find '$needle'"
  }
}

function Assert-NotContains($content, $needle, $label) {
  if ($content -match [regex]::Escape($needle)) {
    throw "Assertion failed ($label): expected NOT to find '$needle'"
  }
}

function Run-ContainerTest {
  param(
    [string]$Name,
    [int]$Port,
    [string[]]$RunArgs,
    [scriptblock]$Assertions
  )

  docker rm -f $Name 2>$null | Out-Null
  docker run -d --name $Name -p "${Port}:3000" @RunArgs bolabaden-site:guides-test | Out-Null

  try {
    if (-not (Wait-ForHttp "http://127.0.0.1:$Port/guides")) {
      docker logs $Name | Out-String | Write-Output
      throw "Container '$Name' did not become ready"
    }

    & $Assertions
    Write-Output "PASS: $Name"
  }
  finally {
    docker rm -f $Name 2>$null | Out-Null
  }
}

$baseTmp = Join-Path $PSScriptRoot ''
$customDir = Join-Path $baseTmp 'custom-guides'
$altDir = Join-Path $baseTmp 'alt-guides'
$emptyDir = Join-Path $baseTmp 'empty-guides'
New-Item -ItemType Directory -Force -Path $customDir, $altDir, $emptyDir | Out-Null

@'
---
description: Custom mounted guide for validation.
category: infrastructure
difficulty: beginner
estimatedTime: 10 minutes
prerequisites:
  - Docker
technologies:
  - Kubernetes
  - VS Code
---

# Mounted Guide

This guide verifies mounted markdown loading.
'@ | Set-Content -Path (Join-Path $customDir 'my-vs_code-k8s_api-guide.md') -Encoding UTF8

@'
---
description: Alternative custom path guide.
category: development
difficulty: advanced
estimatedTime: 20 minutes
prerequisites: [Node.js]
technologies: [TypeScript]
---

# Alt Guide

Testing GUIDES_DIR custom path.
'@ | Set-Content -Path (Join-Path $altDir 'alt_custom-guide.md') -Encoding UTF8

Run-ContainerTest -Name 'guides-fallback' -Port 3101 -RunArgs @() -Assertions {
  $index = (Invoke-WebRequest -Uri 'http://127.0.0.1:3101/guides' -UseBasicParsing).Content
  Assert-Contains $index '/guides/kubernetes-monitoring-stack' 'fallback index slug kubernetes'
  Assert-Contains $index '/guides/vs-code-ai-workflow-guide' 'fallback index slug vscode'

  $detail = (Invoke-WebRequest -Uri 'http://127.0.0.1:3101/guides/vs-code-ai-workflow-guide' -UseBasicParsing).Content
  Assert-Contains $detail 'VS Code AI Workflow Guide' 'fallback title normalization'
}

Run-ContainerTest -Name 'guides-missing-dir-fallback' -Port 3102 -RunArgs @('-e', 'GUIDES_DIR=/not/mounted/guides') -Assertions {
  $index = (Invoke-WebRequest -Uri 'http://127.0.0.1:3102/guides' -UseBasicParsing).Content
  Assert-Contains $index '/guides/kubernetes-monitoring-stack' 'missing dir fallback kubernetes'
  Assert-Contains $index '/guides/vs-code-ai-workflow-guide' 'missing dir fallback vscode'
}

$customHostPath = (Resolve-Path $customDir).Path
Run-ContainerTest -Name 'guides-mounted-custom' -Port 3103 -RunArgs @('-e', 'GUIDES_DIR=/app/guides', '-v', "${customHostPath}:/app/guides:ro") -Assertions {
  $index = (Invoke-WebRequest -Uri 'http://127.0.0.1:3103/guides' -UseBasicParsing).Content
  Assert-Contains $index '/guides/my-vs-code-k8s-api-guide' 'mounted custom slug'
  Assert-NotContains $index '/guides/kubernetes-monitoring-stack' 'mounted custom hides fallback kubernetes'

  $detail = (Invoke-WebRequest -Uri 'http://127.0.0.1:3103/guides/my-vs-code-k8s-api-guide' -UseBasicParsing).Content
  Assert-Contains $detail 'My VS Code K8s API Guide' 'mounted title normalization'
  Assert-Contains $detail 'Custom mounted guide for validation.' 'mounted frontmatter description'
}

$altHostPath = (Resolve-Path $altDir).Path
Run-ContainerTest -Name 'guides-alt-path' -Port 3104 -RunArgs @('-e', 'GUIDES_DIR=/external/guides', '-v', "${altHostPath}:/external/guides:ro") -Assertions {
  $index = (Invoke-WebRequest -Uri 'http://127.0.0.1:3104/guides' -UseBasicParsing).Content
  Assert-Contains $index '/guides/alt-custom-guide' 'alt path slug'
  Assert-NotContains $index '/guides/vs-code-ai-workflow-guide' 'alt path hides fallback'

  $detail = (Invoke-WebRequest -Uri 'http://127.0.0.1:3104/guides/alt-custom-guide' -UseBasicParsing).Content
  Assert-Contains $detail 'Alt Custom Guide' 'alt path title normalization'
}

$emptyHostPath = (Resolve-Path $emptyDir).Path
Run-ContainerTest -Name 'guides-empty-mounted' -Port 3105 -RunArgs @('-e', 'GUIDES_DIR=/app/guides', '-v', "${emptyHostPath}:/app/guides:ro") -Assertions {
  $index = (Invoke-WebRequest -Uri 'http://127.0.0.1:3105/guides' -UseBasicParsing).Content
  Assert-NotContains $index '/guides/kubernetes-monitoring-stack' 'empty mounted does not fallback kubernetes'
  Assert-NotContains $index '/guides/vs-code-ai-workflow-guide' 'empty mounted does not fallback vscode'
}

Write-Output 'ALL GUIDE RUNTIME TESTS PASSED'
