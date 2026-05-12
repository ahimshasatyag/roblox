"use client"

import { useState, useEffect } from "react"
import { Product, CreateProductRequest } from "@/types/(admin)/products/index"
import { X, Save, Image as ImageIcon, Tag } from "lucide-react"

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateProductRequest) => Promise<void>;
    editData: Product | null;
}

import { adminProductService } from "@/services/(admin)/products/index"
import { API_URL } from "@/config"
import Cropper from "react-easy-crop"
import { getCroppedImg } from "@/lib/cropImage"

export default function ProductDialog({ isOpen, onClose, onSubmit, editData }: Props) {
    const getImageUrl = (url: string | null) => {
        if (!url) return null
        if (url.startsWith("http")) return url
        if (url.startsWith("/uploads")) return `${API_URL}${url}`
        if (url.startsWith("/")) return url

        const publicImagesMatch = url.match(/public[\\/]images[\\/](.+)$/)
        if (publicImagesMatch) {
            const relativePath = publicImagesMatch[1].replace(/\\/g, "/")
            return `/images/${relativePath}`
        }

        return `/images/${url}`
    }

    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)

    // Cropping States
    const [tempImage, setTempImage] = useState<string | null>(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

    const [formData, setFormData] = useState<CreateProductRequest>({
        name: "",
        starting_price: 0,
        image_url: null,
    })

    const previewUrl = getImageUrl(formData.image_url)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.addEventListener("load", () => {
            setTempImage(reader.result as string)
        })
        reader.readAsDataURL(file)
    }

    const onCropComplete = (_: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }

    const handleSaveCrop = async () => {
        if (!tempImage || !croppedAreaPixels) return

        setUploading(true)
        try {
            const croppedImageBlob = await getCroppedImg(tempImage, croppedAreaPixels)
            const file = new File([croppedImageBlob], "product_image.jpg", { type: "image/jpeg" })

            const res = await adminProductService.uploadImage(file)
            setFormData(prev => ({ ...prev, image_url: res.url }))
            setTempImage(null)
        } catch (err) {
            console.error("Upload failed", err)
            alert("Image upload/crop failed")
        } finally {
            setUploading(false)
        }
    }

    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name,
                starting_price: editData.starting_price,
                image_url: editData.image_url,
            })
        } else {
            setFormData({
                name: "",
                starting_price: 0,
                image_url: null,
            })
        }
    }, [editData, isOpen])

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await onSubmit(formData)
            onClose()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[var(--background)] w-full max-w-2xl rounded-[40px] shadow-2xl border border-[var(--color-muted)]/10 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                <div className="p-10 flex items-center justify-between border-b border-[var(--color-muted)]/5 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[var(--color-primary)] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[var(--color-primary)]/20">
                            <Tag size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black italic tracking-tighter uppercase text-[var(--foreground)]">
                                {editData ? "Modify Product" : "Launch Product"}
                            </h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]/30">Catalog Management</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-[var(--foreground)]/5 rounded-2xl transition-colors">
                        <X size={20} className="text-[var(--foreground)]/40" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                    {/* Name Input */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/30 ml-4">Product Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-8 py-5 bg-[var(--foreground)]/5 border border-transparent rounded-3xl text-[var(--foreground)] font-bold focus:border-[var(--color-primary)] focus:bg-white transition-all outline-none text-sm shadow-inner"
                            placeholder="e.g. Robux Gift Card"
                        />
                    </div>

                    {/* Image Upload Input */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/30 ml-4">Product Image</label>
                        <div className="relative group">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="product-image-upload"
                            />
                            <label
                                htmlFor="product-image-upload"
                                className={`w-full px-8 py-10 bg-[var(--foreground)]/5 border-2 border-dashed border-[var(--foreground)]/10 rounded-[30px] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-[var(--foreground)]/10 hover:border-[var(--color-primary)] transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                                <div className="w-14 h-14 bg-[var(--background)] rounded-2xl flex items-center justify-center shadow-lg text-[var(--color-primary)]">
                                    <ImageIcon size={28} />
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]">
                                        {uploading ? "Uploading Image..." : formData.image_url ? "Change Product Image" : "Select Product Image"}
                                    </p>
                                    <p className="text-[8px] font-bold text-[var(--foreground)]/30 mt-1 uppercase tracking-widest">PNG, JPG or WebP (Max 5MB)</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Preview (Conditional) */}
                    {previewUrl && !tempImage && (
                        <div className="bg-[var(--foreground)]/5 p-4 rounded-[30px] border border-dashed border-[var(--foreground)]/10">
                            <div className="text-[8px] font-black uppercase tracking-[0.4em] text-[var(--foreground)]/30 mb-3 ml-2 text-center">Image Preview</div>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full aspect-video object-contain rounded-2xl bg-white/40"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                        </div>
                    )}

                    {/* Manual Cropper Overlay */}
                    {tempImage && (
                        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
                            <div className="w-full max-w-4xl bg-[var(--background)] rounded-[40px] overflow-hidden shadow-2xl border border-white/10 flex flex-col h-[80vh]">
                                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tighter italic text-[var(--foreground)]">Crop Image</h3>
                                        <p className="text-[10px] font-bold text-[var(--foreground)]/40 uppercase tracking-widest mt-1">Cropping Frame 16:9</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setTempImage(null)}
                                        className="p-3 hover:bg-white/5 rounded-2xl transition-all"
                                    >
                                        <X size={20} className="text-white/40" />
                                    </button>
                                </div>

                                <div className="flex-1 relative bg-black/50">
                                    <Cropper
                                        image={tempImage}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={16 / 9}
                                        onCropChange={setCrop}
                                        onCropComplete={onCropComplete}
                                        onZoomChange={setZoom}
                                    />
                                </div>

                                <div className="p-8 space-y-6 bg-[var(--background)]">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-[var(--foreground)]/40">
                                            <span>Zoom Level</span>
                                            <span>{Math.round(zoom * 100)}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            value={zoom}
                                            min={1}
                                            max={3}
                                            step={0.1}
                                            aria-labelledby="Zoom"
                                            onChange={(e) => setZoom(Number(e.target.value))}
                                            className="w-full h-2 bg-[var(--foreground)]/5 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setTempImage(null)}
                                            className="flex-1 py-4 bg-[var(--foreground)]/5 text-[var(--foreground)]/40 font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl hover:bg-[var(--foreground)]/10 transition-all"
                                        >
                                            Discard
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSaveCrop}
                                            disabled={uploading}
                                            className="flex-[2] py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl shadow-xl shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {uploading ? "Cropping..." : "Apply & Save Crop"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-6 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-5 bg-[var(--foreground)]/5 text-[var(--foreground)]/40 font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl hover:bg-[var(--foreground)]/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-black uppercase tracking-[0.4em] text-[10px] rounded-2xl shadow-xl shadow-[var(--color-primary)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            <Save size={16} />
                            {loading ? "Processing..." : editData ? "Save Changes" : "Create Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
