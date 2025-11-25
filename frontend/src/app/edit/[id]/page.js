"use client";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import inventoryService from "@/services/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useRouter, useParams } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";

/**
 * Halaman untuk melihat detail dan mengubah Purchase Request (PR).
 * Hanya PR dengan status DRAFT yang bisa diubah.
 */
export default function EditRequest() {
  const router = useRouter();
  const { id } = useParams();

  // State untuk loading, data PR, dan list produk.
  const [loading, setLoading] = useState(true);
  const [prData, setPrData] = useState(null);
  const [products, setProducts] = useState([]);

  // --- 1. SETUP FORM ---
  // Inisialisasi react-hook-form untuk item-item PR.
  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // --- 2. FETCH DATA ---
  // Ambil data detail PR dan daftar produk saat halaman dimuat.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prRes, prodRes] = await Promise.all([
          inventoryService.getPurchaseRequestById(id),
          inventoryService.getProducts(),
        ]);

        setPrData(prRes.data);
        setProducts(prodRes.data || []);

        // Jika status DRAFT, isi form dengan data yang ada.
        if (prRes.data.status === "DRAFT") {
          reset({
            items: prRes.data.items.map((i) => ({
              product_id: i.product_id,
              quantity: i.quantity,
            })),
          });
        }
      } catch (error) {
        toast.error("Failed to load details");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, reset, router]);

  // --- 3. ACTIONS ---

  // A. Simpan perubahan (status tetap DRAFT).
  const onSaveChanges = async (formData) => {
    try {
      const payload = {
        items: formData.items.map((i) => ({
          product_id: parseInt(i.product_id),
          quantity: parseInt(i.quantity),
        })),
      };

      await inventoryService.updatePurchaseRequest(id, payload);
      toast.success("Draft updated successfully");

      // Refresh data header (biar sync)
      const res = await inventoryService.getPurchaseRequestById(id);
      setPrData(res.data);
    } catch (error) {
      toast.error(error);
    }
  };

  // B. Proses PR ke Vendor (status berubah menjadi PENDING).
  const handleProcessToVendor = async () => {
    // Validasi form dulu.
    const isValid = await trigger();
    if (!isValid) {
      toast.error("Please fix form errors first");
      return;
    }

    // Minta konfirmasi user.
    const result = await Swal.fire({
      title: "Process to Vendor?",
      text: "Data will be locked and sent to Vendor. Cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      confirmButtonText: "Yes, Process Order!",
    });

    if (!result.isConfirmed) return;

    // Jika dikonfirmasi, kirim data ke API.
    const currentValues = getValues();

    try {
      Swal.fire({ title: "Processing...", didOpen: () => Swal.showLoading() });
      const payload = {
        status: "PENDING",
        items: currentValues.items.map((i) => ({
          product_id: parseInt(i.product_id),
          quantity: parseInt(i.quantity),
        })),
      };

      await inventoryService.updatePurchaseRequest(id, payload);

      await Swal.fire({
        icon: "success",
        title: "Order Sent!",
        timer: 2000,
        showConfirmButton: false,
      });
      router.push("/");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: error });
    }
  };

  // C. Hapus PR.
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Request?",
      text: "This action cannot be undone.",
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await inventoryService.deletePurchaseRequest(id);
      router.push("/");
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error(error);
    }
  };

  // Tampilan loading.
  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">Loading Detail...</div>
    );
  if (!prData) return null;

  const isDraft = prData.status === "DRAFT";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-800">
              Purchase Request Detail
            </h1>
            <StatusBadge status={prData.status} />
          </div>
          <p className="text-gray-500 font-mono text-sm">
            Ref: {prData.reference}
          </p>
          <p className="text-gray-600 mt-2">
            Warehouse:{" "}
            <span className="font-semibold text-gray-900">
              {prData.warehouse?.name}
            </span>
          </p>
        </div>
        <div className="text-right text-xs text-gray-400">
          Created: {new Date(prData.created_at).toLocaleString()}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold mb-4 text-gray-700">Item Details</h2>

        {/* --- VIEW MODE (Read Only) --- */}
        {!isDraft ? (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 text-sm font-semibold text-gray-600">
                  Product
                </th>
                <th className="p-3 text-sm font-semibold text-gray-600">SKU</th>
                <th className="p-3 text-sm font-semibold text-gray-600">Qty</th>
              </tr>
            </thead>
            <tbody>
              {prData.items.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="p-3">{item.product?.name}</td>
                  <td className="p-3 text-sm text-gray-500 font-mono">
                    {item.product?.sku}
                  </td>
                  <td className="p-3 font-bold">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          /* --- EDIT MODE (Form) --- */
          <form onSubmit={handleSubmit(onSaveChanges)}>
            <div className="space-y-3 mb-6">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="bg-gray-50 p-3 rounded-md border border-gray-200"
                >
                  <div className="flex gap-4 items-start">
                    {/* Product Select */}
                    <div className="flex-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase">
                        Product
                      </label>
                      <select
                        {...register(`items.${index}.product_id`, {
                          required: "Product is required",
                        })}
                        className={`w-full mt-1 border p-2 rounded outline-none bg-white ${
                          errors.items?.[index]?.product_id
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Product...</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      {/* Error Message */}
                      {errors.items?.[index]?.product_id && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.items[index].product_id.message}
                        </p>
                      )}
                    </div>

                    {/* Quantity Input */}
                    <div className="w-32">
                      <label className="text-xs font-semibold text-gray-500 uppercase">
                        Qty
                      </label>
                      <input
                        type="number"
                        min="1"
                        {...register(`items.${index}.quantity`, {
                          required: "Required",
                          min: { value: 1, message: "Min 1" },
                        })}
                        className={`w-full mt-1 border p-2 rounded outline-none ${
                          errors.items?.[index]?.quantity
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {/* Error Message */}
                      {errors.items?.[index]?.quantity && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.items[index].quantity.message}
                        </p>
                      )}
                    </div>

                    {/* Remove Button */}
                    <div className="pt-6">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded transition"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-6">
              <button
                type="button"
                onClick={() => append({ product_id: "", quantity: 1 })}
                className="text-blue-600 font-semibold text-sm hover:underline"
              >
                + Add Another Item
              </button>

              <div className="flex gap-3 w-full sm:w-auto">
                {/* Delete Button */}
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 text-sm font-medium"
                >
                  Delete Request
                </button>

                {/* Save Draft Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition shadow-sm font-medium disabled:opacity-70"
                >
                  {isSubmitting ? "Saving..." : "Save Draft"}
                </button>

                {/* Process Button (Primary) */}
                <button
                  type="button"
                  onClick={handleProcessToVendor}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md font-bold flex items-center gap-2"
                >
                  <span>🚀</span> Process to Vendor
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
