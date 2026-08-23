# 🚀 快速启动指南

## 系统要求

- Python 3.8+
- pip 包管理器
- 现代浏览器（Chrome、Firefox、Safari、Edge）

## 安装步骤

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 启动系统

```bash
python app_simple.py
```

你会看到类似的输出：
```
 * Running on http://127.0.0.1:5000
 * Press CTRL+C to quit
```

### 3. 打开浏览器

访问: **http://localhost:5000**

## 首次使用

### 创建账户

1. 页面加载后会显示登录界面
2. 点击"没有账户？注册"按钮
3. 填写用户名、邮箱和密码
4. 点击"注册"按钮

### 登录系统

1. 输入用户名和密码
2. 点击"登录"按钮
3. 登录成功后进入主系统

## 主要功能

### 📊 基础功能
- **单个检测**: 上传图像和文本进行一致性检测
- **批量检测**: 上传CSV文件进行批量检测
- **URL检测**: 通过URL检测图像和文本
- **实时监测**: 实时监测系统状态

### 💾 数据管理
- **检测历史**: 查看所有检测记录
- **统计分析**: 查看统计数据和趋势
- **数据导出**: 导出为HTML、Excel、CSV或JSON格式
- **数据导入**: 导入历史数据

### 🤖 模型管理
- **模型信息**: 查看模型详细信息
- **模型配置**: 配置模型参数
- **性能监控**: 监控系统性能指标
- **模型训练**: 训练新模型

### ⚡ 高级功能
- **阈值设置**: 调整检测阈值
- **过滤规则**: 设置数据过滤规则
- **告警设置**: 配置告警规则
- **API配置**: 配置API参数

### 📈 分析工具
- **数据可视化**: 可视化展示数据
- **对比分析**: 对比不同数据集
- **趋势分析**: 分析数据趋势
- **报告生成**: 生成分析报告

## 用户权限

### 普通用户
- ✅ 进行图文检测
- ✅ 查看检测历史
- ✅ 导出数据
- ✅ 查看统计信息
- ❌ 管理其他用户

### 管理员
- ✅ 所有普通用户权限
- ✅ 管理用户账户
- ✅ 修改用户角色
- ✅ 删除用户
- ✅ 查看系统日志

## 常见问题

### Q: 页面显示空白怎么办？
A: 
1. 确保后端服务正在运行
2. 清除浏览器缓存 (Ctrl+Shift+Delete)
3. 刷新页面 (Ctrl+F5)
4. 检查浏览器控制台是否有错误 (F12)

### Q: 登录失败怎么办？
A:
1. 确认用户名和密码正确
2. 检查是否已注册账户
3. 查看后端日志是否有错误

### Q: 如何导出数据？
A:
1. 进入"数据导出"页面
2. 选择导出格式（HTML、Excel、CSV、JSON）
3. 点击对应按钮下载

### Q: 如何修改用户角色？
A: （仅管理员）
1. 进入"用户管理"页面
2. 找到要修改的用户
3. 点击"修改角色"按钮
4. 选择新角色并保存

## 数据库

系统使用SQLite数据库，文件位置：
```
./consistency_detector.db
```

### 重置数据库

如果需要重置数据库：
1. 停止后端服务 (Ctrl+C)
2. 删除 `consistency_detector.db` 文件
3. 重启后端服务
4. 系统会自动创建新数据库

## 故障排除

### 后端无法启动
```bash
# 检查Python版本
python --version

# 检查依赖是否安装
pip list | grep -E "flask|torch|pillow"

# 重新安装依赖
pip install -r requirements.txt --force-reinstall
```

### 模型加载失败
```bash
# 检查CUDA是否可用
python -c "import torch; print(torch.cuda.is_available())"

# 检查PyTorch安装
pip install torch torchvision --force-reinstall
```

### 端口被占用
```bash
# 查找占用5000端口的进程
netstat -ano | findstr :5000

# 杀死进程（Windows）
taskkill /PID <PID> /F
```

## 文件说明

| 文件 | 说明 |
|------|------|
| `app_simple.py` | 后端Flask应用 |
| `app.js` | 前端JavaScript逻辑 |
| `index.html` | 前端HTML + CSS |
| `requirements.txt` | Python依赖列表 |
| `consistency_detector.db` | SQLite数据库 |
| `README.md` | 项目详细说明 |
| `SYSTEM_STATUS.md` | 系统状态报告 |
| `backup/` | 过时文件备份 |

## 获取帮助

- 查看 `README.md` 了解详细信息
- 查看 `SYSTEM_STATUS.md` 了解系统状态
- 检查后端日志输出
- 打开浏览器开发者工具 (F12) 查看错误

---

**祝您使用愉快！** 🎉

