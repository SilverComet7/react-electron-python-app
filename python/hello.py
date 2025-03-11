import sys
import time

# 打印 Python 版本
print(f"Python version: {sys.version}")

# 模拟一些实时输出
for i in range(5):
    print(f"Processing step {i+1}...")
    sys.stdout.flush()  # 确保输出立即显示
    time.sleep(1)  # 暂停1秒

print("Hello from Python!")
print("Process completed!")