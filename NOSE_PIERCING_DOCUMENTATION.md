# Nose Stud & Eye Gem Piercing Documentation

## Overview
This document outlines the nose piercing system in the application, which includes two main components:
1. **Eye Gem** - A decorative stud on the left nostril
2. **Nose Stud** - A decorative stud on the right nostril

---

## Component References

### React References
```javascript
const nosePiercingRef = useRef(null)  // Stores eye gem image (left nostril)
const noseStudRef = useRef(null)      // Stores nose stud image (right nostril)
```

---

## Image Assets

### Eye Gem (Left Nostril)
- **File**: `./assets/stud.png`
- **Reference**: Loaded into `nosePiercingRef.current`

### Nose Stud (Right Nostril)
- **File**: `./assets/nose_stud.png`
- **Reference**: Loaded into `noseStudRef.current`

---

## State Management

### Eye Gem Positioning State (Left Nostril)
```javascript
const [eyeGemOffsetX, setEyeGemOffsetX] = useState(5)         // X offset
const [eyeGemOffsetY, setEyeGemOffsetY] = useState(2)         // Y offset
const [eyeGemScale, setEyeGemScale] = useState(0.015)         // Base scale
const [eyeGemRotation, setEyeGemRotation] = useState(0)       // Rotation in degrees
```

### Nose Stud Positioning State (Right Nostril)
```javascript
const [noseStudOffsetX, setNoseStudOffsetX] = useState(8)     // X offset
const [noseStudOffsetY, setNoseStudOffsetY] = useState(-5)    // Y offset
const [noseStudScale, setNoseStudScale] = useState(0.04)      // Base scale
const [noseStudRotation, setNoseStudRotation] = useState(0)   // Rotation in degrees
```

### Toggle States
```javascript
const [useEyeGem, setUseEyeGem] = useState(() => {
  const saved = localStorage.getItem('useEyeGem')
  return saved ? JSON.parse(saved) : false
})

const [useNoseStud, setUseNoseStud] = useState(() => {
  const saved = localStorage.getItem('useNoseStud')
  return saved ? JSON.parse(saved) : false
})
```

---

## Fa​ce Landmarks Mapping

### Eye Gem Landmarks (Left Nostril)
| Landmark | Index | Description |
|----------|-------|-------------|
| Left Eye | 33 | Used as reference for eye distance calculation |
| Right Eye | 263 | Used as reference for eye distance calculation |
| Left Nostril | 31 | **Primary anchor point** for eye gem positioning |

### Nose Stud Landmarks (Right Nostril)
| Landmark | Index | Description |
|----------|-------|-------------|
| Left Eye | 33 | Used as reference for eye distance calculation |
| Right Eye | 263 | Used as reference for eye distance calculation |
| Right Nostril | 429 | **Primary anchor point** for nose stud positioning |

---

## Rendering Logic

### Eye Gem Rendering (Left Nostril)

**Rendering Condition:**
```javascript
if (useEyeGem && nosePiercingRef.current && allDetectedFaces.length > 0)
```

**Steps:**

1. **Landmark Retrieval**: Get left nostril landmark (index 31)
2. **Coordinate Conversion**: Convert normalized coordinates to canvas pixel coordinates
3. **Dynamic Scale Calculation**:
   - Base scale: `0.015`
   - Calculated based on eye distance (proximity to camera)
   - Reference eye distance: `0.15`
   - Final range: `0.008` to `0.15`

4. **Positioning Formula**:
   ```
   studX = nostrilX + eyeGemOffsetX - (studWidth / 2)
   studY = nostrilY + eyeGemOffsetY - (studHeight / 2)
   ```

5. **Rendering**:
   - Save canvas state
   - Set global alpha to 1 (fully opaque)
   - Translate to stud center
   - Apply rotation
   - Draw image at rotated position
   - Restore canvas state

### Nose Stud Rendering (Right Nostril)

**Rendering Condition:**
```javascript
if (useNoseStud && noseStudRef.current && allDetectedFaces.length > 0)
```

**Steps:**

