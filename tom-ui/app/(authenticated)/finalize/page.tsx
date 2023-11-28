"use client";
import { useState } from "react";
import MapView from "@/components/page-components/MapView";
import ListView from "@/components/page-components/ListView";

export default function FinalizePage() {
  const [showMapView, setShowMapView] = useState(true);

  return (
    <>
      {showMapView ? (
        <MapView showMapView={setShowMapView} />
      ) : (
        <ListView showMapView={setShowMapView} />
      )}
    </>
  );
}
