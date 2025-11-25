"use client";
import { useEffect, useState } from "react";
import inventoryService from "@/services/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";

/**
 * Halaman Dashboard.
 * Menampilkan ringkasan stok dan daftar semua Purchase Request.
 */
export default function Dashboard() {
  const router = useRouter();
  // State untuk data & loading.
  const [stocks, setStocks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data awal saat halaman dibuka.
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Ambil data stok dan request secara bersamaan.
        const [stockRes, reqRes] = await Promise.all([
          inventoryService.getStocks(),
          inventoryService.getPurchaseRequests(),
        ]);
        setStocks(stockRes.data || []);
        setRequests(reqRes.data || []);
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Table Stocks */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">📊 Stock Levels</h2>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Warehouse</th>
              <th className="p-3">Qty</th>
            </tr>
          </thead>
          <tbody>
            {stocks.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  No stock data available.
                </td>
              </tr>
            ) : (
              stocks.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    {s.product?.name}{" "}
                    <span className="text-gray-400 text-sm">
                      ({s.product?.sku})
                    </span>
                  </td>
                  <td className="p-3">{s.warehouse?.name}</td>
                  <td className="p-3 font-bold text-blue-600">{s.quantity}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Requests */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">📝 Purchase Requests</h2>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Reference</th>
              <th className="p-3">Vendor</th>
              <th className="p-3 text-center">Total Qty</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No requests found.
                </td>
              </tr>
            ) : (
              requests.map((pr) => (
                <tr
                  key={pr.id}
                  // Klik baris untuk navigasi ke halaman detail.
                  onClick={() => router.push(`/edit/${pr.id}`)}
                  className="border-b hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                >
                  <td className="p-3 font-mono text-sm font-medium text-blue-600">
                    {pr.reference}
                  </td>

                  <td className="p-3 text-sm text-gray-600">
                    PT FOOM LAB GLOBAL
                  </td>

                  <td className="p-3 font-bold text-center text-gray-700">
                    {pr.items?.reduce((sum, item) => sum + item.quantity, 0) ||
                      0}
                  </td>

                  <td className="p-3">
                    <StatusBadge status={pr.status} />
                  </td>

                  <td className="p-3 text-sm text-gray-500">
                    {new Date(pr.created_at).toLocaleDateString()}
                  </td>

                  <td className="p-3 text-right">
                    <span className="text-blue-600 text-sm font-semibold hover:underline">
                      View &rarr;
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
