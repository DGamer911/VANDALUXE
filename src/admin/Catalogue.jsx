
import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import AdminHeader from "../components/AdminHeader";
import {
  Plus,
  Pencil,
  Trash2,
  Boxes,
  Eye,
  Search,
  RefreshCw,
  X,
  Package,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  price: "",
  images: "",
  sizes: "",
  category: "Clothing",
  stock: "0",
  allowPreorder: false,
  isActive: true,
  featured: false,
};

const OPERATIONS = [
  {
    id: "add",
    label: "Add Product",
    info: "Add a new product",
    icon: Plus,
  },
  {
    id: "edit",
    label: "Edit Product",
    info: "Edit an existing product",
    icon: Pencil,
  },
  {
    id: "delete",
    label: "Delete Product",
    info: "Remove a product",
    icon: Trash2,
  },
  {
    id: "inventory",
    label: "Manage Inventory",
    info: "Manage product stock",
    icon: Boxes,
  },
  {
    id: "status",
    label: "Publish / Unpublish",
    info: "Change product visibility",
    icon: Eye,
  },
];

function getProductImages(product) {
  const rawImages = Array.isArray(product.images)
    ? product.images
    : typeof product.images === "string"
      ? [product.images]
      : [];

  const images = rawImages
    .map((image) =>
      typeof image === "string" ? image : image?.url || ""
    )
    .filter((url) => typeof url === "string" && url.trim());

  if (images.length > 0) return images;

  const fallback =
    product.img ||
    product.image ||
    product.imageUrl ||
    product.thumbnail ||
    "";

  return typeof fallback === "string" && fallback.trim()
    ? [fallback]
    : [];
}

function getProductImage(product) {
  return getProductImages(product)[0] || "";
}
function formatPrice(price) {
  if (price == null || price === "") return "Price not set";

  const value = Number(price);

  if (!Number.isFinite(value)) return String(price);

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 2,
  }).format(value);
}

function getStock(product) {
  return product.stock ?? product.quantity ?? product.inventory?.quantity ?? 0;
}

function getErrorMessage(data, fallback) {
  return data?.error || data?.message || fallback;
}


