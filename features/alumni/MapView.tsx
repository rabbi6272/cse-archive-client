"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { listenToAlumniUpdates, mergeAlumniData } from "@/lib/alumni-utils";
import { Badge } from "@/components/ui";
import { alumniData, badgeLabels, type Alumnus } from "./data";

// Leaflet's default marker icon paths break under bundlers; point them at the CDN copies.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const WORLD: [number, number] = [20, 0];

const hasCoords = (a: Alumnus) =>
  Array.isArray(a.coordinates) && a.coordinates.length >= 2 && a.coordinates.every((n) => Number.isFinite(n));

// Defined at module level so markers aren't remounted on every render.
function AlumnusMarker({ alumnus }: { alumnus: Alumnus }) {
  const map = useMap();
  const [lng, lat] = alumnus.coordinates;
  const badges = (alumnus.badges ?? "").split(",").map((b) => b.trim()).filter(Boolean);

  return (
    <Marker
      position={[lat, lng]}
      eventHandlers={{
        click: () => map.flyTo([lat, lng], 10, { duration: 1 }),
        popupclose: () => map.flyTo(WORLD, 2, { duration: 1 }),
      }}
    >
      <Popup>
        <div className="flex max-w-72 flex-col gap-1 font-sans">
          <p className="!m-0 text-base font-semibold text-ink">{alumnus.name}</p>
          {alumnus.optional && <p className="!m-0 text-sm text-ink-soft">{alumnus.optional}</p>}
          <p className="!m-0 text-[13px] text-steel">
            {alumnus.dept} · {alumnus.series} series
          </p>
          <p className="!m-0 text-[13px] text-steel">
            {alumnus.address}, {alumnus.country}
          </p>
          {badges.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {badges.map((b) => (
                <Badge key={b} tone="sky" className="text-[11px]">
                  {badgeLabels[b] ?? b}
                </Badge>
              ))}
            </div>
          )}
          {alumnus.linkedinurl && (
            <a href={alumnus.linkedinurl} target="_blank" rel="noopener noreferrer" className="mt-1 text-sm font-medium !text-link">
              LinkedIn profile
            </a>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

// Static alumni plus any added through the admin page (live from Realtime DB).
export default function MapView() {
  const [alumni, setAlumni] = useState<Alumnus[]>(alumniData);

  useEffect(() => {
    const unsubscribe = listenToAlumniUpdates((dynamic: Alumnus[]) => {
      try {
        setAlumni(mergeAlumniData(alumniData, dynamic));
      } catch (err) {
        console.error("Error merging alumni data:", err);
        setAlumni(alumniData);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <MapContainer
      center={WORLD}
      zoom={2}
      minZoom={2}
      maxZoom={18}
      maxBounds={[
        [-85, -180],
        [85, 180],
      ]}
      maxBoundsViscosity={1}
      className="z-0 size-full"
    >
      <TileLayer
        // CARTO basemaps now need an API key (every tile said "API KEY REQUIRED"). Esri's street map
        // needs none, only the attribution below.
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri &mdash; Source: Esri, HERE, Garmin, USGS, NGA, EPA, USDA, NPS"
        maxZoom={19}
      />
      {alumni.filter(hasCoords).map((a) => (
        <AlumnusMarker key={a.Id ?? a.firebaseId ?? `${a.name}-${a.series}`} alumnus={a} />
      ))}
    </MapContainer>
  );
}
