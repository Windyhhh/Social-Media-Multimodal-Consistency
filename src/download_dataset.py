"""
下载并查看 Flickr30k 数据集的示例脚本

这个脚本会使用 Hugging Face 的 `datasets` 库下载并显示数据集的信息。
"""

from datasets import load_dataset

DATASET_NAME = "nlphuji/flickr30k"

def main():
    print(f"\n⏬ 正在下载和加载 {DATASET_NAME} 数据集...")
    print("(这可能需要一些时间，数据大小约 4.4 GB)")
    
    try:
        # 加载数据集，如果本地没有则会自动下载
        dataset = load_dataset(DATASET_NAME)
        print("\n✓ 数据集加载成功！")
        
        # 显示数据集结构
        print("\n" + "="*70)
        print("数据集结构:")
        print("="*70)
        print(dataset)
        
        # 显示训练集的一条样例
        print("\n" + "="*70)
        print("训练集样例:")
        print("="*70)
        sample = dataset['train'][0]
        print(f"  图片: {sample['image']}")
        print(f"  描述数量: {len(sample['caption'])}")
        print(f"  第一条描述: '{sample['caption'][0]}'")
        
        # 显示测试集的一条样例
        print("\n" + "="*70)
        print("测试集样例:")
        print("="*70)
        test_sample = dataset['test'][0]
        print(f"  图片: {test_sample['image']}")
        print(f"  描述数量: {len(test_sample['caption'])}")
        print(f"  第一条描述: '{test_sample['caption'][0]}'")

    except Exception as e:
        print(f"\n✗ 处理失败: {e}")
        print("  请确保您的网络连接正常，并已安装 `datasets` 库。")
        print("  安装命令: pip install datasets")

if __name__ == '__main__':
    main()