1. **Landmark Retrieval**: Get right nostril landmark (index 429)
2. **Coordinate Conversion**: Convert normalized coordinates to canvas pixel coordinates
3. **Dynamic Scale Calculation**:
   - Base scale: `0.04`
   - Calculated based on eye distance (proximity to camera)
   - Reference eye distance: `0.15`
   - Final range: `0.02` to `0.25`

4. **Positioning Formula**:
   ```
   studX = nostrilX + noseStudOffsetX - (studWidth / 2)
   studY = nostrilY + noseStudOffsetY - (studHeight / 2)
   ```

5. **Rendering**:
   - Save canvas state
   - Translate to stud center
   - Apply rotation
   - Draw image at rotated position
   - Restore canvas state

---

## Default Position Mapping

### Eye Gem (Left Nostril)
| Property | Value | Notes |
|----------|-------|-------|
| Offset X | 5 | Pixels to the right of left nostril |
| Offset Y | 2 | Pixels downward from left nostril |
| Base Scale | 0.015 | 1.5% of original image size |
| Rotation | 0° | No rotation |
| Position Anchor | Landmark 31 | Left nostril |

### Nose Stud (Right Nostril)
| Property | Value | Notes |
|----------|-------|-------|
| Offset X | 8 | Pixels to the right of right nostril |
| Offset Y | -5 | Pixels upward from right nostril |
| Base Scale | 0.04 | 4% of original image size |
| Rotation | 0° | No rotation |
| Position Anchor | Landmark 429 | Right nostril |

---

## Dynamic Scaling Algorithm

Both piercings use a proximity-aware scaling system:

```javascript
// Calculate eye distance (normalized coordinates)
const eyeDistance = Math.sqrt(
  Math.pow(rightEye.x - leftEye.x, 2) + 
  Math.pow(rightEye.y - leftEye.y, 2)
)

// Calculate proximity ratio
const referenceEyeDistance = 0.15
const proximityRatio = eyeDistance / referenceEyeDistance

// Apply to base scale
dynamicScale = baseScale * proximityRatio

// Clamp to range
dynamicScale = Math.max(minScale, Math.min(maxScale, dynamicScale))
```

**Eye Gem Scale Range**: `0.008` to `0.15`  
**Nose Stud Scale Range**: `0.02` to `0.25`

---

## Local Storage Persistence

Both piercing preferences are saved to localStorage:

```javascript
// Save Eye Gem preference
localStorage.setItem('useEyeGem', JSON.stringify(useEyeGem))

// Save Nose Stud preference
localStorage.setItem('useNoseStud', JSON.stringify(useNoseStud))
```

These values persist across browser sessions.

---

## Canvas Transformations

Both piercings use the following canvas transformation pattern:

```javascript
ctx.save()
ctx.globalAlpha = 1  // Full opacity
ctx.translate(centerX, centerY)  // Move to center
ctx.rotate(rotationRadians)      // Apply rotation
ctx.drawImage(
  image,
  -width/2,
  -height/2,
  width,
  height
)
ctx.restore()
```

---

## Error Handling

Both components include error handling:

```javascript
try {
  // Rendering logic
} catch (error) {
  console.error('Eye gem rendering error:', error)
  // or
  console.error('Nose stud rendering error:', error)
}
```

---

## Image Loading

### Load Process

```javascript
// Create new image element
const img = new Image()
img.src = imagePath

// On successful load
img.onload = () => {
  ref.current = img  // Store in ref
}

// On load error
img.onerror = () => {
  console.error('Image load error')
}
```

---

## Summary Table

| Feature | Eye Gem | Nose Stud |
|---------|---------|----------|
| **Location** | Left nostril | Right nostril |
| **Image File** | `stud.png` | `nose_stud.png` |
| **Anchor Landmark** | 31 (left nostril) | 429 (right nostril) |
| **Offset X** | 5 px | 8 px |
| **Offset Y** | 2 px | -5 px |
| **Base Scale** | 0.015 | 0.04 |
| **Scale Range** | 0.008-0.15 | 0.02-0.25 |
| **Default Rotation** | 0° | 0° |
| **Storage Key** | `useEyeGem` | `useNoseStud` |
| **Reference** | `nosePiercingRef` | `noseStudRef` |

