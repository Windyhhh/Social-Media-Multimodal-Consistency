@echo off
REM 社交媒体图文一致性检测系统 - 启动脚本

echo.
echo ============================================================
echo   社交媒体图文一致性检测系统
echo ============================================================
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未找到Python，请先安装Python 3.8+
    pause
    exit /b 1
)

echo [1/3] 检查依赖...
pip list | findstr flask >nul 2>&1
if errorlevel 1 (
    echo [2/3] 安装依赖...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo 错误: 依赖安装失败
        pause
        exit /b 1
    )
) else (
    echo [2/3] 依赖已安装
)

echo [3/3] 启动系统...
echo.
echo ============================================================
echo   系统启动中...
echo   访问地址: http://localhost:5000
echo   按 Ctrl+C 停止服务
echo ============================================================
echo.

python app_simple.py

pause

