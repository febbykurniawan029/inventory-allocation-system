"use client";
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import inventoryService from "@/services/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

/**
 * Halaman untuk membuat Purchase Request (PR) baru.
 */
export default function CreateRequest() {
  const router = useRouter();
  // State untuk data master.
  const [warehouses] = useState([{ id: 1, name: "Warehouse 1" }]);
  const [products, setProducts] = useState([]);

  // Inisialisasi form dengan 1 item default.
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      warehouse_id: 1,
      items: [{ product_id: "", quantity: 1 }],
    },
  });

  // Fungsi untuk tambah/hapus baris item.
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Ambil data produk untuk dropdown.
  useEffect(() => {
    inventoryService
      .getProducts()
      .then((res) => setProducts(res.data || []))
      .catch(() => toast.error("Failed to load products"));
  }, []);

  // Fungsi saat tombol submit di-klik.
  const onSubmit = async (data) => {
    if (data.items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    // Format payload sesuai spek API.
    const payload = {
      warehouse_id: parseInt(data.warehouse_id),
      items: data.items.map((i) => ({
        product_id: parseInt(i.product_id),
        quantity: parseInt(i.quantity),
      })),
    };

    try {
      await inventoryService.createPurchaseRequest(payload);
      toast.success("Purchase Request Created!");
      router.push("/");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow-lg border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Create Purchase Request
      </h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Warehouse */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Target Warehouse
          </label>
          <select
            {...register("warehouse_id", {
              required: "Please select a warehouse",
            })} // Tambah Pesan Error
            className={`w-full border p-2.5 rounded-lg outline-none transition ${
              errors.warehouse_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            {warehouses.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
          {errors.warehouse_id && (
            <p className="text-red-500 text-xs mt-1">
              {errors.warehouse_id.message}
            </p>
          )}
        </div>

        {/* Dynamic Items */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Product Items
          </label>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id}>
                <div className="flex gap-4 items-start">
                  {/* Product Select */}
                  <div className="flex-1">
                    <select
                      {...register(`items.${index}.product_id`, {
                        required: "Product is required",
                      })} // Tambah Pesan
                      className={`w-full border p-2 rounded outline-none ${
                        errors.items?.[index]?.product_id
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Product...</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.sku})
                        </option>
                      ))}
                    </select>
                    {errors.items?.[index]?.product_id && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.items[index].product_id.message}
                      </p>
                    )}
                  </div>

                  {/* Qty Input */}
                  <div className="w-28">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      {...register(`items.${index}.quantity`, {
                        required: "Required",
                        min: { value: 1, message: "Min 1" },
                      })}
                      className={`w-full border p-2 rounded outline-none ${
                        errors.items?.[index]?.quantity
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.items?.[index]?.quantity && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.items[index].quantity.message}
                      </p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-700 p-2 font-bold disabled:opacity-50"
                    disabled={fields.length === 1}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => append({ product_id: "", quantity: 1 })}
            className="mt-4 flex items-center gap-2 text-sm text-blue-600 font-semibold hover:bg-blue-50 px-3 py-2 rounded transition"
          >
            <span>+</span> Add Another Product
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-bold shadow-md transition disabled:bg-blue-300"
          >
            {isSubmitting ? "Saving..." : "Save as Draft"}
          </button>
        </div>
      </form>
    </div>
  );
}
