/**
 * Komponen untuk menampilkan label status (DRAFT, PENDING, dll) dengan warna.
 */
export default function StatusBadge({ status }) {
  // Pemetaan status -> kelas CSS.
  const styles = {
    COMPLETED: "bg-green-100 text-green-800 border-green-200",
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    DRAFT: "bg-gray-100 text-gray-800 border-gray-200",
  };

  // Pilih style yang sesuai, default ke DRAFT.
  const currentStyle = styles[status] || styles.DRAFT;

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentStyle}`}
    >
      {status}
    </span>
  );
}
