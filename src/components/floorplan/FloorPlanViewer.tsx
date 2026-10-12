import React, { useState, useEffect } from 'react';
import { FloorLevel, SpotCategory, TableSpot } from '../../types/tableTypes';
import { useTableAvailability } from '../../hooks/useTableAvailability';
import { useFloorPlanPanZoom } from '../../hooks/useFloorPlanPanZoom';
import { TableDetailDrawer } from './TableDetailDrawer';
import {
  Layers,
  Lock,
  RefreshCw,
  Info,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move,
  Map as MapIcon,
  LayoutGrid
} from 'lucide-react';
import '../../styles/floorplan.css';

interface Props {
  initialFloor?: FloorLevel;
  day?: 'day-1' | 'day-2';
  onNavigateToBookingForm?: (spot: TableSpot) => void;
}

const CATEGORY_FILTERS: { key: 'all' | SpotCategory; label: string }[] = [
  { key: 'all', label: 'Semua Spot' },
  { key: 'vvip', label: 'VVIP Royal' },
  { key: 'vip', label: 'VIP Lounge' },
  { key: 'sofa', label: 'Sofa Exclusive' },
  { key: 'booth', label: 'Center Booth' },
  { key: 'mezzanine', label: 'Mezzanine Balcony' },
  { key: 'cocktail', label: 'High Cocktail' }
];

