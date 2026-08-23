#!/usr/bin/env python
# -*- coding: utf-8 -*-
import requests
import time
import json
import base64
from PIL import Image
import io

API_URL = 'http://localhost:5000'
time.sleep(3)

print('='*70)
print('Complete Feature Test')
print('='*70)

# 1. Health check
print('\n1. Health Check...')
try:
    r = requests.get(API_URL + '/api/health')
    print(f'   Status: {r.status_code}')
except Exception as e:
    print(f'   Error: {e}')

# 2. Model info
print('\n2. Model Information...')
try:
    r = requests.get(API_URL + '/api/model-info')
    data = r.json()
    print(f'   Model: {data.get("model_name")}')
    print(f'   Version: {data.get("version")}')
    print(f'   Ensemble: {data.get("ensemble_method")}')
    if 'models' in data:
        print(f'   Models: {len(data["models"])} models')
        for m in data['models']:
            print(f'      - {m["name"]}: {m["weight"]}')
except Exception as e:
    print(f'   Error: {e}')

# 3. Create test image
print('\n3. Create Test Image...')
try:
    img = Image.new('RGB', (224, 224), color='red')
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    img_base64 = base64.b64encode(img_bytes.getvalue()).decode()
    print(f'   Image created')
except Exception as e:
    print(f'   Error: {e}')

# 4. Single detection
print('\n4. Single Detection (Ensemble Model)...')
try:
    r = requests.post(API_URL + '/api/detect', json={
        'image': img_base64,
        'text': 'Test text'
    })
    data = r.json()
    print(f'   Status: {r.status_code}')
    print(f'   Prediction: {data.get("prediction")}')
    print(f'   Ensemble Score: {data.get("ensemble_score")}')
    print(f'   VGG Score: {data.get("vgg_score")}')
    print(f'   Mobile Score: {data.get("mobile_score")}')
    print(f'   Confidence: {data.get("confidence")}')
except Exception as e:
    print(f'   Error: {e}')

# 5. Statistics
print('\n5. Statistics...')
try:
    r = requests.get(API_URL + '/api/statistics')
    data = r.json()
    print(f'   Total: {data.get("total")}')
    print(f'   Consistent: {data.get("consistent")}')
    print(f'   Inconsistent: {data.get("inconsistent")}')
except Exception as e:
    print(f'   Error: {e}')

print('\n' + '='*70)
print('All tests completed')
print('='*70)

