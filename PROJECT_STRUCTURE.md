# 项目结构说明

## 目录结构

```
110902/
├── src/                    # 源代码目录
│   ├── app_simple.py      # 主应用程序
│   └── download_dataset.py # 数据集下载脚本
├── tests/                 # 测试脚本目录
│   ├── test_clip.py
│   ├── test_clip_accuracy.py
│   ├── test_ensemble.py
│   ├── test_improved_system.py
│   └── test_system_complete.py
├── scripts/               # 启动脚本目录
│   ├── start.bat          # Windows 启动脚本
│   └── start.ps1          # PowerShell 启动脚本
├── web/                   # Web 前端文件
│   ├── index.html         # 主页面
│   └── app.js             # JavaScript 应用
├── docs/                  # 项目文档
│   ├── README.md          # 项目说明
│   ├── QUICK_START.md     # 快速开始指南
│   ├── FINAL_REPORT.md    # 最终报告
│   └── ...                # 其他文档文件
├── data/                  # 数据文件
│   └── consistency_detector.db # 数据库文件
├── requirements.txt       # Python 依赖包列表
└── PROJECT_STRUCTURE.md   # 本文件
```

## 文件分类说明

### src/ 目录
- 包含项目的主要源代码
- `app_simple.py`: 主应用程序文件
- `download_dataset.py`: 数据集相关脚本

### tests/ 目录
- 包含所有测试脚本
- 按功能分类的测试文件
- 可独立运行的测试模块

### scripts/ 目录
- 包含项目启动和运行脚本
- `start.bat`: Windows 批处理启动脚本
- `start.ps1`: PowerShell 启动脚本

### web/ 目录
- 包含前端 Web 文件
- `index.html`: 主页面
- `app.js`: JavaScript 应用程序

### docs/ 目录
- 包含项目所有文档
- 包括 README、报告、说明文档等
- 按文档类型组织

### data/ 目录
- 包含项目数据文件
- 数据库文件、配置文件等

### 根目录文件
- `requirements.txt`: Python 项目依赖包列表
- `PROJECT_STRUCTURE.md`: 项目结构说明（本文件）

## 使用说明

1. **运行项目**: 使用 `scripts/start.bat` 或 `scripts/start.ps1` 启动
2. **开发代码**: 在 `src/` 目录中编辑主要代码
3. **运行测试**: 在 `tests/` 目录中运行相应测试脚本
4. **查看文档**: 在 `docs/` 目录中查看项目文档
5. **前端开发**: 在 `web/` 目录中编辑前端文件

## 优势

- **清晰的结构**: 文件按类型分组，易于管理和维护
- **职责分离**: 源代码、测试、文档、脚本各司其职
- **易于导航**: 新成员可以快速理解项目结构
- **标准化**: 遵循常见项目组织模式