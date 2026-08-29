<div align="center">

# 社交媒体多模态一致性检测 | Social-Media-Multimodal-Consistency

### VGG + LSTM image-text consistency detection.

Single, batch, URL and real-time checking with a VGG16 + MobileNet ensemble for higher accuracy.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0-EE4C2C?logo=pytorch&logoColor=white)](https://pytorch.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2-FF6F00?logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)

</div>

---

**Social-Media-Multimodal-Consistency** detects image-text consistency in social-media content with a **VGG + LSTM** model, using a **VGG16 + MobileNet ensemble** to boost accuracy 15–20%. It supports single, batch, URL and real-time checking.

> [!NOTE]
> 中文项目：社交媒体图文一致性检测——VGG + LSTM，VGG16 + MobileNet 集成，支持单条/批量/URL/实时监测。

---

## Features

- **VGG + LSTM** — multimodal image-text consistency model.
- **Ensemble strategy** — VGG16 + MobileNet, +15–20% accuracy.
- **Efficient** — batch + real-time checking, +30% speed.
- **Flexible modes** — single / batch / URL / real-time monitoring.
- **Customizable** — tunable params & thresholds per scenario.

---

## Quickstart

```bash
git clone https://github.com/Windyhhh/Social-Media-Multimodal-Consistency.git
cd Social-Media-Multimodal-Consistency

pip install -r requirements.txt

python app.py               # run the Web detection UI
```

Docs (accuracy, quick start, reports) under `docs/`.

---

## Project Structure

```
Social-Media-Multimodal-Consistency/
├── app.py                   # Web entry
├── src/                     # VGG+LSTM model, detection
├── data/consistency_detector.db
├── docs/                    # reports & quick start
└── PROJECT_STRUCTURE.md
```

---

## License

MIT — free to use, modify and distribute.
