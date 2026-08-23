"""测试 CLIP 模型是否可用"""
import sys

print("=" * 70)
print("测试 CLIP 模型可用性")
print("=" * 70)

# 测试 transformers 库
try:
    from transformers import CLIPProcessor, CLIPModel
    print("✓ transformers 库已安装")
    clip_available = True
except ImportError as e:
    print(f"✗ transformers 库未安装: {e}")
    clip_available = False

# 测试 torch
try:
    import torch
    print(f"✓ PyTorch 已安装 (版本: {torch.__version__})")
except ImportError:
    print("✗ PyTorch 未安装")

# 测试 PIL
try:
    from PIL import Image
    print("✓ PIL 已安装")
except ImportError:
    print("✗ PIL 未安装")

if clip_available:
    print("\n正在尝试加载 CLIP 模型...")
    try:
        processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        print("✓ CLIP 模型加载成功！")
        print(f"  模型类型: {type(model)}")
        print(f"  处理器类型: {type(processor)}")
    except Exception as e:
        print(f"✗ CLIP 模型加载失败: {e}")
        print("\n建议安装:")
        print("  pip install transformers torch pillow")

print("\n" + "=" * 70)
print("测试完成")
print("=" * 70)

