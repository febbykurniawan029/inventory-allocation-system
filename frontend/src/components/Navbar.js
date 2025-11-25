import Link from "next/link";

/**
 * Komponen Navbar utama aplikasi.
 */
export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          📦 Inventory System
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:text-blue-200">
            Dashboard
          </Link>
          <Link
            href="/create"
            className="bg-white text-blue-600 px-3 py-1 rounded font-bold hover:bg-gray-100"
          >
            + New
          </Link>
        </div>
      </div>
    </nav>
  );
}
