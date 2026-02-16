# Webcam Save All & ZIP Implementation Guide

This document contains all code needed to implement the "Save All as ZIP" functionality with 50-image storage limit and confirmation popups in your webcam app.

---

## 1. IMPORTS (Add to top of file)

```jsx
import JSZip from 'jszip'
```

---

## 2. STATE VARIABLES (Add to your component)

```jsx
const [showStorageLimitModal, setShowStorageLimitModal] = useState(false)
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
const [isSavingZip, setIsSavingZip] = useState(false)
const [showSaveAllModal, setShowSaveAllModal] = useState(false)
```

---

## 3. STORAGE LIMIT CHECK (50 Images Max)

Add this check in your capture function (like `capturePhoto`):

```jsx
// Check if storage limit reached (50 images max)
if (capturedImages.length >= 50) {
  setShowStorageLimitModal(true)
  return
}
```

---

## 4. ZIP SAVING FUNCTIONS

### A. Save as ZIP then Delete (Downloads)

```jsx
const handleSaveAsZipThenDelete = async () => {
  playClickSound()
  setIsSavingZip(true)
  try {
    const zip = new JSZip()
    const folder = zip.folder('hiba_captures')

    // Add each image to the ZIP
    for (let i = 0; i < capturedImages.length; i++) {
      const image = capturedImages[i]
      const base64Data = image.dataUrl.split(',')[1]
      folder.file(`${image.name}.jpg`, base64Data, { base64: true })
    }

    // Generate ZIP file
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    
    // Download ZIP file
    const url = URL.createObjectURL(zipBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `hiba_captures_${Date.now()}.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // Delete all images after successful download
    handleDeleteAllImages()
  } catch (error) {
    console.error('Error creating ZIP file:', error)
    alert('Error creating ZIP file. Please try again.')
  } finally {
    setIsSavingZip(false)
  }
}
```

### B. Save All as ZIP without Deleting (Downloads)

```jsx
const handleSaveAllAsZip = async () => {
  playClickSound()
  setIsSavingZip(true)
  try {
    const zip = new JSZip()
    const folder = zip.folder('hiba_captures')

    // Add each image to the ZIP
    for (let i = 0; i < capturedImages.length; i++) {
      const image = capturedImages[i]
      const base64Data = image.dataUrl.split(',')[1]
      folder.file(`${image.name}.jpg`, base64Data, { base64: true })
    }

    // Generate ZIP file
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    
    // Download ZIP file
    const url = URL.createObjectURL(zipBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `hiba_captures_${Date.now()}.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // Close modal after successful download
    setShowSaveAllModal(false)
  } catch (error) {
    console.error('Error creating ZIP file:', error)
    alert('Error creating ZIP file. Please try again.')
  } finally {
    setIsSavingZip(false)
  }
}
```

### C. Save Trash as ZIP then Delete (Trash Tab variant)

```jsx
const handleSaveTrashAsZipThenDelete = async () => {
  playClickSound()
  setIsSavingZip(true)
  try {
    const zip = new JSZip()
    const folder = zip.folder('hiba_trash_captures')

    // Add each image to the ZIP
    for (let i = 0; i < trashedImages.length; i++) {
      const image = trashedImages[i]
      const base64Data = image.dataUrl.split(',')[1]
      folder.file(`${image.name}.jpg`, base64Data, { base64: true })
    }

    // Generate ZIP file
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    
    // Download ZIP file
    const url = URL.createObjectURL(zipBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `hiba_trash_captures_${Date.now()}.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // Clear trash after successful download
    clearAllTrash()
  } catch (error) {
    console.error('Error creating ZIP file:', error)
    alert('Error creating ZIP file. Please try again.')
  } finally {
    setIsSavingZip(false)
  }
}
```

### D. Delete All Images Function

```jsx
const handleDeleteAllImages = () => {
  playClickSound()
  setCapturedImages([])
  setImageCount(0)
  localStorage.setItem('capturedImages', JSON.stringify([]))
  setShowStorageLimitModal(false)
  setShowDeleteConfirm(false)
  setDownloadsPage(0)
}
```

---

## 5. DOWNLOADS WINDOW - ADD "SAVE ALL" BUTTON

In your Downloads Window title bar (around line 5825), add this button:

```jsx
{capturedImages.length > 1 && (
  <button 
    onClick={() => {
      playClickSound()
      setShowSaveAllModal(true)
    }}
    style={{
      padding: '2px 6px',
      cursor: 'pointer',
      fontWeight: 'bold',
      outline: 'none',
      backgroundColor: '#c0c0c0',
      border: '2px solid',
      borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
      fontSize: '11px',
      color: '#000080'
    }}
  >
    💾 Save All
  </button>
)}
```

---

## 6. TRASH WINDOW - ADD "SAVE ALL" & "SAVE AS ZIP" BUTTONS

In your Trash Window title bar, add these buttons:

```jsx
{trashedImages.length > 0 && (
  <>
    <button 
      onClick={() => {
        playClickSound()
        setShowSaveAllModal(true)  // For trash, show same modal or create separate one
      }}
      style={{
        padding: '2px 6px',
        cursor: 'pointer',
        fontWeight: 'bold',
        backgroundColor: '#c0c0c0',
        border: '2px solid',
        borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
        fontSize: '11px'
      }}
    >
      💾 Save All
    </button>
    <button 
      onClick={handleSaveTrashAsZipThenDelete}
      disabled={isSavingZip}
      style={{
        padding: '2px 6px',
        cursor: isSavingZip ? 'not-allowed' : 'pointer',
        fontWeight: 'bold',
        backgroundColor: '#c0c0c0',
        border: '2px solid',
        borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
        fontSize: '11px',
        opacity: isSavingZip ? 0.6 : 1
      }}
    >
      {isSavingZip ? '⏳ Saving...' : '💾 Save & Clear'}
    </button>
  </>
)}
```

---

## 7. STORAGE LIMIT MODAL (Complete JSX)

This modal appears when user tries to capture the 51st image while already having 50:

```jsx
{showStorageLimitModal && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000
  }}>
    <div style={{
      backgroundColor: '#c0c0c0',
      border: '2px solid',
      borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
      boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040, inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
      width: '450px',
      padding: '10px',
      fontFamily: 'MS Sans Serif, Arial, sans-serif',
      fontSize: '11px'
    }}>
      {/* Title bar */}
      <div style={{
        background: 'linear-gradient(to right, #000080, #1084d7)',
        color: '#ffff00',
        padding: '2px 4px',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: '-10px',
        marginRight: '-10px',
        marginTop: '-10px',
        paddingLeft: '4px',
        paddingRight: '4px'
      }}>
        <div style={{ fontWeight: 'bold' }}>⚠️ Storage Capacity Reached</div>
        <button
          onClick={() => setShowStorageLimitModal(false)}
          style={{
            padding: '2px 6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            backgroundColor: '#d85c5c',
            border: 'none',
            outline: 'none',
            color: '#ffffff'
          }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{ marginBottom: '15px', lineHeight: '1.6' }}>
        <p>You have reached the 50 image local storage capacity.</p>
        <p>Please choose one of the following options:</p>
      </div>

      {/* Confirmation Dialog for Delete */}
      {showDeleteConfirm && (
        <div style={{
          backgroundColor: '#e0e0e0',
          border: '1px solid #808080',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '2px'
        }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>⚠️ Are you sure?</p>
          <p style={{ margin: '0 0 10px 0' }}>All images will be lost forever and cannot be recovered.</p>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button
              onClick={() => {
                playClickSound()
                setShowDeleteConfirm(false)
              }}
              style={{
                flex: 1,
                padding: '4px 10px',
                cursor: 'pointer',
                backgroundColor: '#c0c0c0',
                border: '2px solid',
                borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                fontWeight: 'bold',
                fontSize: '11px',
                color: '#000080'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAllImages}
              style={{
                flex: 1,
                padding: '4px 10px',
                cursor: 'pointer',
                backgroundColor: '#c0c0c0',
                border: '2px solid',
                borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                fontWeight: 'bold',
                fontSize: '11px',
                color: '#000080'
              }}
            >
              Yes, Delete All
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!showDeleteConfirm && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => {
              playClickSound()
              setShowDeleteConfirm(true)
            }}
            disabled={isSavingZip}
            style={{
              padding: '10px',
              cursor: isSavingZip ? 'not-allowed' : 'pointer',
              backgroundColor: '#c0c0c0',
              border: '2px solid',
              borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
              fontWeight: 'bold',
              fontSize: '11px',
              opacity: isSavingZip ? 0.6 : 1,
              textAlign: 'left',
              paddingLeft: '12px',
              color: '#000080'
            }}
          >
            🗑️ Delete All Downloads
          </button>
          <button
            onClick={handleSaveAsZipThenDelete}
            disabled={isSavingZip}
            style={{
              padding: '10px',
              cursor: isSavingZip ? 'not-allowed' : 'pointer',
              backgroundColor: '#c0c0c0',
              border: '2px solid',
              borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
              fontWeight: 'bold',
              fontSize: '11px',
              opacity: isSavingZip ? 0.6 : 1,
              textAlign: 'left',
              paddingLeft: '12px',
              color: '#000080'
            }}
          >
            {isSavingZip ? '⏳ Creating ZIP...' : '💾 Save as ZIP then Delete'}
          </button>
        </div>
      )}
    </div>
  </div>
)}
```

---

## 8. SAVE ALL MODAL (Complete JSX)

This modal appears when user clicks "Save All" in Downloads:

```jsx
{showSaveAllModal && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2001
  }}>
    <div style={{
      backgroundColor: '#c0c0c0',
      border: '2px solid',
      borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
      boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040, inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
      width: '400px',
      padding: '10px',
      fontFamily: 'MS Sans Serif, Arial, sans-serif',
      fontSize: '11px'
    }}>
      {/* Title bar */}
      <div style={{
        background: 'linear-gradient(to right, #000080, #1084d7)',
        color: '#ffff00',
        padding: '2px 4px',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: '-10px',
        marginRight: '-10px',
        marginTop: '-10px',
        paddingLeft: '4px',
        paddingRight: '4px'
      }}>
        <div style={{ fontWeight: 'bold' }}>Save All Images</div>
        <button
          onClick={() => {
            playClickSound()
            setShowSaveAllModal(false)
          }}
          style={{
            padding: '2px 6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            backgroundColor: '#d85c5c',
            border: 'none',
            outline: 'none',
            color: '#ffffff'
          }}
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{ marginBottom: '15px', lineHeight: '1.6' }}>
        <p>Choose how you want to save your {capturedImages.length} image{capturedImages.length !== 1 ? 's' : ''}:</p>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={handleSaveAllAsZip}
          disabled={isSavingZip}
          style={{
            padding: '10px',
            cursor: isSavingZip ? 'not-allowed' : 'pointer',
            backgroundColor: '#c0c0c0',
            border: '2px solid',
            borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
            fontWeight: 'bold',
            fontSize: '11px',
            opacity: isSavingZip ? 0.6 : 1,
            textAlign: 'left',
            paddingLeft: '12px',
            color: '#000080'
          }}
        >
          {isSavingZip ? '⏳ Creating ZIP...' : '💾 Download as ZIP'}
        </button>
        <button
          onClick={() => {
            playClickSound()
            setShowSaveAllModal(false)
          }}
          style={{
            padding: '10px',
            cursor: 'pointer',
            backgroundColor: '#c0c0c0',
            border: '2px solid',
            borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
            fontWeight: 'bold',
            fontSize: '11px',
            textAlign: 'left',
            paddingLeft: '12px',
            color: '#000080'
          }}
        >
          ✕ Cancel
        </button>
      </div>
    </div>
  </div>
)}
```

---

## SUMMARY OF FEATURES

✅ **50 Image Storage Limit** - Prevents exceeding browser storage capacity
✅ **Storage Limit Popup** - Shows when user hits limit with 2 options
✅ **Option 1: Delete All** - Clears downloads to make space
✅ **Option 2: Save as ZIP then Delete** - Saves all images in one ZIP file, then clears
✅ **Save All Button** - In Downloads tab to save all without deleting
✅ **Trash Integration** - Same functionality available in Trash tab
✅ **ZIP Export** - Creates `hiba_captures_[timestamp].zip` with all images
✅ **Progress Indicator** - Shows "⏳ Creating ZIP..." while saving

---

## IMPLEMENTATION CHECKLIST

- [ ] Add JSZip import at top
- [ ] Add all 4 state variables
- [ ] Add storage limit check (50 images) in capture function
- [ ] Add `handleSaveAsZipThenDelete` function
- [ ] Add `handleSaveAllAsZip` function
- [ ] Add `handleSaveTrashAsZipThenDelete` function
- [ ] Add `handleDeleteAllImages` function
- [ ] Add "Save All" button to Downloads window
- [ ] Add "Save All" & "Save & Clear" buttons to Trash window
- [ ] Add Storage Limit Modal JSX
- [ ] Add Save All Modal JSX
- [ ] Test with 50+ capture attempts
- [ ] Test ZIP download functionality
- [ ] Test delete with confirmation
- [ ] Test trash functionality

