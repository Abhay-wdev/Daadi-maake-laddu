"use client";
import React, { useEffect, useState } from "react";
import { useHeroStore } from "../../../store/heroStore";
import { Loader2, Trash2, Edit, Save, X, Upload, GripVertical } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const HeroImageManager = () => {
  const {
    heroImages,
    fetchHeroImages,
    uploadHeroImages,
    deleteHeroImage,
    updateHeroImage,
    reorderHeroImages,
    loading,
  } = useHeroStore();

  const [files, setFiles] = useState([]);
  const [links, setLinks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingLink, setEditingLink] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    fetchHeroImages();
  }, [fetchHeroImages]);

  // Handle file input
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setLinks(Array(selectedFiles.length).fill(""));
  };

  const handleLinkChange = (index, value) => {
    setLinks((prev) => prev.map((l, i) => (i === index ? value : l)));
  };

  const handleUpload = async () => {
    if (files.length === 0) return toast.error("Please select images");
    try {
      await uploadHeroImages(files, links);
      toast.success("Images uploaded successfully!");
      setFiles([]);
      setLinks([]);
    } catch {
      toast.error("Failed to upload images");
    }
  };

  const startEditing = (img) => {
    setEditingId(img._id);
    setEditingLink(img.link);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingLink("");
  };

  const saveEditing = async () => {
    if (!editingId) return;
    try {
      await updateHeroImage(editingId, editingLink);
      toast.success("Link updated successfully!");
      cancelEditing();
    } catch {
      toast.error("Failed to update link");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await deleteHeroImage(id);
      toast.success("Image deleted!");
    } catch {
      toast.error("Failed to delete image");
    }
  };

  // Drag and drop handlers
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow a drop
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    
    // If dropped on the same index, do nothing
    if (draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }
    
    // Create a new array with the reordered images
    const newImages = [...heroImages];
    const [draggedItem] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);
    
    // Get the new order of IDs
    const orderIds = newImages.map(img => img._id);
    
    // Reset dragged index
    setDraggedIndex(null);
    
    // Call reorderHeroImages with the new order
    reorderHeroImages(orderIds)
      .then(() => {
        toast.success("Images reordered successfully!");
      })
      .catch(() => {
        toast.error("Failed to reorder images");
        fetchHeroImages(); // Refresh to get correct order
      });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Hero Image Manager</h2>

      {/* Upload Section */}
      <div className="mb-6 space-y-4">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full border rounded-md p-2"
        />
        {files.map((file, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{file.name}</span>
            <input
              type="text"
              placeholder="Enter link (optional)"
              value={links[index] || ""}
              onChange={(e) => handleLinkChange(index, e.target.value)}
              className="border p-1 rounded w-full"
            />
          </div>
        ))}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
          Upload Images
        </button>
      </div>

      <hr className="my-6" />

      {/* Hero Images Grid with Drag & Drop */}
      <div className="mb-4 flex items-center gap-2 text-sm text-slate-600">
        <GripVertical size={16} />
        <span>Drag to reorder images</span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {heroImages.map((img, index) => (
          <div
            key={img._id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className="relative rounded-lg overflow-hidden shadow group cursor-move hover:shadow-md transition-all"
          >
            {/* Drag Handle */}
            <div className="absolute top-2 left-2 bg-blue-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition z-10">
              <GripVertical size={16} />
            </div>

            <img 
              src={img.imageUrl} 
              alt="Hero" 
              className="w-full h-40 object-cover" 
            />

            {/* Position Badge */}
            <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {img.sequence + 1}
            </div>

            {/* Action Buttons */}
            <div className="absolute top-2 left-10 flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => startEditing(img)}
                className="bg-blue-600 text-white p-1 rounded-full hover:bg-blue-700"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(img._id)}
                className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Edit link input */}
            {editingId === img._id ? (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-white bg-opacity-90 flex flex-col gap-2">
                <input
                  type="text"
                  value={editingLink}
                  onChange={(e) => setEditingLink(e.target.value)}
                  className="border p-1 rounded w-full text-sm"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={saveEditing}
                    disabled={loading}
                    className="bg-green-600 text-white px-2 py-1 rounded text-sm flex items-center gap-1"
                  >
                    {loading ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="bg-gray-600 text-white px-2 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-white bg-opacity-80 text-xs truncate text-gray-700 text-center">
                {img.link || "No link"}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroImageManager;