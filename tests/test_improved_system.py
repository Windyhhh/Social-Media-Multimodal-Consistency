#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
改进系统的完整测试脚本
测试：
1. 检测历史 API
2. 统计分析 API
3. 改进的集成模型
4. 高精度文本特征提取
"""

import requests
import json
import time
import base64
from PIL import Image
import io

API_URL = 'http://localhost:5000'

def create_test_image():
    """创建测试图像"""
    img = Image.new('RGB', (224, 224), color='red')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    return base64.b64encode(img_byte_arr.getvalue()).decode()

def test_health():
    """测试健康检查"""
    print("\n" + "="*70)
    print("1. 健康检查")
    print("="*70)
    try:
        r = requests.get(f'{API_URL}/api/health')
        print(f"✓ 状态: {r.status_code}")
        return r.status_code == 200
    except Exception as e:
        print(f"✗ 错误: {e}")
        return False

def test_single_detection():
    """测试单个检测"""
    print("\n" + "="*70)
    print("2. 单个检测 (改进的集成模型)")
    print("="*70)
    try:
        img_base64 = create_test_image()
        payload = {
            'image': img_base64,
            'text': '这是一个测试文本，用于验证图文一致性检测系统的功能'
        }
        r = requests.post(f'{API_URL}/api/detect', json=payload)
        print(f"✓ 状态: {r.status_code}")
        data = r.json()
        print(f"  预测: {data.get('prediction')}")
        print(f"  集成分数: {data.get('consistency_score')}")
        print(f"  VGG分数: {data.get('vgg_score')}")
        print(f"  Mobile分数: {data.get('mobile_score')}")
        print(f"  模型一致性: {data.get('model_agreement')}")
        print(f"  置信度: {data.get('confidence')}")
        return r.status_code == 200
    except Exception as e:
        print(f"✗ 错误: {e}")
        return False

def test_detection_history():
    """测试检测历史 API"""
    print("\n" + "="*70)
    print("3. 检测历史 API")
    print("="*70)
    try:
        r = requests.get(f'{API_URL}/api/detection-history')
        print(f"✓ 状态: {r.status_code}")
        data = r.json()
        print(f"  总记录数: {data.get('total')}")
        if data.get('history'):
            print(f"  最新记录: {data['history'][-1]}")
        return r.status_code == 200
    except Exception as e:
        print(f"✗ 错误: {e}")
        return False

def test_statistics():
    """测试统计分析 API"""
    print("\n" + "="*70)
    print("4. 统计分析 API")
    print("="*70)
    try:
        r = requests.get(f'{API_URL}/api/statistics')
        print(f"✓ 状态: {r.status_code}")
        data = r.json()
        print(f"  总检测数: {data.get('total')}")
        print(f"  一致数: {data.get('consistent')}")
        print(f"  不一致数: {data.get('inconsistent')}")
        print(f"  平均分数: {data.get('average_score')}")
        print(f"  一致率: {data.get('consistency_rate')}")
        return r.status_code == 200
    except Exception as e:
        print(f"✗ 错误: {e}")
        return False

def test_batch_detection():
    """测试批量检测"""
    print("\n" + "="*70)
    print("5. 批量检测 (改进的集成模型)")
    print("="*70)
    try:
        img_base64 = create_test_image()
        payload = {
            'items': [
                {'id': '1', 'image': img_base64, 'text': '测试文本1'},
                {'id': '2', 'image': img_base64, 'text': '测试文本2'},
            ]
        }
        r = requests.post(f'{API_URL}/api/batch-detect', json=payload)
        print(f"✓ 状态: {r.status_code}")
        data = r.json()
        print(f"  处理项数: {len(data.get('results', []))}")
        for result in data.get('results', []):
            print(f"    项 {result.get('id')}: {result.get('prediction')} (置信度: {result.get('confidence')})")
        return r.status_code == 200
    except Exception as e:
        print(f"✗ 错误: {e}")
        return False

def test_clear_history():
    """测试清空历史"""
    print("\n" + "="*70)
    print("6. 清空检测历史")
    print("="*70)
    try:
        r = requests.delete(f'{API_URL}/api/detection-history')
        print(f"✓ 状态: {r.status_code}")
        print(f"  消息: {r.json().get('message')}")
        return r.status_code == 200
    except Exception as e:
        print(f"✗ 错误: {e}")
        return False

if __name__ == '__main__':
    print("\n" + "╔" + "="*68 + "╗")
    print("║" + " "*15 + "改进系统完整功能测试" + " "*30 + "║")
    print("╚" + "="*68 + "╝")
    
    time.sleep(2)
    
    results = []
    results.append(("健康检查", test_health()))
    results.append(("单个检测", test_single_detection()))
    results.append(("检测历史", test_detection_history()))
    results.append(("统计分析", test_statistics()))
    results.append(("批量检测", test_batch_detection()))
    results.append(("清空历史", test_clear_history()))
    
    print("\n" + "="*70)
    print("测试总结")
    print("="*70)
    passed = sum(1 for _, result in results if result)
    total = len(results)
    for name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status}: {name}")
    
    print(f"\n总计: {passed}/{total} 通过")
    print("="*70)

