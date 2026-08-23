"""完整的系统测试"""
import requests
import time
import base64
from PIL import Image, ImageDraw, ImageFont
import io

API_URL = 'http://localhost:5000'

print("=" * 70)
print("社交媒体图文一致性检测系统 - 完整测试")
print("=" * 70)

# 等待服务器启动
print("\n等待服务器启动...")
time.sleep(3)

# 测试1: 健康检查
print("\n[测试 1] 健康检查")
try:
    r = requests.get(f'{API_URL}/api/health', timeout=5)
    if r.status_code == 200:
        print(f"  ✓ 健康检查通过: {r.json()}")
    else:
        print(f"  ✗ 健康检查失败: {r.status_code}")
except Exception as e:
    print(f"  ✗ 连接失败: {e}")
    print("  请确保后端服务器正在运行 (python app_simple.py)")
    exit(1)

# 创建测试图像
def create_test_image(text, size=(224, 224)):
    """创建包含文字的测试图像"""
    img = Image.new('RGB', size, color=(255, 255, 255))
    draw = ImageDraw.Draw(img)
    # 使用默认字体
    draw.text((10, 100), text, fill=(0, 0, 0))
    
    # 转换为 base64
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_base64 = base64.b64encode(buffered.getvalue()).decode()
    return img_base64

# 测试2: 一致的图文检测
print("\n[测试 2] 一致的图文检测")
try:
    test_text = "Hello World"
    img_base64 = create_test_image(test_text)
    
    r = requests.post(f'{API_URL}/api/detect', json={
        'image': img_base64,
        'text': test_text
    }, timeout=30)
    
    if r.status_code == 200:
        data = r.json()
        print(f"  ✓ 检测成功")
        print(f"    预测: {data['prediction']}")
        print(f"    一致度: {data['consistency_score']:.4f}")
        print(f"    置信度: {data['confidence']:.4f}")
        print(f"    模型: {data['model_info']}")
    else:
        print(f"  ✗ 检测失败: {r.status_code} - {r.text}")
except Exception as e:
    print(f"  ✗ 错误: {e}")

# 测试3: 不一致的图文检测
print("\n[测试 3] 不一致的图文检测")
try:
    img_text = "Apple"
    test_text = "Banana"
    img_base64 = create_test_image(img_text)
    
    r = requests.post(f'{API_URL}/api/detect', json={
        'image': img_base64,
        'text': test_text
    }, timeout=30)
    
    if r.status_code == 200:
        data = r.json()
        print(f"  ✓ 检测成功")
        print(f"    预测: {data['prediction']}")
        print(f"    一致度: {data['consistency_score']:.4f}")
        print(f"    置信度: {data['confidence']:.4f}")
    else:
        print(f"  ✗ 检测失败: {r.status_code}")
except Exception as e:
    print(f"  ✗ 错误: {e}")

# 测试4: 检测历史
print("\n[测试 4] 检测历史")
try:
    r = requests.get(f'{API_URL}/api/detection-history', timeout=5)
    if r.status_code == 200:
        data = r.json()
        print(f"  ✓ 历史记录获取成功")
        print(f"    总记录数: {data['total']}")
        if data['history']:
            print(f"    最新记录: {data['history'][-1]}")
    else:
        print(f"  ✗ 获取失败: {r.status_code}")
except Exception as e:
    print(f"  ✗ 错误: {e}")

# 测试5: 统计信息
print("\n[测试 5] 统计信息")
try:
    r = requests.get(f'{API_URL}/api/statistics', timeout=5)
    if r.status_code == 200:
        data = r.json()
        print(f"  ✓ 统计信息获取成功")
        print(f"    总检测数: {data['total']}")
        print(f"    一致: {data['consistent']}")
        print(f"    不一致: {data['inconsistent']}")
    else:
        print(f"  ✗ 获取失败: {r.status_code}")
except Exception as e:
    print(f"  ✗ 错误: {e}")

print("\n" + "=" * 70)
print("测试完成")
print("=" * 70)
print("\n提示:")
print("  1. 打开浏览器访问: http://localhost:5000")
print("  2. 注册账户并登录")
print("  3. 上传图像和文本进行检测")
print("  4. 查看检测历史和统计分析")
print("=" * 70)

