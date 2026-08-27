<div align="center">

# 💬 Social-Media-Multimodal-Consistency

### Multimodal image-text consistency detection.

VGG + LSTM + CLIP ensemble with a Web UI for real-time image-text consistency checking.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0-EE4C2C?logo=pytorch&logoColor=white)](https://pytorch.org/)
[![CLIP](https://img.shields.io/badge/CLIP-OpenAI-412991?logo=openai&logoColor=white)](https://openai.com/index/clip/)

</div>

---

**Social-Media-Multimodal-Consistency** detects image-text consistency on social media using a **VGG + LSTM + CLIP** ensemble, exposed through a Web interface for real-time detection.

> [!NOTE]
> 中文项目：社交媒体图文一致性检测——VGG + LSTM + CLIP 集成，Web 界面，实时检测。

---

## Quickstart

```bash
git clone https://github.com/Windyhhh/Social-Media-Multimodal-Consistency.git
cd Social-Media-Multimodal-Consistency

pip install -r requirements.txt

# run the Web detection UI
python app.py
```

Docs (accuracy fixes, quick start, final report) are under `docs/`.

---

## Features

- **VGG + LSTM + CLIP** — multimodal ensemble.
- **Web UI** — real-time detection interface.
- **Consistency scoring** — image-text alignment.

---

## Project Structure

```
Social-Media-Multimodal-Consistency/
├── app.py                   # Web entry
├── data/consistency_detector.db
├── docs/                    # quick start, accuracy, reports
└── PROJECT_STRUCTURE.md
```

---

## License

MIT — free to use, modify and distribute.