function CatalogueProductImages({ product }) {
  const images = getProductImages(product);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [product._id, product.id, product.images]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center bg-dark-soft text-sm text-gray">
        No product image
      </div>
    );
  }

  const hasSlideshow = images.length > 1;
  const currentIndex = Math.min(activeIndex, images.length - 1);

  return (
    <div className="relative aspect-square w-full overflow-hidden bg-dark-soft">
      <img
        src={images[currentIndex]}
        alt={`${product.name || "Product"} - Image ${currentIndex + 1}`}
        className="h-full w-full object-cover"
        loading="lazy"
      />

      {hasSlideshow && (
        <>
          <button
            type="button"
            onClick={() =>
              setActiveIndex(
                (currentIndex - 1 + images.length) % images.length
              )
            }
            aria-label="Previous product image"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/65 p-2 text-white transition hover:bg-black/90"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveIndex(
                (currentIndex + 1) % images.length
              )
            }
            aria-label="Next product image"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/65 p-2 text-white transition hover:bg-black/90"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/60 px-3 py-2">
            {images.map((url, index) => (
              <button
                key={`${url}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1}`}
                aria-current={
                  currentIndex === index ? "true" : undefined
                }
                className={`h-2 rounded-full transition-all ${
                  currentIndex === index
                    ? "w-5 bg-white"
                    : "w-2 bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>

          <span className="absolute right-3 top-3 rounded bg-black/65 px-2 py-1 text-xs text-white">
            {currentIndex + 1}/{images.length}
          </span>
        </>
      )}
    </div>
  );
}


function Catalogue() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(null);

  const [modal, setModal] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [inventory, setInventory] = useState({
    stock: "0",
    allowPreorder: false,
  });

  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const toggleSidebar = () => setIsSideBarOpen((previous) => !previous);

  // IMPORTANT: Match this to the key used by your admin login.

function getAdminToken() {
  return (
    sessionStorage.getItem("vandaluxe_admin_token") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    ""
  );
}


  async function apiRequest(path, options = {}) {
    const token = getAdminToken();

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        getErrorMessage(data, `Request failed (${response.status})`),
      );
    }

    return data;
  }

  async function fetchProducts() {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/api/products/admin/all");
      const list = Array.isArray(data) ? data : data.products;

      if (!Array.isArray(list)) {
        throw new Error("Unexpected response from the products API.");
      }

      setProducts(list);
    } catch (err) {
      setError(err.message || "Unable to load the catalogue.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const selectedProduct = products.find(
    (product) => String(product._id || product.id) === selectedId,
  );

  function openModal(operation) {
    setNotice(null);
    setError("");
    setSelectedId("");
    setForm({ ...EMPTY_FORM });
    setInventory({ stock: "0", allowPreorder: false });
    setModal(operation);
  }

  function closeModal() {
    if (saving) return;
    setModal(null);
    setSelectedId("");
    setForm({ ...EMPTY_FORM });
  }

  function selectProduct(id) {
    setSelectedId(id);

    const product = products.find(
      (item) => String(item._id || item.id) === id,
    );

    if (!product) return;

    setForm({
      name: product.name || "",
      slug: product.slug || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      images: Array.isArray(product.images)
        ? product.images.join("\n")
        : product.images || "",
      sizes: Array.isArray(product.sizes)
        ? product.sizes.join(", ")
        : "",
      category: product.category || "Clothing",
      stock: String(getStock(product)),
      allowPreorder: Boolean(product.allowPreorder),
      isActive: Boolean(product.isActive),
      featured: Boolean(product.featured),
    });

    setInventory({
      stock: String(getStock(product)),
      allowPreorder: Boolean(product.allowPreorder),
    });
  }

  function changeField(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "name" && !previous.slug
        ? {
            slug: value
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, ""),
          }
        : {}),
    }));
  }

  function getFormPayload() {
    return {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      images: form.images
        .split(/[\n,]+/)
        .map((image) => image.trim())
        .filter(Boolean),
      sizes: form.sizes
        .split(",")
        .map((size) => size.trim())
        .filter(Boolean),
      category: form.category.trim() || "Clothing",
      stock: Number(form.stock),
      allowPreorder: form.allowPreorder,
      isActive: form.isActive,
      featured: form.featured,
    };
  }

  function validateForm() {
    if (!form.name.trim()) return "Enter a product name.";
    if (!form.description.trim()) return "Enter a product description.";

    if (
      form.price.trim() === "" ||
      !Number.isFinite(Number(form.price)) ||
      Number(form.price) < 0
    ) {
      return "Enter a valid, non-negative price.";
    }

    if (
      form.stock.trim() === "" ||
      !Number.isInteger(Number(form.stock)) ||
      Number(form.stock) < 0
    ) {
      return "Stock must be a non-negative whole number.";
    }

    if (!form.slug.trim()) return "Enter a product slug.";

    return "";
  }

  async function submitProduct(event) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setNotice({ type: "error", text: validationError });
      return;
    }

    setSaving(true);
    setNotice(null);

    try {
      const isEditing = modal === "edit";

      await apiRequest(
        isEditing
          ? `/api/products/${encodeURIComponent(selectedId)}`
          : "/api/products",
        {
          method: isEditing ? "PUT" : "POST",
          body: JSON.stringify(getFormPayload()),
        },
      );

      await fetchProducts();
      setModal(null);
      setSelectedId("");
      setNotice({
        type: "success",
        text: isEditing
          ? "Product updated successfully."
          : "Product created successfully.",
      });
    } catch (err) {
      setNotice({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function deleteSelectedProduct() {
    if (!selectedProduct) {
      setNotice({ type: "error", text: "Select a product first." });
      return;
    }

    setSaving(true);
    setNotice(null);

    try {
      await apiRequest(
        `/api/products/${encodeURIComponent(selectedId)}`,
        { method: "DELETE" },
      );

      await fetchProducts();
      setModal(null);
      setSelectedId("");
      setNotice({ type: "success", text: "Product deleted successfully." });
    } catch (err) {
      setNotice({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function saveInventory(event) {
    event.preventDefault();

    if (!selectedProduct) {
      setNotice({ type: "error", text: "Select a product first." });
      return;
    }

    if (
      inventory.stock.trim() === "" ||
      !Number.isInteger(Number(inventory.stock)) ||
      Number(inventory.stock) < 0
    ) {
      setNotice({
        type: "error",
        text: "Stock must be a non-negative whole number.",
      });
      return;
    }

    setSaving(true);
    setNotice(null);

    try {
      await apiRequest(
        `/api/products/${encodeURIComponent(selectedId)}/inventory`,
        {
          method: "PATCH",
          body: JSON.stringify({
            stock: Number(inventory.stock),
            allowPreorder: inventory.allowPreorder,
          }),
        },
      );

      await fetchProducts();
      setModal(null);
      setSelectedId("");
      setNotice({ type: "success", text: "Inventory updated successfully." });
    } catch (err) {
      setNotice({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function toggleProductStatus() {
    if (!selectedProduct) {
      setNotice({ type: "error", text: "Select a product first." });
      return;
    }

    setSaving(true);
    setNotice(null);

    const nextStatus = !selectedProduct.isActive;

    try {
      await apiRequest(
        `/api/products/${encodeURIComponent(selectedId)}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ isActive: nextStatus }),
        },
      );

      await fetchProducts();
      setModal(null);
      setSelectedId("");
      setNotice({
        type: "success",
        text: nextStatus
          ? "Product published successfully."
          : "Product unpublished successfully.",
      });
    } catch (err) {
      setNotice({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded border border-white/10 bg-dark px-3 py-2.5 text-sm text-white outline-none transition focus:border-accent2";

  const labelClass = "block text-sm text-gray";

  function renderInput(label, name, options = {}) {
    return (
      <label className={labelClass}>
        {label}
        <input
          className={inputClass}
          name={name}
          value={form[name]}
          onChange={changeField}
          required={options.required}
          type={options.type || "text"}
          min={options.min}
          step={options.step}
          placeholder={options.placeholder || ""}
        />
      </label>
    );
  }

  function renderCheckbox(label, name, value = form[name], onChange = changeField) {
    return (
      <label className="flex cursor-pointer items-center gap-3 rounded border border-white/10 bg-dark p-3 text-sm">
        <input
          type="checkbox"
          name={name}
          checked={Boolean(value)}
          onChange={onChange}
          className="h-4 w-4 accent-indigo-500"
        />
        <span>{label}</span>
      </label>
    );
  }

  function renderProductSelector() {
    return (
      <label className={labelClass}>
        Select product
        <select
          className={inputClass}
          value={selectedId}
          onChange={(event) => selectProduct(event.target.value)}
        >
          <option value="" className="bg-dark">
            Choose a product...
          </option>
          {products.map((product) => (
            <option
              key={product._id || product.id}
              value={String(product._id || product.id)}
              className="bg-dark"
            >
              {product.name || "Unnamed product"} —{" "}
              {product.isActive ? "Published" : "Unpublished"}
            </option>
          ))}
        </select>
      </label>
    );
  }

  function renderProductForm() {
    return (
      <form onSubmit={submitProduct} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {renderInput("Product name", "name", { required: true })}
          {renderInput("Slug", "slug", { required: true })}
          {renderInput("Price (NGN)", "price", {
            type: "number",
            min: "0",
            step: "0.01",
            required: true,
          })}
          {renderInput("Category", "category")}
          {renderInput("Stock quantity", "stock", {
            type: "number",
            min: "0",
            step: "1",
            required: true,
          })}
          {renderInput("Available sizes", "sizes", {
            placeholder: "S, M, L, XL",
          })}
        </div>

        <label className={labelClass}>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={changeField}
            required
            rows={3}
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Image URLs
          <textarea
            name="images"
            value={form.images}
            onChange={changeField}
            rows={2}
            placeholder="Paste image URLs, one per line"
            className={inputClass}
          />
        </label>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {renderCheckbox("Allow preorders", "allowPreorder")}
          {renderCheckbox("Published", "isActive")}
          {renderCheckbox("Featured product", "featured")}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded bg-accent2 px-4 py-3 font-medium text-white transition hover:opacity-80 disabled:opacity-50"
        >
          {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {saving
            ? "Saving..."
            : modal === "edit"
              ? "Save Changes"
              : "Create Product"}
        </button>
      </form>
    );
  }

  function renderModalContent() {
    if (modal === "add") return renderProductForm();

    if (modal === "edit") {
      return (
        <div className="space-y-4">
          {renderProductSelector()}
          {selectedProduct ? (
            renderProductForm()
          ) : (
            <p className="text-sm text-gray">
              Choose a product to load its details for editing.
            </p>
          )}
        </div>
      );
    }

    if (modal === "delete") {
      return (
        <div className="space-y-4">
          {renderProductSelector()}

          {selectedProduct && (
            <div className="rounded border border-red-400/20 bg-red-500/5 p-4">
              <p className="font-medium">{selectedProduct.name}</p>
              <p className="mt-2 text-sm text-gray">
                This permanently removes the product from the database.
                This action cannot be undone.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={deleteSelectedProduct}
            disabled={saving || !selectedProduct}
            className="flex w-full items-center justify-center gap-2 rounded bg-red-600 px-4 py-3 font-medium text-white hover:bg-red-500 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {saving ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      );
    }

    if (modal === "inventory") {
      return (
        <form onSubmit={saveInventory} className="space-y-4">
          {renderProductSelector()}

          {selectedProduct && (
            <>
              <div className="rounded bg-dark p-3">
                <p className="text-sm text-gray">Current stock</p>
                <p className="mt-1 text-xl font-semibold">
                  {getStock(selectedProduct)}
                </p>
              </div>

              <label className={labelClass}>
                New stock quantity
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={inventory.stock}
                  onChange={(event) =>
                    setInventory((previous) => ({
                      ...previous,
                      stock: event.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </label>

              {renderCheckbox(
                "Allow preorders",
                "allowPreorder",
                inventory.allowPreorder,
                (event) =>
                  setInventory((previous) => ({
                    ...previous,
                    allowPreorder: event.target.checked,
                  })),
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded bg-accent2 px-4 py-3 font-medium hover:opacity-80 disabled:opacity-50"
              >
                {saving ? "Updating..." : "Save Inventory"}
              </button>
            </>
          )}
        </form>
      );
    }

    if (modal === "status") {
      return (
        <div className="space-y-4">
          {renderProductSelector()}

          {selectedProduct && (
            <div className="rounded border border-white/10 bg-dark p-4">
              <p className="font-medium">{selectedProduct.name}</p>
              <p className="mt-2 text-sm text-gray">
                Current status:{" "}
                <span
                  className={
                    selectedProduct.isActive
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }
                >
                  {selectedProduct.isActive ? "Published" : "Unpublished"}
                </span>
              </p>
              <p className="mt-2 text-sm text-gray">
                {selectedProduct.isActive
                  ? "Unpublishing hides this product from the public catalogue."
                  : "Publishing makes this product visible in the public catalogue."}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={toggleProductStatus}
            disabled={saving || !selectedProduct}
            className="w-full rounded bg-accent2 px-4 py-3 font-medium hover:opacity-80 disabled:opacity-50"
          >
            {saving
              ? "Updating..."
              : selectedProduct?.isActive
                ? "Unpublish Product"
                : "Publish Product"}
          </button>
        </div>
      );
    }

    return null;
  }

  const currentOperation = OPERATIONS.find((item) => item.id === modal);

  return (
    <section className="flex min-h-screen overflow-x-hidden bg-dark text-white">
      <SideBar isOpen={isSideBarOpen} />

      <section className="min-w-0 flex-1">
        <AdminHeader onMenuClick={toggleSidebar} pageName="Catalogue" />

        <main className="min-h-[calc(100vh-73px)] bg-dark p-5">
          <div>
            <span className="inline-block rounded bg-dark-soft p-2 text-sm font-light text-gray">
              Product management and inventory control. Add, edit, or remove
              products from the catalogue.
            </span>
          </div>

          {notice && !modal && (
            <div
              role="status"
              className={`mt-4 flex items-center gap-2 rounded border p-3 text-sm ${
                notice.type === "error"
                  ? "border-red-500/30 bg-red-500/5 text-red-300"
                  : "border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
              }`}
            >
              {notice.type === "error" ? (
                <AlertCircle className="h-4 w-4 shrink-0" />
              ) : (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              )}
              {notice.text}
              <button
                type="button"
                onClick={() => setNotice(null)}
                className="ml-auto"
                aria-label="Dismiss message"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
            {OPERATIONS.map((operation) => {
              const Icon = operation.icon;

              return (
                <button
                  key={operation.id}
                  type="button"
                  title={operation.info}
                  onClick={() => openModal(operation.id)}
                  className="flex min-h-12 items-center justify-center gap-2 rounded bg-dark-soft p-3 text-white transition hover:bg-accent2 focus:outline-none focus:ring-2 focus:ring-accent2"
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{operation.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded bg-dark-soft p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">All Products</h2>
                <p className="mt-1 text-sm text-gray">
                  {loading
                    ? "Loading catalogue..."
                    : `${products.length} product(s) retrieved from the database`}
                </p>
              </div>

              <button
                type="button"
                onClick={fetchProducts}
                disabled={loading}
                className="flex items-center gap-2 rounded bg-accent2 px-3 py-2 text-sm hover:opacity-80 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>

            {loading && (
              <div className="flex items-center justify-center gap-2 py-10 text-gray">
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Loading products from MongoDB...
              </div>
            )}

            {!loading && error && (
              <div className="rounded border border-red-500/30 p-4">
                <p className="text-red-400">{error}</p>
                <button
                  type="button"
                  onClick={fetchProducts}
                  className="mt-3 rounded bg-dark px-4 py-2 text-sm hover:bg-accent2"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="py-10 text-center">
                <Package className="mx-auto h-10 w-10 text-gray" />
                <p className="mt-3">No products found.</p>
                <p className="mt-2 text-sm text-gray">
                  Add a product to your catalogue to see it here.
                </p>
              </div>
            )}

            {!loading && !error && products.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {products.map((product) => {
                  

                  return (
                    <article
                      key={product._id || product.id}
                      className="overflow-hidden rounded border border-white/5 bg-dark"
                    >
                      <CatalogueProductImages product={product} />

                      <div className="space-y-2 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold">
                            {product.name || "Unnamed product"}
                          </h3>
                          <span
                            className={`shrink-0 rounded px-2 py-1 text-xs ${
                              product.isActive
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-amber-500/10 text-amber-400"
                            }`}
                          >
                            {product.isActive ? "Published" : "Unpublished"}
                          </span>
                        </div>

                        <p className="font-medium text-accent3">
                          {formatPrice(product.price)}
                        </p>
                        <p className="text-sm text-gray">
                          Category: {product.category || "Clothing"}
                        </p>
                        <p className="text-sm text-gray">
                          Stock: {getStock(product)}
                        </p>
                        <p className="text-sm text-gray">
                          Sizes: {product.sizes?.join(", ") || "None"}
                        </p>
                        <p className="text-sm text-gray">
                          Preorders: {product.allowPreorder ? "Enabled" : "Disabled"}
                        </p>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              openModal("edit");
                              setSelectedId(String(product._id || product.id));
                              setForm({
                                ...EMPTY_FORM,
                                name: product.name || "",
                                slug: product.slug || "",
                                description: product.description || "",
                                price: String(product.price ?? ""),
                                images: Array.isArray(product.images)
                                  ? product.images.join("\n")
                                  : product.images || "",
                                sizes: product.sizes?.join(", ") || "",
                                category: product.category || "Clothing",
                                stock: String(getStock(product)),
                                allowPreorder: Boolean(product.allowPreorder),
                                isActive: Boolean(product.isActive),
                                featured: Boolean(product.featured),
                              });
                            }}
                            className="flex flex-1 items-center justify-center gap-2 rounded border border-white/10 px-3 py-2 text-sm hover:bg-dark-soft"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              openModal("inventory");
                              setSelectedId(String(product._id || product.id));
                              setInventory({
                                stock: String(getStock(product)),
                                allowPreorder: Boolean(product.allowPreorder),
                              });
                            }}
                            className="flex flex-1 items-center justify-center gap-2 rounded border border-white/10 px-3 py-2 text-sm hover:bg-dark-soft"
                          >
                            <Boxes className="h-4 w-4" />
                            Stock
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </section>

      {modal && currentOperation && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-md"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="catalogue-modal-title"
            className="my-auto w-full max-w-xl overflow-hidden rounded-xl border border-white/10 bg-[#111113] shadow-2xl"
          >
            <header className="flex items-center justify-between gap-3 border-b border-white/10 p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-accent2/15 p-2 text-accent3">
                  {React.createElement(currentOperation.icon, {
                    className: "h-5 w-5",
                  })}
                </div>
                <div>
                  <h2
                    id="catalogue-modal-title"
                    className="font-semibold"
                  >
                    {currentOperation.label}
                  </h2>
                  <p className="mt-1 text-xs text-gray">
                    Vandaluxe product management
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close modal"
                className="rounded p-2 text-gray transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="max-h-[75vh] overflow-y-auto p-4 sm:p-5">
              {notice && (
                <div
                  role="alert"
                  className={`mb-4 rounded border p-3 text-sm ${
                    notice.type === "error"
                      ? "border-red-500/30 bg-red-500/5 text-red-300"
                      : "border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
                  }`}
                >
                  {notice.text}
                </div>
              )}

              {products.length === 0 &&
              !loading &&
              modal !== "add" ? (
                <p className="py-6 text-center text-sm text-gray">
                  There are no products to manage yet.
                </p>
              ) : (
                renderModalContent()
              )}

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="mt-4 w-full rounded border border-white/10 px-4 py-2.5 text-sm text-gray transition hover:bg-white/5 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

export default Catalogue;
