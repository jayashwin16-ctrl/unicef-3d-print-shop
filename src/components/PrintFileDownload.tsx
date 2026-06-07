import type { Product } from "../data/products";

type PrintFileDownloadProps = {
  product: Product;
  variant?: "default" | "compact" | "inline";
};

export default function PrintFileDownload({ product, variant = "default" }: PrintFileDownloadProps) {
  if (!product.modelFile) return null;

  const fileName = product.modelFile.split("/").pop() ?? "model.stl";

  if (variant === "inline") {
    return (
      <a
        href={product.modelFile}
        download={fileName}
        className="text-sm font-semibold text-cyan-300 underline hover:text-cyan-100"
      >
        Download STL file
      </a>
    );
  }

  if (variant === "compact") {
    return (
      <a
        href={product.modelFile}
        download={fileName}
        className="inline-flex items-center justify-center rounded-full border-2 border-white/40 px-5 py-2 text-sm font-bold text-white hover:bg-white/10"
      >
        Download STL
      </a>
    );
  }

  return (
    <div className="mt-6 rounded-xl border border-brand-border bg-brand-card p-5">
      <h2 className="text-lg font-bold text-brand-heading">Download &amp; print at home</h2>
      <p className="mt-2 text-sm text-brand-muted">
        Get the 3D printable file (STL) for this design. For personal use. Buying from our shop still
        supports UNICEF USA through our 60% donation pledge.
      </p>
      <a
        href={product.modelFile}
        download={fileName}
        className="mt-4 inline-flex items-center justify-center rounded-full border-2 border-brand-blue bg-white px-6 py-2.5 text-sm font-bold text-brand-blue transition hover:bg-brand-blue/10"
      >
        Download STL file
      </a>
      <p className="mt-2 text-xs text-brand-dim">File: {fileName}</p>
    </div>
  );
}
