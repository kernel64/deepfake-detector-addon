async function fetchImageBitmap(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return await createImageBitmap(blob);
  } catch (e) {
    console.warn("[Deepfake] Failed to fetch image:", url, e);
    return null;
  }
}

async function preprocessImage(imageElement) {
  const bitmap = await fetchImageBitmap(imageElement.src);
  if (!bitmap) return null;

  const size = { width: 224, height: 224 };
  const rescaleFactor = 0.00392156862745098;
  const mean = [0.5, 0.5, 0.5];
  const std = [0.5, 0.5, 0.5];

  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(bitmap, 0, 0, size.width, size.height);

  const imageData = ctx.getImageData(0, 0, size.width, size.height);
  const { data } = imageData;

  const float32Data = new Float32Array(3 * size.width * size.height);

  for (let i = 0; i < size.width * size.height; i++) {
    for (let c = 0; c < 3; c++) {
      let value = data[i * 4 + c] * rescaleFactor;
      value = (value - mean[c]) / std[c];
      float32Data[c * size.width * size.height + i] = value;
    }
  }

  const tensor = new ort.Tensor("float32", float32Data, [
    1,
    3,
    size.height,
    size.width,
  ]);
  return tensor;
}

/**
 * Interpret ONNX output to label
 */
function interpretOutput(index) {
  return index == 1 ? "Realism" : "Likely fake";
}

/**
 * Overlay badge on image
 */
function overlayLabel(img, label) {
  if (img.dataset.deepfakeAnalyzed) return;
  const badge = document.createElement("div");
  badge.className = "deepfake-badge";
  badge.innerText = label;
  badge.style.position = "absolute";
  badge.style.top = "4px";
  badge.style.left = "4px";
  badge.style.padding = "2px 6px";
  badge.style.background =
    label !== "Realism" ? "rgba(192,57,43,0.85)" : "rgba(46,204,113,0.85)";
  badge.style.color = "#fff";
  badge.style.fontSize = "12px";
  badge.style.borderRadius = "6px";
  badge.style.zIndex = 9999;
  img.style.position = img.style.position || "relative";
  img.parentElement.style.position =
    img.parentElement.style.position || "relative";
  img.parentElement.appendChild(badge);
  img.dataset.deepfakeAnalyzed = true;
}

/**
 * Main scanning function
 */
(async () => {
  chrome.storage.local.get(
    ["detectionEnabled"],
    async ({ detectionEnabled }) => {
      if (!detectionEnabled) {
        console.log("Fake Photo Detector disabled.");
        return;
      }

      // Load ONNX Runtime
      await new Promise((r) => {
        const s = document.createElement("script");
        s.src = chrome.runtime.getURL("vendor/ort.min.js");
        s.onload = r;
        document.head.appendChild(s);
      });

      const session = await ort.InferenceSession.create(
        chrome.runtime.getURL("model/model.onnx")
      );

      const seen = new WeakSet();

      async function analyzeImages() {
        const images = Array.from(document.querySelectorAll("img")).filter(
          (img) => {
            if (!img.complete || !img.src || seen.has(img)) return false;

            const rect = img.getBoundingClientRect();
            const minSize = 200;
            return rect.width >= minSize && rect.height >= minSize;
          }
        );

        for (const img of images) {
          seen.add(img);
          try {
            const inputTensor = await preprocessImage(img);

            const feeds = { pixel_values: inputTensor };
            const results = await session.run(feeds);

            const outputName = session.outputNames[0];
            const logits = results[outputName].data;
            //console.log("logits:", logits);

            let maxIndex = 0;
            for (let i = 1; i < logits.length; i++) {
              if (logits[i] > logits[maxIndex]) {
                maxIndex = i;
              }
            }

            console.log("Prediction:", maxIndex);
            chrome.storage.local.get(["onlyFake"], async ({ onlyFake }) => {
              //console.log('onlyFake : ', onlyFake);
              if (!onlyFake || maxIndex == 0) {

                const label = interpretOutput(maxIndex);
                overlayLabel(img, label);
              }
            });
          } catch (e) {
            console.error("[Deepfake] Detection error:", e);
          }
        }
      }

      // Initial scan
      await analyzeImages();

      // Observe DOM for new images
      const observer = new MutationObserver(() => analyzeImages());
      observer.observe(document.body, { childList: true, subtree: true });

      console.log("Fake Photo Detector initialized");
    }
  );
})();
