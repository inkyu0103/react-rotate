import { useEffect, useRef, useState } from "react";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [rotate, setRotate] = useState<number>(0); // [0, 90, 180, 270]
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (file !== null) {
      const image = new Image();
      image.src = URL.createObjectURL(file);

      image.onload = () => {
        const MAX_CANVAS_WIDTH = image.width;
        const MAX_CANVAS_HEIGHT = image.height;

        const canvasWidth = rotate % 180 ? MAX_CANVAS_HEIGHT : MAX_CANVAS_WIDTH;

        const canvasHeight =
          rotate % 180 ? MAX_CANVAS_WIDTH : MAX_CANVAS_HEIGHT;

        const width =
          image.width > image.height
            ? canvasWidth
            : (image.width * canvasHeight) / image.height;

        const height =
          image.width > image.height
            ? (image.height * canvasWidth) / image.width
            : MAX_CANVAS_HEIGHT;

        const x = -Math.floor(rotate / 180) * width;
        const y = -Math.floor(((rotate + 90) % 360) / 180) * height;

        if (canvas) {
          canvas.width = rotate % 180 ? height : width;
          canvas.height = rotate % 180 ? width : height;
        }

        context?.rotate((Math.PI / 180) * rotate);

        context?.drawImage(image, x, y, width, height);
        context?.restore();
      };
    }
  }, [file, rotate]);

  return (
    <main>
      <h1>이미지 회전 및 다운로드</h1>
      <input
        type="file"
        accept="image/*"
        multiple={false}
        onChange={(e) => {
          if (e.target.files?.length) {
            setFile(e.target.files[0]);
          }
        }}
      />
      {file && <canvas ref={canvasRef} />}
      <button onClick={() => setRotate((angle) => (angle + 90) % 360)}>
        회전
      </button>
      <button
        onClick={() => {
          if (canvasRef.current) {
            const link = document.createElement("a");
            link.download = "download.png";
            link.href = canvasRef.current.toDataURL();
            link.click();
          }
        }}
      >
        다운로드
      </button>
    </main>
  );
}

export default App;