export const FloorPlanViewer: React.FC<Props> = ({
  initialFloor = 1,
  day = 'day-1',
  onNavigateToBookingForm
}) => {
  const {
    currentFloor,
    setCurrentFloor,
    selectedSpot,
    selectedSpotId,
    selectedSpotStatus,
    selectSpot,
    floorSpots,
    floorStats,
    states,
    isLoading,
    reload
  } = useTableAvailability(day, initialFloor);

  const [activeCategory, setActiveCategory] = useState<'all' | SpotCategory>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  const {
    scale,
    position,
    isDragging,
    hasDragged,
    containerRef,
    contentRef,
    handleMouseDown,
    handleDoubleClick,
    zoomIn,
    zoomOut,
    resetView
  } = useFloorPlanPanZoom({
    minScale: 1.0,
    maxScale: 3.5,
    scaleStep: 0.35
  });

  // Reset zoom & pan when floor changes
  useEffect(() => {
    resetView();
  }, [currentFloor, resetView]);

  const filteredSpots = activeCategory === 'all'
    ? floorSpots
    : floorSpots.filter(s => s.category === activeCategory);

  const floorImageUrl = currentFloor === 1
    ? '/assets/floorplans/floor1-layout.png'
    : '/assets/floorplans/floor2-lounge.png';

  const floorAspectRatio = currentFloor === 1 ? '1492 / 1054' : '1381 / 1139';

  return (
    <div className="floorplan-container">
      {/* Top Controls Cluster */}
      <section className="floorplan-controls-cluster">
        <div className="floorplan-switch-row">
          {/* Floor Switcher Tabs */}
          <div className="floor-tabs-group" role="tablist" aria-label="Pilih Venue">
            <button
              type="button"
              className={`floor-tab-btn ${currentFloor === 1 ? 'is-active' : ''}`}
              onClick={() => {
                setCurrentFloor(1);
                selectSpot(null);
              }}
            >
              <Layers size={14} />
              <span>TETRA SOLO</span>
              <span className="floor-tab-badge">HALL &amp; STAGES</span>
            </button>

            <button
              type="button"
              className={`floor-tab-btn ${currentFloor === 2 ? 'is-active' : ''}`}
              onClick={() => {
                setCurrentFloor(2);
                selectSpot(null);
              }}
            >
              <Layers size={14} />
              <span>MIZU COMMONROOM</span>
              <span className="floor-tab-badge">VIP &amp; MEZZANINE</span>
            </button>
          </div>

          {/* View Mode Toggle: Denah vs Daftar Meja */}
          <div className="view-mode-toggle" role="tablist" aria-label="Pilihan Tampilan">
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'map' ? 'is-active' : ''}`}
              onClick={() => setViewMode('map')}
              title="Tampilan Denah Peta Interaktif"
            >
              <MapIcon size={13} />
              <span>Denah</span>
            </button>
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'list' ? 'is-active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Tampilan Daftar Meja Cepat"
            >
              <LayoutGrid size={13} />
              <span>Daftar Meja</span>
            </button>
          </div>

          {/* Availability Counter & Sync Status */}
          <div className="floor-stats-pill">
            <div className="stat-item">
              <span className="stat-dot available" />
              <span><strong>{floorStats.availableCount}</strong> Tersedia</span>
            </div>
            <div className="stat-item">
              <span className="stat-dot occupied" />
              <span><strong>{floorStats.reservedCount}</strong> Terisi</span>
            </div>

            <button
              type="button"
              className="filter-chip-btn"
              style={{ marginLeft: '0.25rem' }}
              onClick={reload}
              title="Perbarui Data Ketersediaan Meja"
              disabled={isLoading}
            >
              <RefreshCw size={11} className={isLoading ? 'animate-spin' : ''} />
              <span>Cek Ketersediaan</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="floorplan-filters-scroll" role="tablist" aria-label="Filter Tipe Spot">
          {CATEGORY_FILTERS.map(f => (
            <button
              key={f.key}
              type="button"
              className={`filter-chip-btn ${activeCategory === f.key ? 'is-active' : ''}`}
              onClick={() => setActiveCategory(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Guide Banner */}
      <div className="floorplan-guide-banner">
        <div className="floorplan-guide-item">
          <Info size={13} style={{ color: 'var(--color-gold-antique, #c5a869)', flexShrink: 0 }} />
          <span>
            {viewMode === 'map'
              ? 'Ketuk pin meja untuk melihat spesifikasi, harga minimum spend, dan reservasi WhatsApp.'
              : 'Pilih meja dari daftar berikut untuk melihat spesifikasi dan reservasi langsung.'}
          </span>
        </div>
        <div className="floorplan-guide-legend">
          <span className="floorplan-legend-item available">
            <span className="floorplan-legend-dot available" /> Emas: Tersedia
          </span>
          <span className="floorplan-legend-item occupied">
            <span className="floorplan-legend-dot occupied" /> Merah: Terisi
          </span>
        </div>
      </div>

      {/* Viewport: Conditional between Map Canvas and Table List View */}
      {viewMode === 'list' ? (
        <div className="floorplan-list-view">
          <div className="floorplan-list-grid">
            {filteredSpots.map(spot => {
              const liveState = states[spot.id];
              const isOccupied = liveState?.status === 'reserved' || liveState?.status === 'occupied' || liveState?.status === 'locked';
              const isSelected = selectedSpotId === spot.id;
              const formattedPrice = day === 'day-1' ? spot.formattedMinSpendDay1 : spot.formattedMinSpendDay2;

              return (
                <div
                  key={spot.id}
                  className={`floorplan-table-card ${isOccupied ? 'is-occupied' : 'is-available'} ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => selectSpot(spot.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="table-card-top">
                    <span className="table-card-code">{spot.code}</span>
                    <span className={`table-card-status ${isOccupied ? 'occupied' : 'available'}`}>
                      {isOccupied ? (
                        <>
                          <Lock size={10} /> Terisi
                        </>
                      ) : (
                        <>
                          <span className="card-status-dot available" /> Tersedia
                        </>
                      )}
                    </span>
                  </div>

                  <div className="table-card-name">{spot.name}</div>

                  <div className="table-card-meta">
                    <span className="table-card-capacity">
                      {spot.capacityText} · {spot.complementTickets || 2} Tiket
                    </span>
                    <span className="table-card-price">{formattedPrice}</span>
                  </div>

                  {spot.formattedBookingFee && (
                    <div style={{ fontSize: '0.68rem', color: '#c5a869', marginTop: '0.2rem', fontFamily: 'var(--font-mono, monospace)' }}>
                      Booking Fee: <strong>{spot.formattedBookingFee}</strong>
                    </div>
                  )}

                  <button
                    type="button"
                    className="table-card-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectSpot(spot.id);
                    }}
                  >
                    {isOccupied ? 'Lihat Spesifikasi' : 'Pilih & Reservasi →'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Interactive Map Canvas Viewport */
        <div
          ref={containerRef}
          className={`floorplan-canvas-frame ${isDragging ? 'is-dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
        >
          {/* Transform Layer for Zoom & Pan */}
          <div
            ref={contentRef}
            className="floorplan-zoom-content"
            style={{
              transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out'
            }}
          >
            {/* Architectural Stage Wrapped tightly to Exact Image Aspect Ratio */}
            <div
              className="floorplan-map-stage"
              style={{
                aspectRatio: floorAspectRatio
              }}
            >
              {/* Architectural Background Render */}
              <img
                src={floorImageUrl}
                alt={`Denah Arsitektural Lantai ${currentFloor}`}
                className="floorplan-base-image"
                loading="eager"
                draggable={false}
              />

              <div className="floorplan-vignette" />

              {/* Hotspots Layer - 1:1 Matched with Image Pixels */}
              <div className="floorplan-hotspots-layer">
                {filteredSpots.map(spot => {
                  const liveState = states[spot.id];
                  const isOccupied = liveState?.status === 'reserved' || liveState?.status === 'occupied' || liveState?.status === 'locked';
                  const isSelected = selectedSpotId === spot.id;

                  return (
                    <button
                      key={spot.id}
                      type="button"
                      className={`table-hotspot-pin ${isOccupied ? 'is-occupied' : 'is-available'} ${isSelected ? 'is-selected' : ''}`}
                      style={{
                        left: `${spot.x}%`,
                        top: `${spot.y}%`
                      }}
                      onClick={(e) => {
                        if (hasDragged) {
                          e.stopPropagation();
                          return;
                        }
                        selectSpot(spot.id);
                      }}
                      title={`${spot.code}: ${isOccupied ? 'Terisi' : 'Tersedia'}`}
                      aria-label={`${spot.code} (${isOccupied ? 'Terisi' : 'Tersedia'})`}
                    >
                      <div className="hotspot-badge">
                        {isOccupied && <Lock className="lock-icon-badge" />}
                        <span>{spot.code}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Floating Zoom & Pan HUD Controls */}
          <div className="floorplan-hud-controls" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="hud-control-btn"
              onClick={zoomIn}
              title="Perbesar Peta (Zoom In)"
              aria-label="Perbesar Peta"
            >
              <ZoomIn size={15} />
            </button>

            <span className="hud-zoom-badge" title="Tingkat Zoom">
              {Math.round(scale * 100)}%
            </span>

            <button
              type="button"
              className="hud-control-btn"
              onClick={zoomOut}
              title="Perkecil Peta (Zoom Out)"
              aria-label="Perkecil Peta"
              disabled={scale <= 1.0}
            >
              <ZoomOut size={15} />
            </button>

            <div className="hud-divider" />

            <button
              type="button"
              className="hud-control-btn"
              onClick={resetView}
              title="Reset Posisi & Zoom (100%)"
              aria-label="Reset Tampilan"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Gestures Navigation Hint Pill */}
          <div className="floorplan-gesture-hint">
            <Move size={12} className="text-[#c5a869]" />
            <span>Geser untuk navigasi · Scroll / cubit untuk zoom</span>
          </div>
        </div>
      )}

      {/* Table Detail Drawer Modal */}
      {selectedSpot && (
        <TableDetailDrawer
          spot={selectedSpot}
          status={selectedSpotStatus}
          day={day}
          onClose={() => selectSpot(null)}
          onSelectForBooking={onNavigateToBookingForm}
        />
      )}
    </div>
  );
};
