import axios from "axios";

// Konfigurasi instance Axios terpusat.
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menangani response dan error secara global.
apiClient.interceptors.response.use(
  // Jika sukses, langsung ambil `data` dari response.
  (response) => response.data,
  // Jika gagal, ambil pesan error untuk ditampilkan.
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject(message);
  }
);

/**
 * Kumpulan fungsi untuk berkomunikasi dengan API inventaris.
 */
export const inventoryService = {
  // Master Produk
  getProducts: () => apiClient.get("/products"),
  // Master Stok
  getStocks: () => apiClient.get("/stocks"),
  // Purchase Request (PR)
  getPurchaseRequests: () => apiClient.get("/purchase/request"),
  getPurchaseRequestById: (id) => apiClient.get(`/purchase/request/${id}`),
  createPurchaseRequest: (payload) =>
    apiClient.post("/purchase/request", payload),
  updatePurchaseRequest: (id, payload) =>
    apiClient.put(`/purchase/request/${id}`, payload),
  deletePurchaseRequest: (id) => apiClient.delete(`/purchase/request/${id}`),
};

export default inventoryService;
