# 社交媒体图文一致性检测系统 - 专业版

基于VGG与LSTM的深度学习检测平台 | 功能完整 | 界面美观

## 🎯 功能特性

### 📊 基础功能
✅ **单个检测** - 上传图像和文本进行一致性检测
✅ **批量检测** - 通过CSV文件进行批量检测
✅ **URL检测** - 直接输入URL进行检测
✅ **实时监测** - 持续监测多个URL

### 💾 数据管理
✅ **检测历史** - 查看所有检测记录
✅ **统计分析** - 实时统计检测数据
✅ **数据导出** - 支持JSON/CSV/Excel格式导出
✅ **数据导入** - 导入历史数据

### 🤖 模型管理
✅ **模型信息** - 查看模型架构和参数
✅ **模型配置** - 配置模型参数
✅ **性能监控** - 实时监控模型性能
✅ **模型训练** - 支持模型微调训练

### ⚡ 高级功能
✅ **阈值设置** - 自定义检测阈值
✅ **过滤规则** - 设置文本长度过滤
✅ **告警设置** - 配置告警通知
✅ **API配置** - 管理API连接

### 📈 分析工具
✅ **数据可视化** - 图表展示检测结果
✅ **对比分析** - 多维度对比分析
✅ **报告生成** - 生成检测报告

### ⚙️ 系统设置
✅ **系统配置** - 配置系统参数
✅ **安全设置** - 管理安全选项
✅ **数据备份** - 备份和恢复数据
✅ **帮助文档** - 完整的使用指南

## 🚀 快速开始

### 方式一：最快体验（推荐）
直接在浏览器中打开 `index.html` 文件，即可使用离线模拟功能。

### 方式二：完整系统

#### 1. 安装依赖
```bash
conda activate
pip install -r requirements.txt
```

#### 2. 启动后端服务
```bash
python app_simple.py
```
后端服务将在 `http://localhost:5000` 启动

#### 3. 启动前端服务（可选）
```bash
python -m http.server 8000
```

#### 4. 打开浏览器
访问 `http://localhost:8000/index.html` 或直接打开 `index.html`

## 系统架构

### 后端 (Flask)
- 基于VGG-16的图像特征提取
- 基于LSTM的文本编码
- 多模态特征融合
- 二分类检测

### 前端 (HTML5 + CSS3 + JavaScript)
- 响应式设计
- 实时数据更新
- 离线模拟支持

## 🔌 API 端点

### 基础功能
| 方法 | 端点 | 功能 |
|------|------|------|
| GET | /api/health | 健康检查 |
| POST | /api/detect | 单个检测 |
| POST | /api/batch-detect | 批量检测 |

### 数据管理
| 方法 | 端点 | 功能 |
|------|------|------|
| GET | /api/history | 检测历史 |
| GET | /api/statistics | 统计信息 |
| POST | /api/export | 数据导出 |
| POST | /api/reset-stats | 重置统计 |

### 模型管理
| 方法 | 端点 | 功能 |
|------|------|------|
| GET | /api/model-info | 模型信息 |
| GET | /api/performance | 性能监控 |
| POST | /api/training | 模型训练 |

### 高级功能
| 方法 | 端点 | 功能 |
|------|------|------|
| POST | /api/threshold | 设置阈值 |
| POST | /api/filter-rules | 过滤规则 |
| POST | /api/alert-settings | 告警设置 |

### 分析工具
| 方法 | 端点 | 功能 |
|------|------|------|
| GET | /api/visualization | 数据可视化 |
| POST | /api/comparison | 对比分析 |
| POST | /api/report | 生成报告 |

### 系统设置
| 方法 | 端点 | 功能 |
|------|------|------|
| POST | /api/backup | 备份数据 |
| POST | /api/restore | 恢复数据 |
| POST | /api/system-config | 系统配置 |
| POST | /api/security-settings | 安全设置 |

## 使用示例

### 单个检测

```javascript
fetch('http://localhost:5000/api/detect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        image: 'base64_encoded_image',
        text: '文本内容'
    })
})
```

### 获取统计信息

```javascript
fetch('http://localhost:5000/api/statistics')
    .then(r => r.json())
    .then(data => console.log(data))
```

## 技术栈

- **后端**: Python 3.7+, Flask 2.3.0+, PyTorch 2.0.0+
- **前端**: HTML5, CSS3, JavaScript ES6+
- **深度学习**: VGG-16, LSTM, PyTorch

## 文件结构

```
.
├── index.html          # 前端页面
├── app_simple.py       # 后端服务
├── requirements.txt    # 依赖列表
├── start.bat          # Windows启动脚本
└── README.md          # 本文件
```

## 系统要求

- Python 3.7+
- 4GB+ RAM
- 支持CUDA的GPU (可选)

## 许可证

MIT License

## 版本信息

- **版本**: 1.0.0
- **发布日期**: 2025年11月13日
- **最后更新**: 2025年11月13日
- **状态**: ✅ 生产就绪

