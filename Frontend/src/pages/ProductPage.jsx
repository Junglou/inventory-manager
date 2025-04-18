import { useNavigate, useParams } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { useEffect } from "react";
import { ArrowLeftIcon, SaveIcon, Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";

function ProductPage({ onSave }) {
  const {
    currentProduct,
    formData,
    setFormData,
    loading,
    error,
    fetchProduct,
    updateProduct,
    deleteProduct,
  } = useProductStore();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchProduct(id);
  }, [fetchProduct, id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        navigate("/");
      } catch (error) {
        toast.error("An error occurred while deleting the product!");
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProduct(id);
      onSave();
    } catch (error) {
      toast.error("An error occurred while updating the product!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <button onClick={() => navigate("/")} className="btn btn-ghost mb-8">
        <ArrowLeftIcon className="size-4 mr-2" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* PRODUCT IMAGE */}
        <div className="flex justify-center items-center bg-base-100 rounded-lg overflow-hidden">
          <img
            src={currentProduct?.image}
            alt={currentProduct?.name}
            className="max-w-full h-auto object-contain"
          />
        </div>

        {/* PRODUCT FORM */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-2xl mb-6">Edit Product</h2>

            <form onSubmit={handleSave} className="space-y-6">
              {/* PRODUCT NAME */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">
                    Product Name
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  className="input input-bordered w-full"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {/* PRODUCT PRICE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">
                    Price
                  </span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="input input-bordered w-full"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>

              {/* PRODUCT IMAGE URL */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">
                    Image URL
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  className="input input-bordered w-full"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                />
              </div>

              {/* PRODUCT DESCRIPTION */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-base font-medium">
                    Description
                  </span>
                </label>
                <textarea
                  placeholder="Enter product description"
                  className="input input-bordered w-full py-3 resize-none h-40"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              {/* FORM ACTIONS */}
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-error"
                >
                  <Trash2Icon className="size-4 mr-2" />
                  Delete Product
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    loading ||
                    !formData.name ||
                    !formData.price ||
                    !formData.image ||
                    !formData.description
                  }
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <>
                      <SaveIcon className="size-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
