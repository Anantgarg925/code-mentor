import { useEffect, useRef, useState, useId } from "react";
import mermaid from "mermaid";
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    darkMode: true,
    background: "transparent",
    primaryColor: "#10b981",
    primaryTextColor: "#e2e8f0",
    primaryBorderColor: "#10b981",
    lineColor: "#6b7280",
    secondaryColor: "#1e293b",
    tertiaryColor: "#0f172a",
    edgeLabelBackground: "#1e293b",
    nodeTextColor: "#e2e8f0",
    mainBkg: "#0f172a",
    nodeBorder: "#10b981",
    clusterBkg: "#1e293b",
    titleColor: "#e2e8f0",
    actorBorder: "#10b981",
    actorBkg: "#0f172a",
    actorTextColor: "#e2e8f0",
    actorLineColor: "#6b7280",
    signalColor: "#10b981",
    signalTextColor: "#e2e8f0",
    labelBoxBkgColor: "#1e293b",
    labelBoxBorderColor: "#374151",
    labelTextColor: "#e2e8f0",
    loopTextColor: "#e2e8f0",
    noteBorderColor: "#f59e0b",
    noteBkgColor: "#1e293b",
    noteTextColor: "#e2e8f0",
    activationBorderColor: "#10b981",
    activationBkgColor: "#0f172a",
    sequenceNumberColor: "#0f172a",
    fillType0: "#0f172a",
    fillType1: "#1e293b",
    fillType2: "#0f172a",
    fillType3: "#1e293b",
    fillType4: "#0f172a",
    fillType5: "#1e293b",
    fillType6: "#0f172a",
    fillType7: "#1e293b",
  },
  flowchart: { curve: "basis", padding: 20 },
  sequence: { actorMargin: 50, boxMargin: 10, mirrorActors: false },
  fontSize: 14,
});

interface MermaidDiagramProps {
  code: string;
  caption?: string;
}

export function MermaidDiagram({ code, caption }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");
  const diagramId = `mermaid-${uid}`;
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function render() {
      try {
        const { svg: rendered } = await mermaid.render(diagramId, code.trim());
        if (!cancelled) {
          setSvg(rendered);
          setError("");
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to render diagram");
        }
      }
    }
    render();
    return () => { cancelled = true; };
  }, [code, diagramId]);

  if (error) {
    return (
      <div className="rounded-lg border border-rose-500/20 bg-rose-400/5 p-3 text-xs text-rose-400">
        Could not render diagram: {error}
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="rounded-xl border border-border/40 bg-card/30 h-32 flex items-center justify-center">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Fullscreen overlay */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-8"
          onClick={() => setFullscreen(false)}
        >
          <div className="max-w-5xl w-full space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              {caption && <p className="text-sm text-muted-foreground">{caption}</p>}
              <button
                onClick={() => setFullscreen(false)}
                className="ml-auto text-xs text-muted-foreground hover:text-foreground bg-card border border-border/50 px-3 py-1.5 rounded-lg"
              >
                Close
              </button>
            </div>
            <div
              className="bg-card/60 border border-border/40 rounded-xl p-6 overflow-auto"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </div>
      )}

      <div className="rounded-xl border border-primary/10 bg-card/40 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-card/30">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary/60 animate-[pulse-glow_2s_ease-in-out_infinite]" />
            <span className="text-[10px] font-medium text-primary/80 uppercase tracking-wider">Diagram</span>
            {caption && <span className="text-[10px] text-muted-foreground">— {caption}</span>}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom((z) => Math.max(0.4, z - 0.2))}
              className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="text-[10px] font-mono text-muted-foreground w-8 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
              className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              title="Reset zoom"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setFullscreen(true)}
              className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Diagram */}
        <div
          ref={containerRef}
          className="overflow-auto p-4"
          style={{ maxHeight: 420 }}
        >
          <div
            style={{ transform: `scale(${zoom})`, transformOrigin: "top center", transition: "transform 0.2s ease" }}
            className={cn("flex justify-center [&_svg]:max-w-full [&_svg]:h-auto")}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      </div>
    </>
  );
}
