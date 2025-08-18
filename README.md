# Deepfake Detector - Chrome Extension  

This Chrome extension uses the **[prithivMLmods/Deep-Fake-Detector-v2-Model (ONNX)](https://huggingface.co/prithivMLmods/Deep-Fake-Detector-v2-Model)** to detect and highlight potential deepfake images directly in your browser.  

## Features  
- **Toggle Detection**  
  - Click the extension icon in the browser toolbar to enable or disable detection.  
  - **Green icon** → Detection enabled.  
  - **Gray icon** → Detection disabled.  

- **Deepfake Detection**  
  - When the model detects a fake image, an overlay with the label **"Likely fake"** in red is added on top of the image.  

- **Lightweight & Real-time**  
  - Works automatically on images while you browse.  

## Installation  
1. Clone or download this repository.  
2. Open **chrome://extensions/** in your browser.  
3. Enable **Developer Mode** (top-right corner).  
4. Click **Load unpacked** and select the extension folder.  

## Model  
This extension runs inference using the **Deep-Fake-Detector-v2-Model** (ONNX format), fine-tuned for detecting manipulated images.  

## Disclaimer  
This tool is experimental and should not be considered 100% accurate. Use it as an additional aid, not as a definitive judgment.  

## 📜 License  
[AGPL-3.0-or-later](LICENSE)  