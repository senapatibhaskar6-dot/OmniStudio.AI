import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Plus,
  Trash2,
  Edit2,
  Palette,
  Eye,
  CheckCircle2,
  DollarSign,
  Tag,
  Building2,
  Globe,
  Mail,
  Phone,
  LayoutGrid,
  FileText,
  Sparkles,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { CatalogProduct, CatalogSettings } from '../../types';

export const PdfCatalogStudio: React.FC = () => {
  // Catalog Configuration
  const [settings, setSettings] = useState<CatalogSettings>({
    catalogTitle: '2026 Premium Audio & Creator Gear Catalog',
    companyName: 'Apex Audio Labs Inc.',
    tagline: 'Acoustic Precision for Modern Sound Creators',
    contactEmail: 'sales@apexaudiolabs.com',
    contactPhone: '+1 (800) 555-0199',
    website: 'https://apexaudiolabs.com',
    currency: '$',
    primaryColor: '#4f46e5',
    secondaryColor: '#0f172a',
    layout: 'grid-2x2',
    showPrices: true,
    showSku: true,
    headerNote: 'Official Wholesale & Retail Line Sheet - Volume 4',
    footerNote: 'All products include 2-Year International Manufacturer Warranty',
  });

  // Product Inventory List
  const [products, setProducts] = useState<CatalogProduct[]>([
    {
      id: 'prod-1',
      sku: 'APX-HD900',
      name: 'Apex Studio Wireless Headphones',
      category: 'Headphones',
      price: 299.0,
      salePrice: 249.0,
      description: 'Ultra-low latency Bluetooth 5.4 planar magnetic driver headphones with active noise cancelling.',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      badge: 'BESTSELLER',
      inStock: true,
      rating: 4.9,
    },
    {
      id: 'prod-2',
      sku: 'APX-MIC-PRO',
      name: 'Broadcast XLR & USB Condenser Mic',
      category: 'Microphones',
      price: 189.0,
      salePrice: 159.0,
      description: 'Gold-sputtered large diaphragm cardioid capsule engineered for broadcast voice, podcasts, and vocals.',
      imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
      badge: 'NEW',
      inStock: true,
      rating: 4.8,
    },
    {
      id: 'prod-3',
      sku: 'APX-MON-5',
      name: 'Nearfield Active Studio Monitors (Pair)',
      category: 'Speakers',
      price: 499.0,
      description: 'Bi-amplified 5-inch Kevlar woofers delivering flat frequency acoustic response for master mixing.',
      imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
      badge: 'HOT',
      inStock: true,
      rating: 5.0,
    },
    {
      id: 'prod-4',
      sku: 'APX-DAC-01',
      name: 'High-Resolution 32-bit DAC Interface',
      category: 'Audio Interfaces',
      price: 219.0,
      salePrice: 199.0,
      description: 'Ultra-clean ESS Sabre DAC with balanced TRS outputs and dual headphone amplifier monitoring.',
      imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
      inStock: true,
      rating: 4.7,
    },
  ]);

  // Form State for Adding / Editing Product
  const [newProduct, setNewProduct] = useState<Partial<CatalogProduct>>({
    name: '',
    sku: '',
    category: 'Audio',
    price: 99,
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
    badge: 'NEW',
    inStock: true,
  });

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [previewPage, setPreviewPage] = useState<number>(1);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const sampleImages = [
    { label: 'Smart Watch', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80' },
    { label: 'Sneakers', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80' },
    { label: 'Retro Camera', url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80' },
    { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80' },
  ];

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    const prod: CatalogProduct = {
      id: 'prod-' + Date.now(),
      sku: newProduct.sku || `APX-${Math.floor(100 + Math.random() * 900)}`,
      name: newProduct.name,
      category: newProduct.category || 'General',
      price: Number(newProduct.price),
      salePrice: newProduct.salePrice ? Number(newProduct.salePrice) : undefined,
      description: newProduct.description || 'High-performance crafted product with superior build quality.',
      imageUrl: newProduct.imageUrl || sampleImages[0].url,
      badge: (newProduct.badge as any) || undefined,
      inStock: newProduct.inStock ?? true,
      rating: 5.0,
    };

    setProducts([...products, prod]);
    setNewProduct({
      name: '',
      sku: '',
      category: 'Audio',
      price: 99,
      description: '',
      imageUrl: sampleImages[0].url,
      badge: 'NEW',
      inStock: true,
    });
    setShowAddModal(false);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // Instant PDF Generation using jsPDF
  const handleGeneratePdf = () => {
    setIsExporting(true);

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Brand colors
      const hexToRgb = (hex: string) => {
        const bigint = parseInt(hex.replace('#', ''), 16);
        return {
          r: (bigint >> 16) & 255,
          g: (bigint >> 8) & 255,
          b: bigint & 255,
        };
      };

      const primaryRgb = hexToRgb(settings.primaryColor);

      // --- PAGE 1: COVER & HEADER ---
      // Top Brand Header Banner
      doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      doc.rect(0, 0, pageWidth, 42, 'F');

      // Brand Title & Tagline
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text(settings.companyName.toUpperCase(), 14, 18);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(settings.tagline, 14, 25);
      doc.text(settings.headerNote, 14, 32);

      // Document Title
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(settings.catalogTitle, 14, 52);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated: ${new Date().toLocaleDateString()} | Total Products: ${products.length} Items`, 14, 58);

      // Separator line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(14, 62, pageWidth - 14, 62);

      // Render Products in Grid (2 columns x 2 rows per page)
      let currentY = 68;
      const colWidth = (pageWidth - 36) / 2; // 2 cols with margins

      products.forEach((prod, index) => {
        const col = index % 2;
        const row = Math.floor((index % 4) / 2);

        // Add page if needed
        if (index > 0 && index % 4 === 0) {
          doc.addPage();
          // Header on subsequent pages
          doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
          doc.rect(0, 0, pageWidth, 18, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.text(`${settings.companyName} • ${settings.catalogTitle}`, 14, 12);
          currentY = 26;
        }

        const posX = 14 + col * (colWidth + 8);
        const cardY = currentY + (index % 4 >= 2 ? 88 : 0);

        // Product Card Frame
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(posX, cardY, colWidth, 80, 3, 3, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(posX, cardY, colWidth, 80, 3, 3, 'S');

        // Product Badge
        if (prod.badge) {
          doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
          doc.roundedRect(posX + 4, cardY + 4, 22, 5, 1, 1, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(7);
          doc.setFont('helvetica', 'bold');
          doc.text(prod.badge, posX + 6, cardY + 7.5);
        }

        // Product SKU
        doc.setTextColor(148, 163, 184);
        doc.setFontSize(7.5);
        doc.setFont('courier', 'bold');
        doc.text(`SKU: ${prod.sku}`, posX + colWidth - 28, cardY + 8);

        // Product Name
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        const splitTitle = doc.splitTextToSize(prod.name, colWidth - 10);
        doc.text(splitTitle, posX + 6, cardY + 18);

        // Category
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(`Category: ${prod.category}`, posX + 6, cardY + 28);

        // Description
        doc.setTextColor(71, 85, 105);
        doc.setFontSize(7.5);
        const splitDesc = doc.splitTextToSize(prod.description, colWidth - 12);
        doc.text(splitDesc.slice(0, 3), posX + 6, cardY + 35);

        // Price Tag
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
        const priceStr = prod.salePrice
          ? `${settings.currency}${prod.salePrice.toFixed(2)}  (Reg. ${settings.currency}${prod.price.toFixed(2)})`
          : `${settings.currency}${prod.price.toFixed(2)}`;
        doc.text(priceStr, posX + 6, cardY + 68);

        // Stock Status
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(16, 185, 129);
        doc.text(prod.inStock ? '● In Stock • Ready to Ship' : '○ Out of Stock', posX + 6, cardY + 74);
      });

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setDrawColor(226, 232, 240);
        doc.line(14, pageHeight - 14, pageWidth - 14, pageHeight - 14);

        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `${settings.companyName} | ${settings.website} | ${settings.contactEmail}`,
          14,
          pageHeight - 9
        );
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - 26, pageHeight - 9);
      }

      // Save PDF file
      doc.save(`${settings.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_Product_Catalog.pdf`);
    } catch (e) {
      console.error('PDF generation error:', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <FileSpreadsheet className="h-4 w-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Professional PDF Catalog Generator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build and publish publication-ready PDF product line sheets with custom company branding, logos, prices, and layouts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Product
          </button>

          <button
            onClick={handleGeneratePdf}
            disabled={isExporting}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Generate & Download PDF
          </button>
        </div>
      </div>

      {/* Main Grid: Live Flip Preview on Left (7 cols) + Products & Brand Settings on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Visual Catalog Page Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-2xl">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2.5">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5 text-emerald-400" />
                Live Publication Preview
              </span>
              <span className="text-xs font-mono text-slate-400">
                A4 Sheet Format • {products.length} Products Loaded
              </span>
            </div>

            {/* Catalog Page Container (Styled like real printed PDF page) */}
            <div className="relative w-full aspect-[1/1.414] rounded-xl overflow-hidden bg-white text-slate-900 shadow-2xl border border-slate-200 p-6 flex flex-col justify-between select-none">
              {/* Header Banner */}
              <div
                className="rounded-xl p-4 text-white shadow-md transition-colors"
                style={{ backgroundColor: settings.primaryColor }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-black tracking-tight uppercase">
                      {settings.companyName}
                    </h2>
                    <p className="text-xs opacity-90">{settings.tagline}</p>
                  </div>
                  <span className="rounded bg-white/20 px-2 py-0.5 text-[10px] font-bold">
                    OFFICIAL LINE SHEET
                  </span>
                </div>
                <div className="mt-2 text-[10px] opacity-80 border-t border-white/20 pt-1.5 flex justify-between">
                  <span>{settings.catalogTitle}</span>
                  <span>{settings.headerNote}</span>
                </div>
              </div>

              {/* Product Grid inside Preview */}
              <div className="grid grid-cols-2 gap-3 my-4 flex-1">
                {products.slice(0, 4).map((prod) => (
                  <div
                    key={prod.id}
                    className="flex flex-col justify-between rounded-lg border border-slate-200 bg-slate-50 p-2.5 shadow-sm text-left"
                  >
                    <div>
                      {/* Thumbnail & Badge */}
                      <div className="relative aspect-[16/10] w-full rounded overflow-hidden bg-slate-200 mb-2">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                        {prod.badge && (
                          <span
                            className="absolute top-1 left-1 rounded px-1.5 py-0.5 text-[8px] font-bold text-white shadow"
                            style={{ backgroundColor: settings.primaryColor }}
                          >
                            {prod.badge}
                          </span>
                        )}
                        <span className="absolute bottom-1 right-1 bg-black/70 px-1 py-0.5 rounded text-[8px] font-mono text-white">
                          {prod.sku}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {prod.name}
                      </h4>
                      <div className="text-[10px] text-slate-500">{prod.category}</div>
                      <p className="text-[9px] text-slate-600 line-clamp-2 mt-1 leading-tight">
                        {prod.description}
                      </p>
                    </div>

                    <div className="mt-2 pt-1 border-t border-slate-200 flex items-center justify-between">
                      <div className="text-xs font-extrabold" style={{ color: settings.primaryColor }}>
                        {settings.currency}
                        {prod.salePrice ? prod.salePrice : prod.price}
                      </div>
                      <span className="text-[9px] text-emerald-600 font-semibold">
                        ● In Stock
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Page Footer */}
              <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[9px] text-slate-500">
                <span>{settings.footerNote}</span>
                <span className="font-mono">Page 1 of {Math.ceil(products.length / 4)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inventory Manager & Brand Customizer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Brand Customizer */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Palette className="h-3.5 w-3.5 text-emerald-400" />
              Brand & Company Styling
            </span>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Company Name</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Catalog Title</label>
                  <input
                    type="text"
                    value={settings.catalogTitle}
                    onChange={(e) => setSettings({ ...settings, catalogTitle: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="h-8 w-10 cursor-pointer rounded border border-slate-800 bg-slate-950 p-0.5"
                    />
                    <span className="text-slate-300 font-mono text-[11px]">{settings.primaryColor}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Contact Email</label>
                  <input
                    type="text"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-white text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Product Items List */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                Catalog Items ({products.length})
              </span>
              <button
                onClick={() => setShowAddModal(true)}
                className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <Plus className="h-3 w-3" /> Add Item
              </button>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <img
                      src={prod.imageUrl}
                      alt={prod.name}
                      className="h-10 w-10 rounded-lg object-cover border border-slate-800 shrink-0"
                    />
                    <div className="truncate">
                      <div className="font-semibold text-slate-200 truncate">{prod.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {prod.sku} • {settings.currency}{prod.price}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="h-4 w-4 text-emerald-400" />
              Add Product to Catalog
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Product Title</label>
                <input
                  type="text"
                  value={newProduct.name || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Ergonomic Studio Desk"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">SKU</label>
                  <input
                    type="text"
                    value={newProduct.sku || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    placeholder="DSK-100"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={newProduct.price || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description</label>
                <textarea
                  value={newProduct.description || ''}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  rows={2}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Select Preset Image</label>
                <div className="grid grid-cols-4 gap-2">
                  {sampleImages.map((s, idx) => (
                    <img
                      key={idx}
                      src={s.url}
                      alt={s.label}
                      onClick={() => setNewProduct({ ...newProduct, imageUrl: s.url })}
                      className={`h-14 w-full rounded-lg object-cover cursor-pointer border-2 ${
                        newProduct.imageUrl === s.url ? 'border-emerald-500' : 'border-slate-800'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-slate-800 px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-500"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
