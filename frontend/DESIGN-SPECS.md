# Nagar Alert Hub - Design Specifications & CSS Guide

## 🎨 Color Palette (Figma Specification)

```css
/* Primary Colors */
--color-primary: #0061FF;        /* Primary Blue */
--color-success: #28A745;        /* Success Green */
--color-warning: #FFC107;        /* Warning Orange */
--color-danger: #DC3545;         /* Danger Red */

/* Gradients */
--gradient-blue: linear-gradient(135deg, #0061FF 0%, #00D4FF 100%);
--gradient-green: linear-gradient(135deg, #28A745 0%, #20C997 100%);
--gradient-orange: linear-gradient(135deg, #FFC107 0%, #FF6B35 100%);
--gradient-red: linear-gradient(135deg, #DC3545 0%, #C92A2A 100%);
```

## 📐 Grid Layout (12-Column System)

```css
/* Map/Alert Split Layout */
.map-container {
  grid-column: span 8;  /* 8/12 columns */
}

.alerts-feed {
  grid-column: span 4;  /* 4/12 columns */
}

/* Responsive Grid */
@media (min-width: 1024px) {
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 24px;
  }
}
```

## ✨ KPI Card Hover Animation

### HTML Structure
```html
<div class="kpi-card group">
  <div class="kpi-card-content">
    <!-- Default visible content -->
    <div class="kpi-icon"></div>
    <div class="kpi-value">1,247</div>
    <div class="kpi-trend">+5%</div>
    
    <!-- Hidden details revealed on hover -->
    <div class="kpi-details">
      <p>5% increase from yesterday</p>
      <span>Last updated: 2 mins ago</span>
    </div>
  </div>
</div>
```

### CSS Code
```css
/* KPI Card Base Styles */
.kpi-card {
  position: relative;
  background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
  border-radius: 16px;
  padding: 24px;
  border: 2px solid #E5E7EB;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

/* Hover State - Scale Up 5% + Shadow */
.kpi-card:hover {
  transform: scale(1.05);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: #60A5FA;
}

/* Icon Rotation on Hover */
.kpi-icon {
  transition: transform 0.3s ease;
}

.kpi-card:hover .kpi-icon {
  transform: rotate(12deg);
}

/* Hidden Details - Revealed on Hover */
.kpi-details {
  height: 0;
  opacity: 0;
  overflow: hidden;
  transition: height 0.3s ease, opacity 0.3s ease;
}

.kpi-card:hover .kpi-details {
  height: auto;
  opacity: 1;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #D1D5DB;
}

/* Trend Line Animation */
.kpi-trend-bar {
  opacity: 0.4;
  transition: opacity 0.3s ease;
}

.kpi-card:hover .kpi-trend-bar {
  opacity: 0.7;
}
```

## 🗺️ Map Component Styles

```css
/* Map Container */
.disruption-map {
  position: relative;
  width: 100%;
  height: 600px;
  background: linear-gradient(135deg, #DBEAFE 0%, #CFFAFE 100%);
  border-radius: 16px;
  overflow: hidden;
}

/* Severity Markers */
.severity-high {
  width: 24px;
  height: 24px;
  background: #DC3545;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
  animation: pulse 2s infinite;
}

.severity-medium {
  width: 20px;
  height: 20px;
  background: #FFC107;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.4);
}

.severity-low {
  width: 16px;
  height: 16px;
  background: #28A745;
  border-radius: 50%;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

/* Pulse Animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

/* Map Layers Panel */
.map-layers-panel {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 256px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 2px solid #E5E7EB;
}

/* Severity Legend */
.severity-legend {
  position: absolute;
  bottom: 24px;
  left: 24px;
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 2px solid #E5E7EB;
}
```

## 🚨 Alert Card States

### State 1: Pending (Default)
```css
.alert-card-pending {
  background: white;
  border: 2px solid #E5E7EB;
}

.alert-btn-verify {
  background: linear-gradient(135deg, #28A745 0%, #20C997 100%);
  border: 2px solid #28A745;
  color: white;
}

.alert-btn-reject {
  background: transparent;
  border: 2px solid #DC3545;
  color: #DC3545;
}
```

### State 2: Verified
```css
.alert-card-verified {
  background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
  border: 2px solid #28A745;
}

.alert-btn-assign {
  background: linear-gradient(135deg, #0061FF 0%, #00D4FF 100%);
  color: white;
}
```

### State 3: Rejected
```css
.alert-card-rejected {
  background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
  border: 2px solid #DC3545;
}

.alert-status-rejected {
  background: #FEE2E2;
  border: 1px solid #DC3545;
  color: #991B1B;
  padding: 12px;
  border-radius: 8px;
}
```

