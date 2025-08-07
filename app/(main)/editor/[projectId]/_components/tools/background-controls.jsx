"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trash2,
  Image as ImageIcon,
  Search,
  Loader2,
} from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { useCanvas } from "@/context/context";
import { FabricImage } from "fabric";

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
const UNSPLASH_API_URL = "https://api.unsplash.com";

export function BackgroundControls({ project }) {
  const { canvasEditor, setProcessingMessage } = useCanvas();
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [searchQuery, setSearchQuery] = useState("");
  const [unsplashImages, setUnsplashImages] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState("");

  const getMainImage = () => {
    if (!canvasEditor) return;
    const objects = canvasEditor.getObjects();
    return objects.filter((obj) => obj.type === "image")[0];
  };

  const handleBackgroundRemoval = async () => {
    const mainImage = getMainImage();
    if (!mainImage) return;

    setProcessingMessage("Removing...");

    try {
      const url = project.currentImageUrl.includes("ik.imagekit.io")
        ? project.currentImageUrl + "?tr=e-bgremove"
        : project.originalImageUrl;

      const image = FabricImage.fromURL(url, {
        crossOrigin: "anonymous",
      });

      canvasEditor.remove(mainImage);
      canvasEditor.add(image);
      image.setCoords();
      canvasEditor.setActiveObject(image);
      canvasEditor.calcOffset();
    } catch {
      alert("Could not remove background.");
    }

    setProcessingMessage("");
  };

  const handleColorBackground = () => {
    if (!canvasEditor) return;
    canvasEditor.setBackgroundColor(backgroundColor);
  };

  const handleRemoveBackground = () => {
    if (!canvasEditor) return;
    canvasEditor.set("background", "");
    canvasEditor.requestRenderAll();
  };

  const searchUnsplashImages = async () => {
    if (!searchQuery || !UNSPLASH_ACCESS_KEY) return;

    setIsSearching(true);
    const response = fetch(
      `${UNSPLASH_API_URL}/search/photos?query=${searchQuery}&per_page=12`,
      {
        headers: {
          Authorization: `ClientID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    const data = await response.json();
    setUnsplashImages(data.results);
    setIsSearching(false);
  };

  const handleImageBackground = async (url, id) => {
    if (!canvasEditor) return;

    setSelectedImageId(id);

    if (UNSPLASH_ACCESS_KEY) {
      fetch(`${UNSPLASH_API_URL}/photos/${id}/download`, {
        headers: {
          Authorization: `ClientID ${UNSPLASH_ACCESS_KEY}`,
        },
      });
    }

    const img = FabricImage.fromURL(url, {
      crossOrigin: "anonymous",
    });

    const scale = project.width / img.width;
    img.set({
      scaleX: scale,
      scaleY: scale,
      originX: "center",
      originY: "center",
      left: project.height / 2,
      top: project.width / 2,
    });

    canvasEditor.backgroundImage = img;
    canvasEditor.renderAll();
    setSelectedImageId(null);
  };

  return (
    <div className="relative">
      <Button onClick={handleBackgroundRemoval}>Remove Background</Button>

      <Tabs defaultValue="color">
        <TabsList>
          <TabsTrigger value="color">Color</TabsTrigger>
          <TabsTrigger value="image">Image</TabsTrigger>
        </TabsList>

        <TabsContent value="color">
          <HexColorPicker color={backgroundColor} onChange={setBackgroundColor} />
          <Input
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.value)}
          />
          <Button onClick={handleColorBackground}>Apply Color</Button>
        </TabsContent>

        <TabsContent value="image">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.value)}
          />
          <Button onClick={searchUnsplashImages}>
            <Search className="w-4 h-4" />
          </Button>

          {unsplashImages.map((img) => (
            <div
              key={img.id}
              onClick={() => handleImageBackground(img.urls.small, img.id)}
            >
              <img src={img.urls.small} />
              {selectedImageId === img.id && <Loader2 className="animate-spin" />}
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <Button onClick={handleRemoveBackground}>
        <Trash2 className="mr-2 w-4 h-4" />
        Clear Background
      </Button>
    </div>
  );
}
