# 📱 Social Media Multimodal Consistency | 社交媒体图文一致性检测系统

> **Deep learning platform for detecting image-text consistency in social media posts. VGG image features + LSTM text features + CLIP zero-shot + ensemble learning. Web interface with real-time detection.**
>
> 基于深度学习的社交媒体图文一致性检测平台。VGG 图像特征 + LSTM 文本特征 + CLIP 零样本 + 集成学习。带实时检测的 Web 界面。

---

## 🌟 Features | 核心特性

- **Multimodal Fusion** — VGG (image) + LSTM (text) feature extraction
- **CLIP Zero-Shot** — OpenAI CLIP for zero-shot consistency detection
- **Ensemble Learning** — Combine multiple models for robust prediction
- **Web Interface** — HTML + JS frontend for real-time detection
- **Database** — SQLite for storing detection results
- **Comprehensive Tests** — Multiple test scripts for validation
- **Batch Processing** — Process multiple social media posts at once

---

## 📁 Project Structure | 项目结构

```
Social-Media-Multimodal-Consistency/
├── src/
│   ├── app_simple.py           # Main application (simplified)
│   └── download_dataset.py     # Dataset download utility
├── web/
│   ├── index.html               # Web interface
│   └── app.js                   # Frontend JavaScript
├── tests/
│   ├── test_clip.py             # CLIP model test
│   ├── test_clip_accuracy.py    # CLIP accuracy test
│   ├── test_ensemble.py         # Ensemble model test
│   ├── test_improved_system.py  # Improved system test
│   └── test_system_complete.py   # Complete system test
├── docs/                         # Documentation (15 files)
├── data/
│   └── consistency_detector.db   # SQLite database
├── scripts/
│   ├── start.bat                 # Windows start script
│   └── start.ps1                 # PowerShell start script
├── requirements.txt
├── PROJECT_STRUCTURE.md
├── 精品博客.md
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start | 快速开始

```bash
pip install -r requirements.txt

# Start the web application
python src/app_simple.py
# or: scripts/start.bat (Windows)
# or: scripts/start.ps1 (PowerShell)

# Open web interface
# http://localhost:5000

# Run tests
python tests/test_clip.py
python tests/test_ensemble.py
python tests/test_system_complete.py
```

---

## 🔬 Architecture | 架构

### Model Ensemble | 模型集成

1. **VGG + LSTM Pipeline**
   - VGG-16 extracts image features (4096-dim)
   - LSTM processes text sequence
   - Concatenated features → MLP classifier

2. **CLIP Zero-Shot**
   - OpenAI CLIP ViT-B/32
   - Compute image-text similarity directly
   - No training required for zero-shot detection

3. **Ensemble Fusion**
   - Weighted average of model predictions
   - Confidence-based dynamic weighting
   - Final consistency score (0-1)

### Consistency Levels | 一致性等级

| Score | Level | Description |
|-------|-------|-------------|
| 0.0-0.3 | 🔴 Inconsistent | Image and text mismatch |
| 0.3-0.7 | 🟡 Moderate | Partial consistency |
| 0.7-1.0 | 🟢 Consistent | Image and text match well |

---

## 📊 Applications | 应用场景

- **Fake News Detection** — Identify mismatched image-text pairs in news
- **Content Moderation** — Detect misleading social media posts
- **Advertising Quality** — Ensure ad images match ad copy
- **E-commerce** — Verify product images match descriptions
- **Social Media Analytics** — Analyze content consistency trends

---

## 📚 References | 参考文献

1. **Radford, A., et al.** (2021). *Learning transferable visual models from natural language supervision.* ICML. (CLIP)
2. **Simonyan, K., & Zisserman, A.** (2015). *Very deep convolutional networks for large-scale image recognition.* ICLR. (VGG)
3. **Hochreiter, S., & Schmidhuber, J.** (1997). *Long short-term memory.* Neural Computation. (LSTM)
4. **Nguyen, B. X., et al.** (2020). *Multimodal fusion for image-text matching: A survey.*

---

## 📄 License | 许可证

MIT License.

---

<div align="center">

**Built with 📱 for multimodal content analysis**

[GitHub](https://github.com/Windyhhh/Social-Media-Multimodal-Consistency)

</div>
