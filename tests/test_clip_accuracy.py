"""测试 CLIP 模型的准确性"""
import requests
import time
import base64
from PIL import Image, ImageDraw, ImageFont
import io

API_URL = 'http://localhost:5000'

print("=" * 70)
print("CLIP 模型准确性测试")
print("=" * 70)

# 等待服务器启动
print("\n等待服务器启动...")
time.sleep(2)

def create_test_image(text, size=(300, 200), bg_color=(255, 255, 255)):
    """创建包含文字的测试图像"""
    img = Image.new('RGB', size, color=bg_color)
    draw = ImageDraw.Draw(img)
    # 使用较大的字体
    try:
        font = ImageFont.truetype("arial.ttf", 40)
    except:
        font = ImageFont.load_default()
    
    # 在图像中心绘制文字
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (size[0] - text_width) // 2
    y = (size[1] - text_height) // 2
    draw.text((x, y), text, fill=(0, 0, 0), font=font)
    
    # 转换为 base64
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_base64 = base64.b64encode(buffered.getvalue()).decode()
    return img_base64

def test_detection(image_text, input_text, expected_result):
    """测试检测功能"""
    img_base64 = create_test_image(image_text)
    
    try:
        r = requests.post(f'{API_URL}/api/detect', json={
            'image': img_base64,
            'text': input_text
        }, timeout=30)
        
        if r.status_code == 200:
            data = r.json()
            prediction = data['prediction']
            score = data['consistency_score']
            confidence = data['confidence']
            model_info = data.get('model_info', '')
            
            # 判断是否符合预期
            is_correct = prediction == expected_result
            status = "✓" if is_correct else "✗"
            
            print(f"\n{status} 图像文字: '{image_text}' | 输入文字: '{input_text}'")
            print(f"  预测: {prediction} (期望: {expected_result})")
            print(f"  一致度: {score:.4f}")
            print(f"  置信度: {confidence:.4f}")
            print(f"  模型: {model_info}")
            
            return is_correct
        else:
            print(f"✗ 检测失败: {r.status_code}")
            return False
    except Exception as e:
        print(f"✗ 错误: {e}")
        return False

# 测试用例
print("\n" + "=" * 70)
print("开始测试")
print("=" * 70)

test_cases = [
    # (图像文字, 输入文字, 期望结果)
    ("Apple", "Apple", "consistent"),  # 完全一致
    ("Apple", "apple", "consistent"),  # 大小写不同但一致
    ("Apple", "Banana", "inconsistent"),  # 完全不一致
    ("Cat", "Dog", "inconsistent"),  # 不同的动物
    ("Hello World", "Hello World", "consistent"),  # 完全一致
    ("Hello World", "你好世界", "inconsistent"),  # 不同语言
    ("123", "456", "inconsistent"),  # 不同数字
    ("Car", "汽车", "uncertain"),  # 相同意思但不同语言
    ("Sun", "随便乱写的内容", "inconsistent"),  # 随机内容
    ("Test", "Test", "consistent"),  # 完全一致
]

correct_count = 0
total_count = len(test_cases)

for image_text, input_text, expected in test_cases:
    if test_detection(image_text, input_text, expected):
        correct_count += 1
    time.sleep(0.5)  # 避免请求过快

# 统计结果
print("\n" + "=" * 70)
print("测试结果统计")
print("=" * 70)
print(f"总测试数: {total_count}")
print(f"正确数: {correct_count}")
print(f"错误数: {total_count - correct_count}")
print(f"准确率: {correct_count / total_count * 100:.2f}%")
print("=" * 70)

if correct_count == total_count:
    print("\n🎉 所有测试通过！模型工作正常！")
elif correct_count >= total_count * 0.7:
    print("\n⚠️ 大部分测试通过，但仍有改进空间")
else:
    print("\n❌ 测试失败较多，需要检查模型配置")

