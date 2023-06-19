import { createSignal, onCleanup, onMount } from "solid-js";
import "./App.css";

function App() {
    const [canvasRef, setCanvasRef] = createSignal();
    let rafId;
    let startTime;

    onCleanup(() => {
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
    });

    function drawTriangle(ctx, x, y, size) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size / 2, y + size * Math.sqrt(3) / 2);
        ctx.lineTo(x + size, y);
        ctx.closePath();
        ctx.stroke();
    }

    function drawSierpinski(ctx, x, y, size, depth) {
        if (depth === 0) {
            drawTriangle(ctx, x, y, size);
            return;
        }

        size /= 2;
        drawSierpinski(ctx, x, y, size, depth - 1);
        drawSierpinski(ctx, x + size, y, size, depth - 1);
        drawSierpinski(ctx, x + size / 2, y + size * Math.sqrt(3) / 2, size, depth - 1);
    }

    function startAnimation() {
        if (canvasRef()) {
            const ctx = canvasRef().getContext("2d");
            ctx.clearRect(0, 0, canvasRef().width, canvasRef().height);

            startTime = Date.now();

            const animate = () => {
                let elapsed = Date.now() - startTime;
                let progress = elapsed / 2000;
                let depth = Math.floor(progress * 8);

                ctx.clearRect(0, 0, canvasRef().width, canvasRef().height);
                drawSierpinski(ctx, 0, 0, canvasRef().width, depth);

                if (depth < 8) {
                    rafId = requestAnimationFrame(animate);
                }
            };

            rafId = requestAnimationFrame(animate);
        }
    }

    onMount(() => {
        if (canvasRef()) {
            startAnimation();
        }
    })


    return (
        <>
            <div class="container">
                <div class="header">
                    <h1>Sierpinski Triangle</h1>
                </div>
                <canvas class="canvas" ref={setCanvasRef} width="600" height="600" />
                <div class="footer">
                    <button onClick={startAnimation}>Restart</button>
                </div>
            </div>
        </>
    );


}

export default App;
