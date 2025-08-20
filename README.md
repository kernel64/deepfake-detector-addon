# Deepfake Detector - Chrome Extension  

This Chrome extension uses the **[0xfffm4bs/vit-real-fake-classification-v4 (ONNX)](https://huggingface.co/0xfffm4bs/vit-real-fake-classification-v4)** to detect and highlight potential deepfake images directly in your browser.  

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
2. Download the model from HuggingFace.co and save it to /model/model.onnx.
3. Open **chrome://extensions/** in your browser.  
4. Enable **Developer Mode** (top-right corner).  
5. Click **Load unpacked** and select the extension folder.  

## Model  
This extension runs inference using the **0xfffm4bs/vit-real-fake-classification-v4** (ONNX format), fine-tuned for detecting manipulated images.  

## Disclaimer  
This tool is experimental and should not be considered 100% accurate. Use it as an additional aid, not as a definitive judgment.  

## License  
[AGPL-3.0-or-later](LICENSE)  
