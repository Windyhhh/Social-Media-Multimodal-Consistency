# 社交媒体图文一致性检测系统 - PowerShell启动脚本

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  社交媒体图文一致性检测系统" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# 检查Python是否安装
try {
    $pythonVersion = python --version 2>&1
    Write-Host "[✓] Python已安装: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "[✗] 错误: 未找到Python，请先安装Python 3.8+" -ForegroundColor Red
    Read-Host "按Enter键退出"
    exit 1
}

# 检查依赖
Write-Host "[1/3] 检查依赖..." -ForegroundColor Yellow
$flaskInstalled = pip list | Select-String "Flask"
if (-not $flaskInstalled) {
    Write-Host "[2/3] 安装依赖..." -ForegroundColor Yellow
    pip install -r requirements.txt
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[✗] 错误: 依赖安装失败" -ForegroundColor Red
        Read-Host "按Enter键退出"
        exit 1
    }
} else {
    Write-Host "[2/3] 依赖已安装" -ForegroundColor Green
}

Write-Host "[3/3] 启动系统..." -ForegroundColor Yellow
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  系统启动中..." -ForegroundColor Cyan
Write-Host "  访问地址: http://localhost:5000" -ForegroundColor Cyan
Write-Host "  按 Ctrl+C 停止服务" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

python app_simple.py

Read-Host "按Enter键退出"