### State 4: Assigned
```css
.alert-card-assigned {
  background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%);
  border: 2px solid #0061FF;
}

.alert-status-assigned {
  background: #D1FAE5;
  border: 1px solid #28A745;
  color: #065F46;
  padding: 12px;
  border-radius: 8px;
}

.alert-btn-view-details {
  background: transparent;
  border: 2px solid #0061FF;
  color: #0061FF;
}
```

## 🔔 View Details Modal

```css
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  animation: fadeIn 0.2s ease-out;
}

/* Modal Container */
.modal-container {
  background: white;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 672px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

/* Modal Header */
.modal-header {
  padding: 24px;
  border-bottom: 1px solid #E5E7EB;
  background: linear-gradient(135deg, #DBEAFE 0%, #CFFAFE 100%);
  border-radius: 24px 24px 0 0;
}

/* Modal Body Grid */
.modal-body {
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* Info Cards */
.modal-info-card {
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #E5E7EB;
}

.modal-info-card.user {
  background: #DBEAFE;
  border-color: #60A5FA;
}

.modal-info-card.phone {
  background: #D1FAE5;
  border-color: #34D399;
}

.modal-info-card.status {
  background: #F3E8FF;
  border-color: #C084FC;
}

.modal-info-card.timing {
  background: #FED7AA;
  border-color: #FB923C;
}

/* Modal Footer */
.modal-footer {
  padding: 24px;
  border-top: 1px solid #E5E7EB;
  background: #F9FAFB;
  display: flex;
  gap: 12px;
}

/* Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

## 🎯 Header Component

```css
/* Header Container */
.dashboard-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: white;
  border-bottom: 1px solid #E5E7EB;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

/* Logo Section */
.header-logo {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #0061FF 0%, #1E3A8A 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 97, 255, 0.3);
}

/* Search Bar */
.header-search {
  position: relative;
  flex: 1;
  max-width: 672px;
}

.header-search input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  background: #F3F4F6;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.header-search input:focus {
  outline: none;
  background: white;
  border-color: #0061FF;
  box-shadow: 0 0 0 3px rgba(0, 97, 255, 0.1);
}

/* Notification Bell */
.notification-bell {
  position: relative;
  padding: 12px;
  background: #F3F4F6;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.notification-bell:hover {
  background: #DBEAFE;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 20px;
  height: 20px;
  background: #DC3545;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

/* Dark Mode Toggle */
.dark-mode-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #F3F4F6;
  border-radius: 12px;
}

.toggle-switch {
  position: relative;
  width: 48px;
  height: 24px;
  background: #D1D5DB;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.toggle-switch.active {
  background: #0061FF;
}

.toggle-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease;
}

.toggle-switch.active .toggle-knob {
  transform: translateX(24px);
}
```

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
@media (min-width: 640px) {  /* sm */
  /* Tablet styles */
}

@media (min-width: 768px) {  /* md */
  /* Small desktop styles */
}

@media (min-width: 1024px) { /* lg */
  /* Desktop styles */
  .map-alert-grid {
    grid-template-columns: 2fr 1fr; /* 8:4 ratio */
  }
}

@media (min-width: 1280px) { /* xl */
  /* Large desktop styles */
}

@media (min-width: 1536px) { /* 2xl */
  /* Extra large desktop styles */
}
```

## 🎬 Advanced Animations

```css
/* Scale and Glow Button */
.btn-primary {
  background: linear-gradient(135deg, #0061FF 0%, #00D4FF 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 0 20px rgba(0, 97, 255, 0.5);
}

/* Card Flip Animation */
@keyframes cardFlip {
  0% {
    transform: rotateY(0);
  }
  100% {
    transform: rotateY(180deg);
  }
}

/* Slide In */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Bounce */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
```

## 💡 Usage Tips

### Apply KPI Card Hover Effect
```jsx
<div className="kpi-card group perspective-1000">
  <div className="kpi-card-content">
    {/* content */}
  </div>
</div>
```

### Create Modal
```jsx
<div className="modal-overlay">
  <div className="modal-container">
    <div className="modal-header">...</div>
    <div className="modal-body">...</div>
    <div className="modal-footer">...</div>
  </div>
</div>
```

### Map Marker with Severity
```jsx
<div className="severity-high"></div>  {/* Red pulsing */}
<div className="severity-medium"></div> {/* Orange */}
<div className="severity-low"></div>    {/* Green */}
```

---

**Last Updated:** January 9, 2026  
**Designer:** Nagar Alert Hub Team  
**Framework:** React + Tailwind CSS v4.0
