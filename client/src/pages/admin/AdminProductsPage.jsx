import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HiPlus, 
  HiPencilSquare, 
  HiTrash, 
  HiMagnifyingGlass, 
  HiWrenchScrewdriver,
  HiCheckCircle,
  HiXCircle
} from 'react-icons/hi2';

import { Card } from '../../components/common/Card.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Badge } from '../../components/common/Badge.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { ProductFormModal } from '../../components/admin/ProductFormModal.jsx';
import { productService } from '../../services/productService.js';
import { useToast } from '../../context/ToastContext.jsx';
import { MACHINERY_CATEGORIES } from '../../utils/constants.js';

export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // Delete Confirm Modal
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { showSuccess, showError } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (search.trim()) params.search = search.trim();

      const res = await productService.getProducts(params);
      setProducts(res.data || []);
    } catch (err) {
      showError('Failed to fetch machinery list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, search]);

  const handleOpenCreate = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await productService.deleteProduct(productToDelete._id);
      showSuccess(`Deleted '${productToDelete.name}'`);
      setProductToDelete(null);
      fetchProducts();
    } catch (err) {
      showError(err.message || 'Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Equipment & Machinery CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage heavy crushers, VSI sand plants, conveyors, specifications, and CAD media.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreate}
          icon={HiPlus}
          className="font-bold text-xs uppercase tracking-wider bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20"
        >
          Add Equipment Model
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <HiMagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by model, name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-red-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-600 font-semibold">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs focus:outline-none focus:border-red-500"
          >
            <option value="all">All Categories</option>
            {MACHINERY_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Equipment Table */}
      <Card className="p-0 bg-white border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-2">
            <Spinner size="md" />
            <span className="text-xs text-slate-500 font-mono">Loading machinery records...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No equipment found matching criteria. Click "Add Equipment Model" to publish.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Equipment Model</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Capacity</th>
                  <th className="py-3.5 px-4">Power</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {products.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {item.coverImage ? (
                            <img src={item.coverImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <HiWrenchScrewdriver className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{item.name}</span>
                          <span className="text-[11px] font-mono text-red-600 font-bold">
                            {item.modelNumber || 'No Model #'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant="red" size="sm">
                        {item.category}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {item.capacity}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {item.power}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {item.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                            <HiCheckCircle className="w-3.5 h-3.5" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                            <HiXCircle className="w-3.5 h-3.5" /> Inactive
                          </span>
                        )}

                        {item.isFeatured && (
                          <span className="text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 ml-1">
                            ★ Featured
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-700 hover:text-red-600 hover:border-red-400 transition-colors"
                          title="Edit Equipment"
                        >
                          <HiPencilSquare className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setProductToDelete(item)}
                          className="p-1.5 rounded-lg bg-slate-100 border border-slate-300 text-rose-600 hover:bg-rose-50 hover:border-rose-400 transition-colors"
                          title="Delete Equipment"
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add / Edit Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={productToEdit}
        onSaved={fetchProducts}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        title="Confirm Equipment Deletion"
        subtitle="This action cannot be undone."
      >
        <div className="flex flex-col gap-4">
          <p className="text-xs text-slate-700 leading-relaxed">
            Are you sure you want to permanently delete <strong className="text-slate-900">{productToDelete?.name}</strong> and remove all associated CAD diagrams, uploaded images, and PDF brochures from disk?
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <Button variant="ghost" size="sm" onClick={() => setProductToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={deleting}
              onClick={handleDelete}
              icon={HiTrash}
            >
              Confirm Permanent Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminProductsPage;
