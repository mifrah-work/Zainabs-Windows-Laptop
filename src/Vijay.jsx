import { useEffect, useRef, useState } from 'react'
import { useSpring, animated } from '@react-spring/web'
import html2canvas from 'html2canvas'
import JSZip from 'jszip'
import LoginPage from './LoginPage'

// App title constant
const APP_TITLE = "Hiba's Windows Laptop"

import vijayImg from './assets/vijay.png'
import bgImage from './assets/bg.png'
import clickSound from './assets/click.mp3'
import cameraSnapSound from './assets/camera_snap.mp3'
import windowsOpeningSound from './assets/windows_opening.mp3'
import musicEnnamoYeadho from './assets/music/Ennamo_Yeadho.mp3'
import musicGoogleGoogle from './assets/music/Google_Google.mp3'
import musicKandaangiKandaangi from './assets/music/Kandaangi_Kandaangi.mp3'
import musicKangalIrandal from './assets/music/Kangal_Irandal.mp3'
import musicKannazhaga from './assets/music/Kannazhaga.mp3'
import musicMunbaeVaa from './assets/music/Munbae_Vaa.mp3'
import musicOhPenne from './assets/music/Oh_Penne.mp3'
import musicTujheDekhaTa from './assets/music/Tujhe_Dekha_To.mp3'
import musicVaseegara from './assets/music/Vaseegara.mp3'
import cursorImg from './assets/cursor.svg'
import emptyBinImg from './assets/empty_bin.webp'
import fullBinImg from './assets/Recycle_bin_full.webp'
import trashSound from './assets/trash.mp3'
import heartFilterImg from './assets/heart_filter.png'
import profilePicture from './assets/profile_picture.png'
import windowsStartImg from './assets/windows_start.png'
import videoFile from './assets/video.mp4'
import coverEnnamoYeadho from './assets/music/album_covers/Ennamo_Yeadho.png'
import coverGoogleGoogle from './assets/music/album_covers/Google_Google.png'
import coverKandaangiKandaangi from './assets/music/album_covers/Kandaangi_Kandaangi.png'
import coverKangalIrandal from './assets/music/album_covers/Kangal_Irandal.png'
import coverKannazhaga from './assets/music/album_covers/Kannazhaga.png'
import coverMunbaeVaa from './assets/music/album_covers/Munbae_Vaa.jpg'
import coverOhPenne from './assets/music/album_covers/Oh_Penne.png'
import coverTujheDekhaTa from './assets/music/album_covers/Tujhe_Dekha_To.png'
import coverVaseegara from './assets/music/album_covers/Vaseegara.png'
import photo1 from './assets/photos/1.png'
import photo2 from './assets/photos/2.png'
import photo3 from './assets/photos/3.png'
import photo4 from './assets/photos/4.png'
import photo5 from './assets/photos/5.png'
import photo6 from './assets/photos/6.png'
import photo7 from './assets/photos/7.png'
import photo8 from './assets/photos/8.png'
import photo9 from './assets/photos/9.png'
import photo10 from './assets/photos/10.png'
import photo11 from './assets/photos/11.png'

// Playlist data
const PLAYLIST = [
  {
    title: 'Google Google',
    file: musicGoogleGoogle
  },
  {
    title: 'Ennamo Yeadho',
    file: musicEnnamoYeadho
  },
  {
    title: 'Kandaangi Kandaangi',
    file: musicKandaangiKandaangi
  },
  {
    title: 'Kangal Irandal',
    file: musicKangalIrandal
  },
  {
    title: 'Kannazhaga',
    file: musicKannazhaga
  },
  {
    title: 'Munbae Vaa',
    file: musicMunbaeVaa
  },
  {
    title: 'Oh Penne',
    file: musicOhPenne
  },
  {
    title: 'Tujhe Dekha To',
    file: musicTujheDekhaTa
  },
  {
    title: 'Vaseegara',
    file: musicVaseegara
  }
]
import './App.css'

// Music cover images array
const MUSIC_COVERS = [coverGoogleGoogle, coverEnnamoYeadho, coverKandaangiKandaangi, coverKangalIrandal, coverKannazhaga, coverMunbaeVaa, coverOhPenne, coverTujheDekhaTa, coverVaseegara]

// Gallery photos array
const GALLERY_PHOTOS = [photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9, photo10, photo11]

function App() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const overlayImageRef = useRef(null)
  const heartFilterRef = useRef(null)
  const bowFilterRef = useRef(null)
  const nosePiercingRef = useRef(null)
  const noseStudRef = useRef(null)
  const borderRef = useRef(null)
  const faceLandmarkerRef = useRef(null)
  const animationIdRef = useRef(null)
  const clickAudioRef = useRef(null)
  const trashAudioRef = useRef(null)
  const cameraSnapAudioRef = useRef(null)
  const windowsOpeningAudioRef = useRef(null)
  const imageCountRef = useRef(0)
  const captureCounterRef = useRef(0)  // Tracks total captures ever made (never decreases)
  const isCapturingRef = useRef(false)  // Prevent concurrent captures
  const expressionFrameCounterRef = useRef(0)  // Tracks consecutive frames with same expression
  const lastExpressionRef = useRef('eyes_looking_away')  // Tracks last stable expression
  const hasActiveExpressionRef = useRef(false)  // Tracks if we're in a non-default expression
  const eyesWereClosedRef = useRef(false)  // Tracks if eyes were just closed (for blink detection)
  const musicSliderRef = useRef(null)
  const frameCounterRef = useRef(0)  // Tracks frame number for animated grain
  const detectedFaceCountRef = useRef(0)  // Tracks current face count for notifications
  const handLandmarkerRef = useRef(null)
  const currentVijayPoseRef = useRef('default')
  const cachedVijayImagesRef = useRef({}) // Cache loaded images
  const hasActivePoseRef = useRef(false) // Tracks if we have an active hand pose
  const lastDetectedPoseRef = useRef(null) // Track last detected pose for debouncing
  const poseFrameCounterRef = useRef(0) // Debounce frame counter for pose stability
  const eyeStateRef = useRef(false) // Track blink state for hand poses
  const vijayPoseImagesRef = useRef({
    default: new URL('./assets/vijay_filters/vijay.png', import.meta.url).href,
    hands_up: new URL('./assets/vijay_filters/hands_up.png', import.meta.url).href,
    thumbs_up: new URL('./assets/vijay_filters/thumbs_up.png', import.meta.url).href,
    hand_under_chin: new URL('./assets/vijay_filters/hand_under_chin.png', import.meta.url).href
  })

  // State for overlay positioning
  const [offsetX, setOffsetX] = useState(() => {
    const saved = localStorage.getItem('vijayOffsetX')
    return saved !== null ? JSON.parse(saved) : -22
  })
  const [offsetY, setOffsetY] = useState(() => {
    const saved = localStorage.getItem('vijayOffsetY')
    return saved !== null ? JSON.parse(saved) : -289
  })
  const [scale, setScale] = useState(() => {
    const saved = localStorage.getItem('vijayScale')
    return saved !== null ? JSON.parse(saved) : 1.6
  })
  const [rotation, setRotation] = useState(() => {
    const saved = localStorage.getItem('vijayRotation')
    return saved !== null ? JSON.parse(saved) : 0
  })
  
  // State for bow filter positioning
  const [bowOffsetX, setBowOffsetX] = useState(0)
  const [bowOffsetY, setBowOffsetY] = useState(10)
  const [bowScale, setBowScale] = useState(0.2)
  const [bowRotation, setBowRotation] = useState(20)
  
  // State for eye gem positioning
  const [eyeGemOffsetX, setEyeGemOffsetX] = useState(5)
  const [eyeGemOffsetY, setEyeGemOffsetY] = useState(2)
  const [eyeGemScale, setEyeGemScale] = useState(0.015)
  const [eyeGemRotation, setEyeGemRotation] = useState(0)
  
  // State for nose stud positioning (on right nostril)
  const [noseStudOffsetX, setNoseStudOffsetX] = useState(8)
  const [noseStudOffsetY, setNoseStudOffsetY] = useState(-5)
  const [noseStudScale, setNoseStudScale] = useState(0.04)
  const [noseStudRotation, setNoseStudRotation] = useState(0)
  
  const [isWebcamActive, setIsWebcamActive] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [showAbout, setShowAbout] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showDesktop, setShowDesktop] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [capturedImages, setCapturedImages] = useState([])
  const [imageCount, setImageCount] = useState(0)
  const [showDownloadsFolder, setShowDownloadsFolder] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedTrashImage, setSelectedTrashImage] = useState(null)
  const [imageToDelete, setImageToDelete] = useState(null)
  const [downloadsPage, setDownloadsPage] = useState(0)
  const [trashPage, setTrashPage] = useState(0)
  const [captureNotification, setCaptureNotification] = useState(null)
  const [captureNotificationMessage, setCaptureNotificationMessage] = useState('✓ Image Captured!')
  const [notificationMessageIndex, setNotificationMessageIndex] = useState(0)
  const [showMusicPlayer, setShowMusicPlayer] = useState(false)
  const [isMusciPlaying, setIsMusicPlaying] = useState(false)
  const [showVijayOverlay, setShowVijayOverlay] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [trashedImages, setTrashedImages] = useState([])
  const [showTrash, setShowTrash] = useState(false)
  const [imageToDeletePermanently, setImageToDeletePermanently] = useState(null)
  const [confirmClearTrash, setConfirmClearTrash] = useState(false)
  const [showSaveOptions, setShowSaveOptions] = useState(false)
  const [sliderPosition, setSliderPosition] = useState(0)
  const [isDraggingSlider, setIsDraggingSlider] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [audioCurrentTime, setAudioCurrentTime] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  const [replayCurrentSong, setReplayCurrentSong] = useState(false)
  const bgMusicRef = useRef(null)
  const imageModalRef = useRef(null)
  const [dragState, setDragState] = useState(null)
  const [draggedImageId, setDraggedImageId] = useState(null)
  const [dragImageSource, setDragImageSource] = useState(null)
  const [dragImagePos, setDragImagePos] = useState({ x: 0, y: 0 })
  const [vijayOverlayPos, setVijayOverlayPos] = useState({ x: 350, y: -4 })
const [downloadsPos, setDownloadsPos] = useState({ x: 48, y: 485 })
  const [musicPlayerPos, setMusicPlayerPos] = useState({ x: 1192, y: 575 })
  const [controlsWindowPos, setControlsWindowPos] = useState({ x: 855, y: 355 })
  const [trashPos, setTrashPos] = useState({ x: 250, y: 650 })
  const [videoPos, setVideoPos] = useState({ x: 1180, y: 5 })
  const [captureNotificationPos, setCaptureNotificationPos] = useState({ x: 400, y: 200 })
  const [showGallery, setShowGallery] = useState(false)
  const [galleryPos, setGalleryPos] = useState({ x: 900, y: 475 })
  const [showStorageLimitModal, setShowStorageLimitModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isSavingZip, setIsSavingZip] = useState(false)
  const [showSaveAllModal, setShowSaveAllModal] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [galleryImagesLoaded, setGalleryImagesLoaded] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('isLoggedIn')
    return saved ? JSON.parse(saved) : false
  })
  const [bgImagesLoaded, setBgImagesLoaded] = useState(false)
  const [bgImageLoaded, setBgImageLoaded] = useState(false)
  const [currentFilter, setCurrentFilter] = useState(() => {
    const saved = localStorage.getItem('currentFilter')
    return saved ? JSON.parse(saved) : 'normal'
  })
  const [useHeartFilter, setUseHeartFilter] = useState(() => {
    const saved = localStorage.getItem('useHeartFilter')
    return saved ? JSON.parse(saved) : false
  })
  const [useBowFilter, setUseBowFilter] = useState(() => {
    const saved = localStorage.getItem('useBowFilter')
    return saved ? JSON.parse(saved) : false
  })
  const [useEyeGem, setUseEyeGem] = useState(() => {
    const saved = localStorage.getItem('useEyeGem')
    return saved ? JSON.parse(saved) : false
  })
  const [useNoseStud, setUseNoseStud] = useState(() => {
    const saved = localStorage.getItem('useNoseStud')
    return saved ? JSON.parse(saved) : false
  })
  const [use4Grid, setUse4Grid] = useState(() => {
    const saved = localStorage.getItem('use4Grid')
    return saved ? JSON.parse(saved) : false
  })
  const [useGrain, setUseGrain] = useState(() => {
    const saved = localStorage.getItem('useGrain')
    return saved ? JSON.parse(saved) : true
  })
  const [currentBorder, setCurrentBorder] = useState(() => {
    const saved = localStorage.getItem('currentBorder')
    return saved ? JSON.parse(saved) : 'none'
  })
  const [showVijayImage, setShowVijayImage] = useState(() => {
    const saved = localStorage.getItem('showVijayImage')
    return saved ? JSON.parse(saved) : true
  })
  const [disableHandTracking, setDisableHandTracking] = useState(() => {
    const saved = localStorage.getItem('disableHandTracking')
    return saved ? JSON.parse(saved) : false
  })
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [timerOption, setTimerOption] = useState(() => {
    const saved = localStorage.getItem('captureTimerOption')
    return saved ? JSON.parse(saved) : 'none'
  })
  const [showTimerDropdown, setShowTimerDropdown] = useState(false)
  const [countdownValue, setCountdownValue] = useState(0)
  const countdownIntervalRef = useRef(null)

  // Fade in animation
  const fadeProps = useSpring({ opacity: 1, from: { opacity: 0 } })

  // Update bgImagesLoaded when background image is loaded
  useEffect(() => {
    if (bgImageLoaded) {
      setBgImagesLoaded(true)
    }
  }, [bgImageLoaded])

  // Load captured images from localStorage on mount
  useEffect(() => {
    const savedImages = localStorage.getItem('capturedImages')
    if (savedImages) {
      try {
        const images = JSON.parse(savedImages)
        setCapturedImages(images)
        setImageCount(images.length)
        imageCountRef.current = images.length
      } catch (error) {
        console.error('Error loading saved images:', error)
      }
    }
    // Load capture counter from localStorage
    const savedCaptureCounter = localStorage.getItem('captureCounter')
    if (savedCaptureCounter) {
      try {
        captureCounterRef.current = parseInt(savedCaptureCounter, 10)
      } catch (error) {
        console.error('Error loading capture counter:', error)
        captureCounterRef.current = 0
      }
    }
    // Load trashed images from localStorage
    const savedTrashedImages = localStorage.getItem('trashedImages')
    if (savedTrashedImages) {
      try {
        const trashedImgs = JSON.parse(savedTrashedImages)
        setTrashedImages(trashedImgs)
      } catch (error) {
        console.error('Error loading trashed images:', error)
      }
    }
    // Load window positions from sessionStorage (session-only, resets on page reload/tab close)
    const savedWindowPositions = sessionStorage.getItem('windowPositions')
    if (savedWindowPositions) {
      try {
        const positions = JSON.parse(savedWindowPositions)
        if (positions.vijayOverlayPos) setVijayOverlayPos(positions.vijayOverlayPos)
        if (positions.downloadsPos) setDownloadsPos(positions.downloadsPos)
        if (positions.musicPlayerPos) setMusicPlayerPos(positions.musicPlayerPos)
        if (positions.controlsWindowPos) setControlsWindowPos(positions.controlsWindowPos)
        if (positions.trashPos) setTrashPos(positions.trashPos)
        if (positions.videoPos) setVideoPos(positions.videoPos)
        if (positions.galleryPos) setGalleryPos(positions.galleryPos)
        if (positions.captureNotificationPos) setCaptureNotificationPos(positions.captureNotificationPos)
      } catch (error) {
        console.error('Error loading window positions:', error)
      }
    }
  }, [])

  // Persist login state to localStorage
  useEffect(() => {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn))
  }, [isLoggedIn])

  // Persist current filter to localStorage
  useEffect(() => {
    localStorage.setItem('currentFilter', JSON.stringify(currentFilter))
  }, [currentFilter])

  // Persist window positions to sessionStorage (session-only, resets on page reload/tab close)
  useEffect(() => {
    const windowPositions = {
      vijayOverlayPos,
      downloadsPos,
      musicPlayerPos,
      controlsWindowPos,
      trashPos,
      videoPos,
      galleryPos,
      captureNotificationPos,
    }
    sessionStorage.setItem('windowPositions', JSON.stringify(windowPositions))
  }, [vijayOverlayPos, downloadsPos, musicPlayerPos, controlsWindowPos, trashPos, videoPos, galleryPos, captureNotificationPos])

  // Persist 4-grid toggle to localStorage
  useEffect(() => {
    localStorage.setItem('use4Grid', JSON.stringify(use4Grid))
  }, [use4Grid])

  // Persist grain toggle to localStorage
  useEffect(() => {
    localStorage.setItem('useGrain', JSON.stringify(useGrain))
  }, [useGrain])

  // Persist Vijay position to localStorage
  useEffect(() => {
    localStorage.setItem('vijayOffsetX', JSON.stringify(offsetX))
  }, [offsetX])

  useEffect(() => {
    localStorage.setItem('vijayOffsetY', JSON.stringify(offsetY))
  }, [offsetY])

  useEffect(() => {
    localStorage.setItem('vijayScale', JSON.stringify(scale))
  }, [scale])

  useEffect(() => {
    localStorage.setItem('vijayRotation', JSON.stringify(rotation))
  }, [rotation])

  // Persist heart filter toggle to localStorage
  useEffect(() => {
    localStorage.setItem('useHeartFilter', JSON.stringify(useHeartFilter))
  }, [useHeartFilter])

  // Persist bow filter toggle to localStorage
  useEffect(() => {
    localStorage.setItem('useBowFilter', JSON.stringify(useBowFilter))
  }, [useBowFilter])

  // Persist eye gem toggle to localStorage
  useEffect(() => {
    localStorage.setItem('useEyeGem', JSON.stringify(useEyeGem))
  }, [useEyeGem])

  // Persist nose stud toggle to localStorage
  useEffect(() => {
    localStorage.setItem('useNoseStud', JSON.stringify(useNoseStud))
  }, [useNoseStud])

  // Persist current border to localStorage
  useEffect(() => {
    localStorage.setItem('currentBorder', JSON.stringify(currentBorder))
  }, [currentBorder])

  // Persist vijay image toggle to localStorage
  useEffect(() => {
    localStorage.setItem('showVijayImage', JSON.stringify(showVijayImage))
  }, [showVijayImage])

  // Persist disable hand tracking toggle to localStorage
  useEffect(() => {
    localStorage.setItem('disableHandTracking', JSON.stringify(disableHandTracking))
  }, [disableHandTracking])

  // Persist timer option to localStorage
  useEffect(() => {
    localStorage.setItem('captureTimerOption', JSON.stringify(timerOption))
  }, [timerOption])

  // Keep imageCountRef in sync with imageCount state
  useEffect(() => {
    imageCountRef.current = imageCount
  }, [imageCount])

  // Ensure Controls stays closed when logged in
  useEffect(() => {
    if (isLoggedIn) {
      setShowControls(false)
    }
  }, [isLoggedIn])

  // Close controls when Vijay image is disabled
  useEffect(() => {
    if (!showVijayImage && showControls) {
      setShowControls(false)
    }
  }, [showVijayImage])

  // Set controls window position based on whether video window is open
  useEffect(() => {
    if (!showVideo) {
      // Video window not open - match video window's default position
      setControlsWindowPos({ x: 1180, y: 5 })
    } else {
      // Video window is open - use controls default position
      setControlsWindowPos({ x: 855, y: 355 })
    }
  }, [showVideo])

  // Cheek and jawline landmark indices from MediaPipe Face Landmarker
  // Left cheek: index 234, Right cheek: index 454
  // Left jawline: index 206, Right shoulder: index 12
  const LEFT_CHEEK_INDEX = 234
  const RIGHT_CHEEK_INDEX = 454
  const LEFT_JAWLINE_INDEX = 206
  const RIGHT_SHOULDER_INDEX = 12

  // Initialize MediaPipe Face Landmarker
  useEffect(() => {
    const initializeFaceLandmarker = async () => {
      try {
        const visionModule = await import(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8'
        )

        const { FilesetResolver, FaceLandmarker, HandLandmarker } = visionModule

        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.8/wasm'
        )

        const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
          },
          runningMode: 'VIDEO',
          numFaces: 10,
        })

        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          },
          runningMode: 'VIDEO',
          numHands: 2,
        })

        faceLandmarkerRef.current = faceLandmarker
        handLandmarkerRef.current = handLandmarker
        console.log('Face and Hand Landmarkers initialized')

      } catch (err) {
        console.error(err)
      }
    }

    initializeFaceLandmarker()

    // Add keyboard shortcuts
    const handleKeyPress = (e) => {
      if (e.key === 'c' || e.key === 'C') {
        playClickSound()
        setShowControls((prev) => !prev)
      }
      // Spacebar to pause/play music
      if (e.code === 'Space') {
        e.preventDefault()
        playClickSound()
        // Check directly from the audio element instead of state
        if (bgMusicRef.current && !bgMusicRef.current.paused) {
          bgMusicRef.current.pause()
          setIsMusicPlaying(false)
        } else if (bgMusicRef.current) {
          bgMusicRef.current.play()
          setIsMusicPlaying(true)
        }
      }
      // Right arrow to skip to next song
      if (e.code === 'ArrowRight') {
        e.preventDefault()
        handleNextSong()
      }
      // Left arrow to go to previous song
      if (e.code === 'ArrowLeft') {
        e.preventDefault()
        handlePreviousSong()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close()
      }
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  // Listen to audio play/pause events to update UI
  useEffect(() => {
    const attachListeners = () => {
      const audioElement = bgMusicRef.current
      
      if (!audioElement) {
        // Ref not ready yet, try again in 500ms
        setTimeout(attachListeners, 500)
        return
      }

      const handlePlay = () => setIsMusicPlaying(true)
      const handlePause = () => setIsMusicPlaying(false)
      const handleTimeUpdate = () => setAudioCurrentTime(audioElement.currentTime)
      const handleLoadedMetadata = () => {
        setAudioDuration(audioElement.duration || 0)
        setAudioCurrentTime(audioElement.currentTime)
      }

      audioElement.addEventListener('play', handlePlay)
      audioElement.addEventListener('pause', handlePause)
      audioElement.addEventListener('timeupdate', handleTimeUpdate)
      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata)

      return () => {
        audioElement.removeEventListener('play', handlePlay)
        audioElement.removeEventListener('pause', handlePause)
        audioElement.removeEventListener('timeupdate', handleTimeUpdate)
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata)
      }
    }
    
    // Start checking after 0ms (next tick)
    const timeoutId = setTimeout(attachListeners, 0)
    
    return () => clearTimeout(timeoutId)
  }, [])

  // Preload critical overlay image immediately
  useEffect(() => {
    const vijayImg_ = new Image()
    vijayImg_.src = vijayImg
    vijayImg_.onload = () => {
      overlayImageRef.current = vijayImg_
      console.log('Vijay image preloaded')
    }
    vijayImg_.onerror = () => {
      console.error('Failed to preload Vijay overlay image')
      setCameraError('Failed to load Vijay overlay image')
    }
  }, [])

  // Load overlay images and preload assets
  useEffect(() => {
    // Always load heart filter
    const heartImg = new Image()
    heartImg.src = heartFilterImg
    heartImg.onload = () => {
      heartFilterRef.current = heartImg
    }
    heartImg.onerror = () => {
      console.error('Failed to load heart filter image')
    }

    // Preload logos
    const preloadImage = (src) => {
      const img = new Image()
      img.src = src
    }

    // Load bow filter
    const bowImg = new Image()
    bowImg.src = new URL('./assets/bow.png', import.meta.url).href
    bowImg.onload = () => {
      bowFilterRef.current = bowImg
    }
    bowImg.onerror = () => {
      console.error('Failed to load bow filter image')
    }

    // Load eye gem (nose piercing stud on left nostril)
    const eyeGemImg = new Image()
    eyeGemImg.src = new URL('./assets/stud.png', import.meta.url).href
    eyeGemImg.onload = () => {
      nosePiercingRef.current = eyeGemImg
    }
    eyeGemImg.onerror = () => {
      console.error('Failed to load eye gem image')
    }

    // Load nose stud
    const noseStudImg = new Image()
    noseStudImg.src = new URL('./assets/nose_stud.png', import.meta.url).href
    noseStudImg.onload = () => {
      noseStudRef.current = noseStudImg
    }
    noseStudImg.onerror = () => {
      console.error('Failed to load nose stud image')
    }

    // Preload Vijay image
    const vijayImage = new Image()
    vijayImage.src = new URL('./assets/vijay.png', import.meta.url).href
    vijayImage.onload = () => {
      overlayImageRef.current = vijayImage
    }
    vijayImage.onerror = () => {
      console.error('Failed to load vijay.png')
    }
  }, [])

  // Preload all borders once on mount
  const borderMap = {
    bow: new URL('./assets/borders/bow.png', import.meta.url).href,
    cat: new URL('./assets/borders/cat.png', import.meta.url).href,
    gem_biscuit: new URL('./assets/borders/gem_biscuit.png', import.meta.url).href,
    malligapoo: new URL('./assets/borders/malligapoo.png', import.meta.url).href,
    miffy: new URL('./assets/borders/miffy.png', import.meta.url).href,
    rajini: new URL('./assets/borders/rajini.png', import.meta.url).href,
    sari: new URL('./assets/borders/sari.png', import.meta.url).href,
    thali: new URL('./assets/borders/thali.png', import.meta.url).href,
    chai: new URL('./assets/borders/chai.png', import.meta.url).href
  }

  useEffect(() => {
    // Preload all borders once at startup
    Object.values(borderMap).forEach((borderSrc) => {
      const borderImg = new Image()
      borderImg.src = borderSrc
    })
  }, [])

  // Switch to selected border when currentBorder changes
  useEffect(() => {
    if (currentBorder !== 'none') {
      borderRef.current = null
      
      const borderImg = new Image()
      borderImg.src = borderMap[currentBorder]
      borderImg.onload = () => {
        borderRef.current = borderImg
      }
      borderImg.onerror = () => {
        console.error(`Failed to load border image: ${currentBorder}`)
      }
    } else {
      borderRef.current = null
    }
  }, [currentBorder])

  // Start webcam
  const startWebcam = async () => {
    try {
      setCameraError(null)
      console.log('Requesting camera access...')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      console.log('Camera stream obtained:', stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        console.log('Stream assigned to video element')
        const playPromise = videoRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('Video play error:', error)
            setCameraError(`Video play error: ${error.message}`)
          })
        }
        setIsWebcamActive(true)
        console.log('Webcam activated')
      }
    } catch (error) {
      console.error('Error accessing webcam:', error)
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      let errorMsg = 'Could not access webcam. Please check permissions.'
      if (error.name === 'NotAllowedError') {
        errorMsg = 'Camera permission denied. Please allow camera access in your browser settings.'
      } else if (error.name === 'NotFoundError') {
        errorMsg = 'No camera found on this device.'
      } else if (error.name === 'NotReadableError') {
        errorMsg = 'Camera is already in use by another application.'
      }
      setCameraError(errorMsg)
      setIsWebcamActive(false)
    }
  }

  // Stop webcam
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null  // Release the stream completely
      setIsWebcamActive(false)
    }
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current)
    }
    // Clear canvas to black
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  // Convert normalized landmark coordinates to canvas pixel coordinates
  const normalizedToCanvasCoordinates = (
    normalizedX,
    normalizedY,
    canvasWidth,
    canvasHeight
  ) => {
    // Mirror X coordinate for webcam (since it's mirrored)
    const pixelX = (1 - normalizedX) * canvasWidth
    const pixelY = normalizedY * canvasHeight
    return { pixelX, pixelY }
  }

  // Add realistic film grain texture to canvas with performance optimization
  const addGrainTexture = (canvas, ctx, intensity = 0.12, frameOffset = 0) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const length = data.length
    
    // Pseudo-random function based on position and frame for animated grain
    const seededRandom = (x, y, frame) => {
      const n = Math.sin(x * 12.9898 + y * 78.233 + frame * 43758.5453) * 43758.5453
      return n - Math.floor(n)
    }
    
    // Process pixels with reduced grain for softer, more realistic appearance
    for (let i = 0; i < length; i += 4) {
      // Calculate position for seeded randomness
      const pixelIndex = i / 4
      const y = Math.floor(pixelIndex / canvas.width)
      const x = pixelIndex % canvas.width
      
      // Generate monochrome grain with softer distribution
      // Combine seeded random with frame offset for animation
      const random1 = seededRandom(x, y, frameOffset)
      const random2 = seededRandom(x + 1, y + 1, frameOffset)
      
      // Create softer, more natural-looking grain with slight bias toward center
      const noise = (random1 + random2 - 1) * 0.5  // Average for smoother grain
      const grain = noise * 255 * intensity
      
      // Apply monochrome grain with clamping to prevent blown-out highlights/crushed blacks
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      data[i] = Math.max(0, Math.min(255, r + grain))       // Red
      data[i + 1] = Math.max(0, Math.min(255, g + grain))   // Green
      data[i + 2] = Math.max(0, Math.min(255, b + grain))   // Blue
      // data[i + 3] remains unchanged (alpha)
    }
    
    ctx.putImageData(imageData, 0, 0)
  }

  // Detect hand pose from hand landmarks
  const detectHandPose = (handLandmarks) => {
    if (disableHandTracking) {
      return 'default'
    }
    
    if (!handLandmarks || handLandmarks.length === 0) {
      return 'default'
    }

    const hand = handLandmarks[0]
    if (!hand) return 'default'

    // Get key hand joint positions
    const wrist = hand[0]
    const thumbTip = hand[4]
    const indexTip = hand[8]
    const middleTip = hand[12]
    const ringTip = hand[16]
    const pinkyTip = hand[20]
    const palm = hand[5] // Index MCP as palm reference
    const middleHand = hand[9] // Middle MCP

    // Helper function to calculate distance between two points
    const distance = (p1, p2) => {
      return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2))
    }

    // Helper function to check if a finger is raised (tip above MCP)
    const isFingerRaised = (tipPoint, mcpPoint) => {
      return tipPoint.y < mcpPoint.y - 0.05
    }

    // Helper function to check if fingers are close together
    const areClose = (p1, p2, threshold = 0.05) => {
      return distance(p1, p2) < threshold
    }

    // Detect specific poses
    const thumbRaised = isFingerRaised(thumbTip, hand[2])
    const indexRaised = isFingerRaised(indexTip, hand[6])
    const middleRaised = isFingerRaised(middleTip, hand[10])
    const ringRaised = isFingerRaised(ringTip, hand[14])
    const pinkyRaised = isFingerRaised(pinkyTip, hand[18])

    // Count raised fingers
    const raisedCount = [thumbRaised, indexRaised, middleRaised, ringRaised, pinkyRaised].filter(Boolean).length

    // Check if hand is near face (under chin position) - more lenient detection
    const handY = wrist.y
    const handX = wrist.x
    // Hand under chin - detect if hand is in lower portion of frame (near chin area)
    const isHandUnderChin = handY > 0.55

    // Detect thumbs up (only thumb raised, hand orientation)
    if (thumbRaised && !indexRaised && !middleRaised && !ringRaised && !pinkyRaised && thumbTip.y < wrist.y - 0.1) {
      return 'thumbs_up'
    }

    // Detect hands up (2+ fingers raised)
    if (raisedCount >= 2) {
      return 'hands_up'
    }

    // Detect hand under chin (any hand position in lower area - triggers with 1+ hand)
    if (isHandUnderChin) {
      return 'hand_under_chin'
    }

    // No specific pose detected - return null to keep current pose
    return null
  }

  // Draw frame with face detection and overlay
  const drawFrame = () => {
    if (!videoRef.current || !canvasRef.current || !faceLandmarkerRef.current) {
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const video = videoRef.current

    // Set canvas size to match video
    if (canvas.width !== video.videoWidth) {
      canvas.width = video.videoWidth
    }
    if (canvas.height !== video.videoHeight) {
      canvas.height = video.videoHeight
    }

    // Always draw single frame first (video + overlays)
    // Normal single frame (mirrored for webcam effect)
    ctx.save()
    ctx.scale(-1, 1)
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
    ctx.restore()

    // Run face detection on the full video
    let topHeadLandmark = null
    let allFaceLandmarks = null
    let allDetectedFaces = []
    try {
      const results = faceLandmarkerRef.current.detectForVideo(video, Date.now())

      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        allDetectedFaces = results.faceLandmarks
        detectedFaceCountRef.current = results.faceLandmarks.length
        
        // Select the face closest to center to prevent flickering with multiple users
        let closestFaceIndex = 0
        if (results.faceLandmarks.length > 1) {
          const centerX = 0.5
          const centerY = 0.5
          let minDistance = Infinity
          
          results.faceLandmarks.forEach((faceLandmarks, index) => {
            // Use nose tip (landmark 1) as the face center
            const noseTip = faceLandmarks[1]
            if (noseTip) {
              const distance = Math.sqrt(
                Math.pow(noseTip.x - centerX, 2) + 
                Math.pow(noseTip.y - centerY, 2)
              )
              if (distance < minDistance) {
                minDistance = distance
                closestFaceIndex = index
              }
            }
          })
        }
        
        const landmarks = results.faceLandmarks[closestFaceIndex]
        allFaceLandmarks = landmarks

        // Get right shoulder position for vijay
        const shoulderLandmark = landmarks[RIGHT_SHOULDER_INDEX]
        // Get top of head position (using landmark 10 which is typically top of head)
        topHeadLandmark = landmarks[10]

        if (shoulderLandmark) {
          const { pixelX, pixelY } = normalizedToCanvasCoordinates(
            shoulderLandmark.x,
            shoulderLandmark.y,
            canvas.width,
            canvas.height
          )

          // Detect hand poses for Vijay filter
          let detectedPose = null
          let hasBlinked = false
          
          // Check for blink (eyes closed then open)
          // Use eye top/bottom landmarks for better blink detection
          const leftEyeTop = landmarks[159]
          const leftEyeBottom = landmarks[145]
          const rightEyeTop = landmarks[386]
          const rightEyeBottom = landmarks[374]
          
          if (leftEyeTop && leftEyeBottom && rightEyeTop && rightEyeBottom) {
            // Calculate eye opening distance (vertical distance between top and bottom)
            const leftEyeOpen = Math.abs(leftEyeTop.y - leftEyeBottom.y)
            const rightEyeOpen = Math.abs(rightEyeTop.y - rightEyeBottom.y)
            const avgEyeOpen = (leftEyeOpen + rightEyeOpen) / 2
            
            // Eyes are closed when opening is very small
            const eyesClosedNow = avgEyeOpen < 0.02
            // Blink detected: transition from closed to open
            hasBlinked = eyeStateRef.current && !eyesClosedNow
            eyeStateRef.current = eyesClosedNow
          }
          
          if (showVijayImage && handLandmarkerRef.current) {
            try {
              const handResults = handLandmarkerRef.current.detectForVideo(video, Date.now())
              if (handResults.landmarks && handResults.landmarks.length > 0) {
                detectedPose = detectHandPose(handResults.landmarks)
              }
            } catch (error) {
              console.error('Hand detection error:', error)
            }
          }
          
          // Apply hand pose logic similar to monkey expression detection
          // If we have an active pose and no new pose is detected, keep the active pose
          if (hasActivePoseRef.current && detectedPose === null) {
            // Only go back to default if user blinks
            if (hasBlinked) {
              hasActivePoseRef.current = false
              currentVijayPoseRef.current = 'default'
            }
            // Otherwise ignore null detection - keep the active pose
          } else if (detectedPose !== null) {
            // Mark that we have an active pose
            hasActivePoseRef.current = true
          }
          
          // Debounce pose changes for stability
          if (detectedPose === lastDetectedPoseRef.current) {
            poseFrameCounterRef.current++
          } else {
            poseFrameCounterRef.current = 1
            lastDetectedPoseRef.current = detectedPose
          }
          
          // Determine required frames for stability (null = less sensitive to avoid flicker)
          let requiredFrames = 3
          if (detectedPose === null) {
            requiredFrames = 5 // Less sensitive for null/no detection
          }
          
          // Only update pose if stable for required frames
          if (poseFrameCounterRef.current >= requiredFrames && detectedPose !== null) {
            currentVijayPoseRef.current = detectedPose
          }

          // Draw vijay image based on detected pose if enabled
          if (showVijayImage) {
            const currentPose = currentVijayPoseRef.current
            const poseImagePath = vijayPoseImagesRef.current[currentPose]
            if (poseImagePath) {
              // Check if image is already cached
              if (!cachedVijayImagesRef.current[currentPose]) {
                // Load the image if not cached
                const img = new Image()
                img.src = poseImagePath
                img.onload = () => {
                  cachedVijayImagesRef.current[currentPose] = img
                  overlayImageRef.current = img
                }
              } else {
                // Use cached image
                overlayImageRef.current = cachedVijayImagesRef.current[currentPose]
              }
            }
          }

          // Draw vijay at cheek position if enabled
          if (showVijayImage && overlayImageRef.current) {
            const img = overlayImageRef.current
            
            // Calculate dynamic scale based on face size (proximity to camera)
            // Use distance between eyes as a proxy for face size
            const leftEye = landmarks[33]  // Left eye landmark
            const rightEye = landmarks[263] // Right eye landmark
            
            let dynamicScale = scale
            if (leftEye && rightEye) {
              // Calculate eye distance in normalized coordinates
              const eyeDistance = Math.sqrt(
                Math.pow(rightEye.x - leftEye.x, 2) + 
                Math.pow(rightEye.y - rightEye.y, 2)
              )
              
              // Reference eye distance at default zoom (around 0.15 in normalized coords)
              const referenceEyeDistance = 0.15
              
              // Scale vijay proportionally to how close the user is
              // If eyes are closer together (zoomed in), face is further, scale down
              // If eyes are further apart (zoomed out), face is closer, scale up
              const proximityRatio = eyeDistance / referenceEyeDistance
              dynamicScale = scale * proximityRatio
              
              // Clamp scale between 0.3 and 3 to prevent extreme values but allow full slider range
              dynamicScale = Math.max(0.3, Math.min(3, dynamicScale))
            }
            
            const scaledWidth = img.width * dynamicScale
            const scaledHeight = img.height * dynamicScale

            const drawX = pixelX + 40 + offsetX
            const drawY = pixelY + 60 - scaledHeight / 2 + offsetY

            ctx.globalAlpha = 1
            ctx.save()
            ctx.translate(drawX + scaledWidth / 2, drawY + scaledHeight / 2)
            ctx.rotate((rotation * Math.PI) / 180)
            ctx.drawImage(
              img,
              -scaledWidth / 2,
              -scaledHeight / 2,
              scaledWidth,
              scaledHeight
            )
            ctx.restore()
            ctx.globalAlpha = 1.0
          }
        }
      }
    } catch (error) {
      console.error('Face detection error:', error)
    }

    // Apply black & white filter to entire scene
    if (currentFilter === 'blackAndWhite') {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
        data[i] = avg     // Red
        data[i + 1] = avg // Green
        data[i + 2] = avg // Blue
      }
      ctx.putImageData(imageData, 0, 0)
    }

    // Apply aesthetic filter (warm vintage tone with slight desaturation)
    if (currentFilter === 'aesthetic') {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        
        // Desaturate slightly
        const gray = (r + g + b) / 3
        data[i] = Math.min(255, r * 0.7 + gray * 0.3 + 20)        // Red - boost warm tones
        data[i + 1] = Math.min(255, g * 0.7 + gray * 0.3 + 5)     // Green
        data[i + 2] = Math.min(255, b * 0.5 + gray * 0.3 - 10)    // Blue - reduce for warmth
      }
      ctx.putImageData(imageData, 0, 0)
    }

    // Add realistic film grain texture to all frames with frame-based animation
    if (useGrain) {
      frameCounterRef.current++
      addGrainTexture(canvas, ctx, 0.12, frameCounterRef.current)
    }

    // Draw heart filter AFTER black & white and grain so it stays colored and on top
    // Apply to all detected faces
    if (useHeartFilter && heartFilterRef.current && allDetectedFaces.length > 0) {
      try {
        console.log(`Drawing hearts on ${allDetectedFaces.length} faces`)
        allDetectedFaces.forEach((faceLandmarks, faceIndex) => {
          const topHead = faceLandmarks[10] // Top of head
          const leftEye = faceLandmarks[33]  // Left eye landmark
          const rightEye = faceLandmarks[263] // Right eye landmark
          
          if (!topHead) {
            console.log(`Face ${faceIndex}: Missing topHead landmark`)
            return
          }
          
          const { pixelX: headX, pixelY: headY } = normalizedToCanvasCoordinates(
            topHead.x,
            topHead.y,
            canvas.width,
            canvas.height
          )

          // Calculate dynamic scale based on face size (proximity to camera)
          let dynamicScale = 0.2
          if (leftEye && rightEye) {
            const eyeDistance = Math.sqrt(
              Math.pow(rightEye.x - leftEye.x, 2) + 
              Math.pow(rightEye.y - leftEye.y, 2)
            )
            const referenceEyeDistance = 0.15
            const proximityRatio = eyeDistance / referenceEyeDistance
            dynamicScale = 0.2 * proximityRatio
            dynamicScale = Math.max(0.1, Math.min(0.4, dynamicScale))
          }

          const heartImg = heartFilterRef.current
          const heartWidth = heartImg.width * dynamicScale
          const heartHeight = heartImg.height * dynamicScale

          // Position above head
          const heartX = headX - heartWidth / 2
          const heartY = headY - heartHeight - 20

          console.log(`Drawing heart ${faceIndex} at (${headX}, ${headY})`)
          ctx.save()
          ctx.globalAlpha = 1
          ctx.drawImage(
            heartImg,
            heartX,
            heartY,
            heartWidth,
            heartHeight
          )
          ctx.restore()
        })
      } catch (error) {
        console.error('Heart filter rendering error:', error)
      }
    }

    // Draw bow filter on right side of head if enabled
    if (useBowFilter && bowFilterRef.current && allDetectedFaces.length > 0) {
      try {
        allDetectedFaces.forEach((faceLandmarks, faceIndex) => {
          const topHead = faceLandmarks[10] // Top of head
          const leftEye = faceLandmarks[33]  // Left eye landmark
          const rightEye = faceLandmarks[263] // Right eye landmark
          const rightSide = faceLandmarks[156] // Right temple/forehead
          
          if (!topHead || !rightSide) {
            return
          }
          
          const { pixelX: headX, pixelY: headY } = normalizedToCanvasCoordinates(
            topHead.x,
            topHead.y,
            canvas.width,
            canvas.height
          )
          
          const { pixelX: rightX, pixelY: rightY } = normalizedToCanvasCoordinates(
            rightSide.x,
            rightSide.y,
            canvas.width,
            canvas.height
          )

          // Calculate dynamic scale based on face size (proximity to camera)
          let dynamicScale = 0.15
          if (leftEye && rightEye) {
            const eyeDistance = Math.sqrt(
              Math.pow(rightEye.x - leftEye.x, 2) + 
              Math.pow(rightEye.y - leftEye.y, 2)
            )
            const referenceEyeDistance = 0.15
            const proximityRatio = eyeDistance / referenceEyeDistance
            dynamicScale = bowScale * proximityRatio
            dynamicScale = Math.max(0.08, Math.min(0.25, dynamicScale))
          }

          const bowImg = bowFilterRef.current
          const bowWidth = bowImg.width * dynamicScale
          const bowHeight = bowImg.height * dynamicScale

          // Position on right side of head, slightly above
          const bowX = rightX + bowOffsetX - bowWidth / 2
          const bowY = headY + bowOffsetY - bowHeight / 2

          ctx.save()
          ctx.globalAlpha = 1
          ctx.translate(bowX + bowWidth / 2, bowY + bowHeight / 2)
          ctx.rotate((bowRotation * Math.PI) / 180)
          ctx.drawImage(
            bowImg,
            -bowWidth / 2,
            -bowHeight / 2,
            bowWidth,
            bowHeight
          )
          ctx.restore()
        })
      } catch (error) {
        console.error('Bow filter rendering error:', error)
      }
    }

    // Draw eye gem on left side of nose if enabled
    if (useEyeGem && nosePiercingRef.current && allDetectedFaces.length > 0) {
      try {
        allDetectedFaces.forEach((faceLandmarks, faceIndex) => {
          const leftEye = faceLandmarks[33]  // Left eye landmark
          const rightEye = faceLandmarks[263] // Right eye landmark
          const leftNostril = faceLandmarks[31] // Left nostril landmark
          
          if (!leftNostril) {
            return
          }
          
          const { pixelX: nostrilX, pixelY: nostrilY } = normalizedToCanvasCoordinates(
            leftNostril.x,
            leftNostril.y,
            canvas.width,
            canvas.height
          )

          // Calculate dynamic scale based on face size (proximity to camera)
          let dynamicScale = 0.015
          if (leftEye && rightEye) {
            const eyeDistance = Math.sqrt(
              Math.pow(rightEye.x - leftEye.x, 2) + 
              Math.pow(rightEye.y - leftEye.y, 2)
            )
            const referenceEyeDistance = 0.15
            const proximityRatio = eyeDistance / referenceEyeDistance
            dynamicScale = eyeGemScale * proximityRatio
            dynamicScale = Math.max(0.008, Math.min(0.15, dynamicScale))
          }

          const studImg = nosePiercingRef.current
          const studWidth = studImg.width * dynamicScale
          const studHeight = studImg.height * dynamicScale

          // Position on left side of nose near left nostril
          const studX = nostrilX + eyeGemOffsetX - studWidth / 2
          const studY = nostrilY + eyeGemOffsetY - studHeight / 2

          ctx.save()
          ctx.globalAlpha = 1
          ctx.translate(studX + studWidth / 2, studY + studHeight / 2)
          ctx.rotate((eyeGemRotation * Math.PI) / 180)
          ctx.drawImage(
            studImg,
            -studWidth / 2,
            -studHeight / 2,
            studWidth,
            studHeight
          )
          ctx.restore()
        })
      } catch (error) {
        console.error('Eye gem rendering error:', error)
      }
    }

    // Draw nose stud on right nostril
    if (useNoseStud && noseStudRef.current && allDetectedFaces.length > 0) {
      try {
        allDetectedFaces.forEach((faceLandmarks, faceIndex) => {
          const leftEye = faceLandmarks[33]  // Left eye landmark
          const rightEye = faceLandmarks[263] // Right eye landmark
          const rightNostril = faceLandmarks[429] // Right nostril landmark
          
          if (!rightNostril) {
            return
          }
          
          const { pixelX: nostrilX, pixelY: nostrilY } = normalizedToCanvasCoordinates(
            rightNostril.x,
            rightNostril.y,
            canvas.width,
            canvas.height
          )

          // Calculate dynamic scale based on face size (proximity to camera)
          let dynamicScale = 0.07
          if (leftEye && rightEye) {
            const eyeDistance = Math.sqrt(
              Math.pow(rightEye.x - leftEye.x, 2) + 
              Math.pow(rightEye.y - leftEye.y, 2)
            )
            const referenceEyeDistance = 0.15
            const proximityRatio = eyeDistance / referenceEyeDistance
            dynamicScale = noseStudScale * proximityRatio
            dynamicScale = Math.max(0.02, Math.min(0.25, dynamicScale))
          }

          const studImg = noseStudRef.current
          const studWidth = studImg.width * dynamicScale
          const studHeight = studImg.height * dynamicScale

          // Position on right side of nose
          const studX = nostrilX + noseStudOffsetX - studWidth / 2
          const studY = nostrilY + noseStudOffsetY - studHeight / 2

          // Draw the nose stud image
          ctx.save()
          ctx.globalAlpha = 1
          ctx.translate(studX + studWidth / 2, studY + studHeight / 2)
          ctx.rotate((noseStudRotation * Math.PI) / 180)
          ctx.drawImage(
            studImg,
            -studWidth / 2,
            -studHeight / 2,
            studWidth,
            studHeight
          )
          ctx.restore()
        })
      } catch (error) {
        console.error('Nose stud rendering error:', error)
      }
    }

    // Draw border overlay if one is selected
    if (currentBorder !== 'none' && borderRef.current) {
      // Skip drawing non-thali borders here if in 4-grid mode (they'll be drawn on full frame or specific grids after tiling)
      const shouldSkipForGridMode = use4Grid && currentBorder !== 'thali' && currentBorder !== 'chai' && currentBorder !== 'cat'
      
      if (!shouldSkipForGridMode) {
        const borderImg = borderRef.current
        let borderX = 0
        let borderY = 0
        let borderWidth = canvas.width
        let borderHeight = canvas.height
        let borderOpacity = 1
        
        // Scale miffy to 1.2x in normal view (not 4-grid)
        if (!use4Grid && currentBorder === 'miffy') {
          borderWidth = canvas.width * 1.01
          borderHeight = canvas.height * 1.01
          borderX = (canvas.width - borderWidth) / 2
          borderY = (canvas.height - borderHeight) / 2
        }
        
        // Special handling for thali - position at bottom of webcam
        if (currentBorder === 'thali') {
          // Position thali at the bottom center of webcam
          borderWidth = canvas.width * 0.8
          borderHeight = canvas.height * 0.35
          borderX = (canvas.width - borderWidth) / 2 // Center horizontally
          borderY = canvas.height - borderHeight + 80 // Position even lower at bottom of canvas
        }
        
        // Special handling for chai - position at bottom of webcam
        if (currentBorder === 'chai') {
          // Position chai at the bottom center of webcam
          borderWidth = canvas.width * 0.3 // Can be adjusted separately
          borderHeight = canvas.height * 0.4
          borderX = (canvas.width - borderWidth) / 2 // Center horizontally
          borderY = canvas.height - borderHeight + 70 // Position even lower at bottom of canvas
        }
        
        ctx.globalAlpha = borderOpacity
        ctx.drawImage(borderImg, borderX, borderY, borderWidth, borderHeight)
        ctx.globalAlpha = 1.0
      }
    }

    // If 4-grid mode: create a temporary canvas with the single frame, then tile it 4 times
    if (use4Grid) {
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = canvas.width
      tempCanvas.height = canvas.height
      const tempCtx = tempCanvas.getContext('2d')
      
      // Copy current canvas to temp canvas
      tempCtx.drawImage(canvas, 0, 0)
      
      // Clear main canvas and draw the single frame 4 times in a 2x2 grid
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      const quarterWidth = canvas.width / 2
      const quarterHeight = canvas.height / 2
      
      // Draw to all 4 quadrants
      ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height, 0, 0, quarterWidth, quarterHeight)
      ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height, quarterWidth, 0, quarterWidth, quarterHeight)
      ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height, 0, quarterHeight, quarterWidth, quarterHeight)
      ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height, quarterWidth, quarterHeight, quarterWidth, quarterHeight)
      
      // Draw Windows-style thick beveled frame to separate quadrants
      const frameWidth = 20
      
      // Draw vertical divider (thick beveled)
      // Light side
      ctx.fillStyle = '#dfdfdf'
      ctx.fillRect(quarterWidth - frameWidth / 2, 0, frameWidth / 2, canvas.height)
      // Dark side
      ctx.fillStyle = '#808080'
      ctx.fillRect(quarterWidth, 0, frameWidth / 2, canvas.height)
      
      // Draw horizontal divider (thick beveled)
      // Light side
      ctx.fillStyle = '#dfdfdf'
      ctx.fillRect(0, quarterHeight - frameWidth / 2, canvas.width, frameWidth / 2)
      // Dark side
      ctx.fillStyle = '#808080'
      ctx.fillRect(0, quarterHeight, canvas.width, frameWidth / 2)
      
      // Draw outer frame beveled border
      // Top-left light beveled edge
      ctx.fillStyle = '#dfdfdf'
      ctx.fillRect(0, 0, canvas.width, frameWidth / 2)
      ctx.fillRect(0, 0, frameWidth / 2, canvas.height)
      
      // Bottom-right dark beveled edge
      ctx.fillStyle = '#808080'
      ctx.fillRect(0, canvas.height - frameWidth / 2, canvas.width, frameWidth / 2)
      ctx.fillRect(canvas.width - frameWidth / 2, 0, frameWidth / 2, canvas.height)
      
      // Draw non-thali borders on the full frame if selected
      if (currentBorder !== 'none' && currentBorder !== 'thali' && currentBorder !== 'chai' && currentBorder !== 'cat' && borderRef.current) {
        const borderImg = borderRef.current
        let borderWidth = canvas.width
        let borderHeight = canvas.height
        let borderX = 0
        let borderY = 0
        
        // Scale up certain borders to 1.1x only in 4-grid view
        const scaleBorders = ['malligapoo', 'miffy', 'gem_biscuit', 'sari']
        if (scaleBorders.includes(currentBorder)) {
          borderWidth = canvas.width * 1.1
          borderHeight = canvas.height * 1.1
          borderX = (canvas.width - borderWidth) / 2
          borderY = (canvas.height - borderHeight) / 2
        }
        
        ctx.globalAlpha = 1
        ctx.drawImage(borderImg, borderX, borderY, borderWidth, borderHeight)
        ctx.globalAlpha = 1.0
      }
      
      // Draw cat only in bottom-left grid if selected
      if (currentBorder === 'cat' && borderRef.current) {
        const borderImg = borderRef.current
        const bottomLeftX = 0
        const bottomLeftY = quarterHeight
        ctx.globalAlpha = 1
        ctx.drawImage(borderImg, bottomLeftX, bottomLeftY, quarterWidth, quarterHeight)
        ctx.globalAlpha = 1.0
      }
    }


    animationIdRef.current = requestAnimationFrame(drawFrame)
  }

  // Start drawing when webcam is active
  useEffect(() => {
    if (isWebcamActive && videoRef.current && videoRef.current.readyState === 4) {
      drawFrame()
    }
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [isWebcamActive, offsetX, offsetY, scale, rotation, bowOffsetX, bowOffsetY, bowScale, bowRotation, eyeGemOffsetX, eyeGemOffsetY, eyeGemScale, eyeGemRotation, noseStudOffsetX, noseStudOffsetY, noseStudScale, noseStudRotation, currentFilter, use4Grid, useHeartFilter, useBowFilter, useEyeGem, useNoseStud, currentBorder, showVijayImage, useGrain, disableHandTracking])

  // Preload gallery images when gallery opens
  useEffect(() => {
    if (!showGallery) return
    
    setGalleryImagesLoaded(false)
    let loadedCount = 0
    const totalImages = GALLERY_PHOTOS.length
    
    // Preload all images
    const preloadPromises = GALLERY_PHOTOS.map((photoSrc) => {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          loadedCount++
          if (loadedCount === totalImages) {
            setGalleryImagesLoaded(true)
          }
          resolve()
        }
        img.onerror = () => {
          loadedCount++
          if (loadedCount === totalImages) {
            setGalleryImagesLoaded(true)
          }
          resolve()
        }
        img.src = photoSrc
      })
    })
  }, [showGallery])

  // Auto-scroll gallery photos (only when images are loaded)
  useEffect(() => {
    if (!showGallery || !galleryImagesLoaded) return
    
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % GALLERY_PHOTOS.length)
    }, 1000) // Change photo every 1 second

    return () => clearInterval(interval)
  }, [showGallery, galleryImagesLoaded])

  // Compress canvas to JPEG for smaller file size
  const compressCanvasToJpeg = (canvas, quality = 0.7) => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Failed to create blob from canvas')
          resolve(null)
          return
        }
        
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve(e.target.result)
        }
        reader.onerror = () => {
          console.error('FileReader error')
          resolve(null)
        }
        reader.readAsDataURL(blob)
      }, 'image/jpeg', quality)
    })
  }

  // Handle capture with timer countdown
  const handleCaptureWithTimer = async () => {
    if (timerOption === 'none') {
      // No timer - capture immediately
      await capturePhoto()
      return
    }

    // Get the timer duration in seconds
    const timerDurations = { '3s': 3, '5s': 5, '10s': 10 }
    const duration = timerDurations[timerOption]
    
    if (!duration) return

    // Start countdown
    setCountdownValue(duration)
    let remaining = duration

    const countdownInterval = setInterval(() => {
      remaining -= 1
      setCountdownValue(remaining)

      if (remaining <= 0) {
        clearInterval(countdownInterval)
        setCountdownValue(0)
        // Capture after timer completes
        capturePhoto()
      }
    }, 1000)

    countdownIntervalRef.current = countdownInterval
  }

  // Capture and save canvas as image to local memory
  const capturePhoto = async () => {
    // Check if storage limit reached (50 images max)
    if (capturedImages.length >= 50) {
      setShowStorageLimitModal(true)
      return
    }

    // Prevent concurrent captures (ignore spam clicks)
    if (isCapturingRef.current) {
      console.log('Capture already in progress, ignoring additional click')
      return
    }

    if (!canvasRef.current) {
      console.error('Canvas ref not available')
      return
    }

    isCapturingRef.current = true

    try {
      // Define notification messages based on face count
      const notificationMessages = {
        single: ['I LOVE 😍', 'ATEE 💅', 'Cutie! 😝', 'WOW 🫠'],
        multiple: ['I LOVE 😍', 'ATEE 💅', 'Cuties! 😝', 'WOW 🫠']
      }

      // Determine which message set to use
      const faceCount = detectedFaceCountRef.current
      const messageSet = faceCount > 1 ? notificationMessages.multiple : notificationMessages.single
      
      // Cycle through messages
      const nextIndex = (notificationMessageIndex + 1) % messageSet.length
      setNotificationMessageIndex(nextIndex)
      setCaptureNotificationMessage(messageSet[nextIndex])

      // Play camera snap sound immediately
      if (cameraSnapAudioRef.current) {
        cameraSnapAudioRef.current.currentTime = 0
        cameraSnapAudioRef.current.play().catch((error) => {
          console.log('Could not play camera snap sound:', error)
        })
      }

      // Show capture notification immediately for instant feedback
      setCaptureNotification(true)
      setTimeout(() => setCaptureNotification(false), 2000)

      // Increment capture counter immediately
      captureCounterRef.current += 1
      localStorage.setItem('captureCounter', captureCounterRef.current.toString())

      // Compress image in background (non-blocking)
      const dataUrl = await compressCanvasToJpeg(canvasRef.current, 0.75)
      
      if (!dataUrl) {
        console.error('Failed to compress image')
        return
      }

      const newImage = {
        id: Date.now(),
        dataUrl: dataUrl,
        timestamp: Date.now(),
        name: `hiba_cam_${captureCounterRef.current}`
      }
      
      // Get the latest images from localStorage
      const savedImages = localStorage.getItem('capturedImages')
      const allImages = savedImages ? JSON.parse(savedImages) : []
      const updatedImages = [newImage, ...allImages]
      
      try {
        localStorage.setItem('capturedImages', JSON.stringify(updatedImages))
        console.log('Image saved! Total images:', updatedImages.length)
        console.log('Compressed size:', (dataUrl.length / 1024).toFixed(1), 'KB')
      } catch (e) {
        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
          console.warn('LocalStorage quota exceeded! Keeping only newest 50 images...')
          // Keep only the 50 most recent images
          const recentImages = updatedImages.slice(0, 50)
          try {
            localStorage.setItem('capturedImages', JSON.stringify(recentImages))
            setCapturedImages(recentImages)
            setImageCount(recentImages.length)
            console.log('Trimmed to 50 most recent images')
          } catch (e2) {
            console.error('Still unable to save:', e2)
          }
          return
        }
      }
      
      setCapturedImages(updatedImages)
      setImageCount(updatedImages.length)
    } catch (error) {
      console.error('Error during capture:', error)
    } finally {
      isCapturingRef.current = false
    }
  }

  // Play click sound
  const playClickSound = () => {
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0
      clickAudioRef.current.play().catch((error) => {
        console.log('Could not play sound:', error)
      })
    }
  }

  // Delete all downloaded images
  const handleDeleteAllImages = () => {
    playClickSound()
    setCapturedImages([])
    setImageCount(0)
    localStorage.setItem('capturedImages', JSON.stringify([]))
    setShowStorageLimitModal(false)
    setShowDeleteConfirm(false)
    setDownloadsPage(0)
  }

  // Save all images as ZIP then delete
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

  // Save all images as ZIP without deleting
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

  // Handle camera icon click
  const handleCameraClick = () => {
    playClickSound()
    if (showVijayOverlay) {
      // Close both Vijay Overlay and Controls if Vijay Overlay is already open
      setShowVijayOverlay(false)
      setShowControls(false)
      stopWebcam()
    } else {
      // Open Vijay Overlay
      setShowVijayOverlay(true)
      setShowControls(false)
      if (!isWebcamActive) {
        startWebcam()
      }
    }
  }

  // Handle desktop icon click
  const handleDesktopIconClick = () => {
    playClickSound()
  }

  // Handle Downloads folder click
  const handleDownloadsFolderClick = () => {
    playClickSound()
    setShowDownloadsFolder(!showDownloadsFolder)
  }

  // Handle close Downloads folder
  const handleCloseDownloads = () => {
    playClickSound()
    setShowDownloadsFolder(false)
    // Don't close the image modal - they're independent
  }

  // Handle delete image
  const handleDeleteImage = (imageId) => {
    playClickSound()
    setImageToDelete(imageId)
  }

  // Confirm delete image
  const confirmDeleteImage = () => {
    playClickSound()

    // Find index BEFORE removing
    const deletedIndex = capturedImages.findIndex(
      (img) => img.id === imageToDelete
    )

    // Create new array without deleted image
    const updatedImages = capturedImages.filter(
      (img) => img.id !== imageToDelete
    )

    setCapturedImages(updatedImages)
    localStorage.setItem('capturedImages', JSON.stringify(updatedImages))

    // Handle modal image switching
    if (updatedImages.length > 0) {
      // Prefer next image, fallback to previous
      const nextIndex =
        deletedIndex < updatedImages.length
          ? deletedIndex
          : updatedImages.length - 1

      setSelectedImage(updatedImages[nextIndex])
    } else {
      // No images left → close modal
      setSelectedImage(null)
    }

    // Close confirmation dialog only
    setImageToDelete(null)
    setDownloadsPage(0)

    console.log('Image deleted! Remaining:', updatedImages.length)
  }

  // Cancel delete
  const cancelDeleteImage = () => {
    playClickSound()
    setImageToDelete(null)
  }

  // Handle music player toggle
  const handleMusicClick = () => {
    playClickSound()
    setShowMusicPlayer(!showMusicPlayer)
  }

  // Handle video click
  const handleVideoClick = () => {
    playClickSound()
    setShowVideo(!showVideo)
  }

  // Handle close video
  const handleCloseVideo = () => {
    playClickSound()
    setShowVideo(false)
  }

  // Handle play/pause music
  const handlePlayPauseMusic = () => {
    playClickSound()
    if (isMusciPlaying) {
      bgMusicRef.current?.pause()
      setIsMusicPlaying(false)
    } else {
      bgMusicRef.current?.play()
      setIsMusicPlaying(true)
    }
  }

  // Handle next song
  const handleNextSong = () => {
    playClickSound()
    setReplayCurrentSong(false)
    const nextIndex = (currentSongIndex + 1) % PLAYLIST.length
    setCurrentSongIndex(nextIndex)
    setSliderPosition(0)
    setAudioCurrentTime(0)
    if (bgMusicRef.current) {
      bgMusicRef.current.pause()
      bgMusicRef.current.currentTime = 0
      bgMusicRef.current.src = PLAYLIST[nextIndex].file
      bgMusicRef.current.load()
      // Auto-play the next song
      setTimeout(() => {
        bgMusicRef.current?.play().catch(err => console.log('Play error:', err))
        setIsMusicPlaying(true)
      }, 100)
    }
  }

  // Handle previous song
  const handlePreviousSong = () => {
    playClickSound()
    setReplayCurrentSong(false)
    const prevIndex = (currentSongIndex - 1 + PLAYLIST.length) % PLAYLIST.length
    setCurrentSongIndex(prevIndex)
    setSliderPosition(0)
    setAudioCurrentTime(0)
    if (bgMusicRef.current) {
      bgMusicRef.current.pause()
      bgMusicRef.current.currentTime = 0
      bgMusicRef.current.src = PLAYLIST[prevIndex].file
      bgMusicRef.current.load()
      // Auto-play the previous song
      setTimeout(() => {
        bgMusicRef.current?.play().catch(err => console.log('Play error:', err))
        setIsMusicPlaying(true)
      }, 100)
    }
  }

  // Handle close music player
  const handleCloseMusicPlayer = () => {
    playClickSound()
    setShowMusicPlayer(false)
  }

  // Handle trash icon click
  const handleTrashClick = () => {
    playClickSound()
    setShowTrash(!showTrash)
  }

  // Handle close trash
  const handleCloseTrash = () => {
    playClickSound()
    setShowTrash(false)
  }

  // Move image to trash
  const moveImageToTrash = (imageId) => {
    const imageToMove = capturedImages.find((img) => img.id === imageId)
    if (imageToMove) {
      if (trashAudioRef.current) {
        trashAudioRef.current.currentTime = 0
        trashAudioRef.current.volume = 1.0
        trashAudioRef.current.playbackRate = 1.5
        trashAudioRef.current.play().catch((error) => {
          console.log('Could not play trash sound:', error)
        })
      }
      const updatedTrash = [...trashedImages, imageToMove]
      setTrashedImages(updatedTrash)
      localStorage.setItem('trashedImages', JSON.stringify(updatedTrash))
      
      const updatedImages = capturedImages.filter((img) => img.id !== imageId)
      setCapturedImages(updatedImages)
      localStorage.setItem('capturedImages', JSON.stringify(updatedImages))
      
      // If the moved image was selected, transition to next image instead of closing modal
      if (selectedImage?.id === imageId) {
        if (updatedImages.length > 0) {
          const movedIndex = capturedImages.findIndex((img) => img.id === imageId)
          const nextIndex = 
            movedIndex < updatedImages.length 
              ? movedIndex 
              : updatedImages.length - 1
          setSelectedImage(updatedImages[nextIndex])
        } else {
          // No images left, close modal
          setSelectedImage(null)
        }
      }
    }
  }

  // Restore image from trash
  const restoreImageFromTrash = (imageId) => {
    playClickSound()
    const imageToRestore = trashedImages.find((img) => img.id === imageId)
    if (imageToRestore) {
      // Find index BEFORE removing (from original array)
      const restoredIndex = trashedImages.findIndex((img) => img.id === imageId)
      
      // Ensure all properties are preserved, especially the name
      const restoredImage = { ...imageToRestore }
      const updatedCaptured = [restoredImage, ...capturedImages]
      const updatedTrash = trashedImages.filter((img) => img.id !== imageId)
      
      setCapturedImages(updatedCaptured)
      setDownloadsPage(0)
      localStorage.setItem('capturedImages', JSON.stringify(updatedCaptured))
      localStorage.setItem('trashedImages', JSON.stringify(updatedTrash))
      
      // Keep modal open and switch to next trash image
      if (updatedTrash.length > 0) {
        const nextIndex = 
          restoredIndex < updatedTrash.length 
            ? restoredIndex 
            : updatedTrash.length - 1
        setSelectedTrashImage(updatedTrash[nextIndex])
      } else {
        // Only close modal when no images left
        setSelectedTrashImage(null)
      }
      
      setTrashedImages(updatedTrash)
    }
  }

  // Permanently delete from trash
  const confirmPermanentDeleteImage = () => {
    playClickSound()
    if (trashAudioRef.current) {
      trashAudioRef.current.currentTime = 0
      trashAudioRef.current.volume = 1.0
      trashAudioRef.current.playbackRate = 1.5
      trashAudioRef.current.play().catch((error) => {
        console.log('Could not play trash sound:', error)
      })
    }
    
    // Find index BEFORE removing (from original array)
    const deletedIndex = trashedImages.findIndex(
      (img) => img.id === imageToDeletePermanently
    )
    
    // Create new array without deleted image
    const updatedTrash = trashedImages.filter(
      (img) => img.id !== imageToDeletePermanently
    )
    
    // Keep modal open and switch to next trash image if available
    if (updatedTrash.length > 0) {
      const nextIndex =
        deletedIndex < updatedTrash.length
          ? deletedIndex
          : updatedTrash.length - 1
      setSelectedTrashImage(updatedTrash[nextIndex])
    } else {
      // Only close modal when no images left
      setSelectedTrashImage(null)
    }
    
    // Update state + storage
    setTrashedImages(updatedTrash)
    localStorage.setItem('trashedImages', JSON.stringify(updatedTrash))
    
    // Close confirmation dialog only
    setImageToDeletePermanently(null)
    setTrashPage(0)
  }

  // Cancel permanent delete
  const cancelPermanentDeleteImage = () => {
    playClickSound()
    setImageToDeletePermanently(null)
  }

  // Clear all trash
  const clearAllTrash = () => {
    playClickSound()
    if (trashAudioRef.current) {
      trashAudioRef.current.currentTime = 0
      trashAudioRef.current.volume = 1.0
      trashAudioRef.current.playbackRate = 1.5
      trashAudioRef.current.play().catch(() => {})
    }
    setTrashedImages([])
    setSelectedTrashImage(null)
    setTrashPage(0)
    localStorage.setItem('trashedImages', JSON.stringify([]))
    setConfirmClearTrash(false)
  }

  // Cancel clear trash
  const cancelClearTrash = () => {
    playClickSound()
    setConfirmClearTrash(false)
  }

  // Handle window dragging
  const handleMouseDown = (e, windowType, currentPos) => {
    if (e.button !== 0) return // Only left mouse button
    const startX = e.clientX - currentPos.x
    const startY = e.clientY - currentPos.y
    setDragState({
      window: windowType,
      startX,
      startY
    })
  }

  // Handle mouse move for dragging
  useEffect(() => {
    if (!dragState && !draggedImageId) return

    const handleMouseMove = (e) => {
      if (dragState) {
        const newX = e.clientX - dragState.startX
        const newY = e.clientY - dragState.startY

        if (dragState.window === 'vijayOverlay') {
          setVijayOverlayPos({ x: newX, y: newY })
        } else if (dragState.window === 'downloads') {
          setDownloadsPos({ x: newX, y: newY })
        } else if (dragState.window === 'musicPlayer') {
          setMusicPlayerPos({ x: newX, y: newY })
        } else if (dragState.window === 'controlsWindow') {
          setControlsWindowPos({ x: newX, y: newY })
        } else if (dragState.window === 'trash') {
          setTrashPos({ x: newX, y: newY })
        } else if (dragState.window === 'video') {
          setVideoPos({ x: newX, y: newY })
        } else if (dragState.window === 'gallery') {
          setGalleryPos({ x: newX, y: newY })
        } else if (dragState.window === 'notification') {
          setCaptureNotificationPos({ x: newX, y: newY })
        }
      } else if (draggedImageId) {
        setDragImagePos({ x: e.clientX - 30, y: e.clientY - 30 })
      }
    }

    const handleMouseUp = (e) => {
      if (draggedImageId) {
        // Check if dropped on desktop icons
        const trashIconRect = document.getElementById('trash-icon')?.getBoundingClientRect()
        const downloadsIconRect = document.getElementById('downloads-icon')?.getBoundingClientRect()
        
        // Check if dropped on open windows
        const downloadsWindowRect = document.getElementById('downloads-window')?.getBoundingClientRect()
        const trashWindowRect = document.getElementById('trash-window')?.getBoundingClientRect()
        
        // From downloads to trash (icon or window)
        if (dragImageSource === 'downloads') {
          const droppedOnTrashIcon = trashIconRect &&
            e.clientX >= trashIconRect.left &&
            e.clientX <= trashIconRect.right &&
            e.clientY >= trashIconRect.top &&
            e.clientY <= trashIconRect.bottom
          
          const droppedOnTrashWindow = trashWindowRect &&
            e.clientX >= trashWindowRect.left &&
            e.clientX <= trashWindowRect.right &&
            e.clientY >= trashWindowRect.top &&
            e.clientY <= trashWindowRect.bottom
          
          if (droppedOnTrashIcon || droppedOnTrashWindow) {
            moveImageToTrash(draggedImageId)
          }
        } 
        // From trash to downloads (icon or window)
        else if (dragImageSource === 'trash') {
          const droppedOnDownloadsIcon = downloadsIconRect &&
            e.clientX >= downloadsIconRect.left &&
            e.clientX <= downloadsIconRect.right &&
            e.clientY >= downloadsIconRect.top &&
            e.clientY <= downloadsIconRect.bottom
          
          const droppedOnDownloadsWindow = downloadsWindowRect &&
            e.clientX >= downloadsWindowRect.left &&
            e.clientX <= downloadsWindowRect.right &&
            e.clientY >= downloadsWindowRect.top &&
            e.clientY <= downloadsWindowRect.bottom
          
          if (droppedOnDownloadsIcon || droppedOnDownloadsWindow) {
            restoreImageFromTrash(draggedImageId)
          }
        }
        setDraggedImageId(null)
        setDragImageSource(null)
      }
      
      setDragState(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragState, draggedImageId])

  // Handle close button
  const handleCloseVijayOverlay = () => {
    playClickSound()
    setShowVijayOverlay(false)
    stopWebcam()
  }

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} onLogout={() => setIsLoggedIn(false)} />
  }

  return (
    <div style={{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      cursor: `url(${cursorImg}) 4 12, auto`,
      backgroundColor: '#0000aa'
    }}>
      <audio ref={clickAudioRef} src={clickSound} />
      <audio ref={cameraSnapAudioRef} src={cameraSnapSound} />
      <audio ref={bgMusicRef} src={PLAYLIST[currentSongIndex].file} onEnded={() => {
        if (replayCurrentSong) {
          if (bgMusicRef.current) {
            bgMusicRef.current.currentTime = 0
            bgMusicRef.current.play()
          }
        } else {
          handleNextSong()
        }
      }} />
      <audio ref={trashAudioRef} src={trashSound} />

      {/* Loading message - appears while images are loading */}
      {!bgImagesLoaded && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#ffff00',
            fontSize: '24px',
            fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            fontWeight: 'bold',
            textAlign: 'center',
            pointerEvents: 'none',
            zIndex: 9999
          }}
        >
          Wait for bg img to fully load before clicking anything!
        </div>
      )}

      {/* Hidden img element to track when background image loads */}
      <img src={bgImage} onLoad={() => setBgImageLoaded(true)} style={{ display: 'none' }} alt="bg" />

      {showDesktop ? (
        // Desktop view with folders and camera icon - Two columns layout
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '80px',
          padding: '20px',
          height: '100%',
          width: '100%'
        }}>
          {/* Column 1 - Downloads, Music.mp3, Video */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            alignItems: 'flex-start'
          }}>
            {/* Downloads Folder */}
            <div 
              id="downloads-icon"
              onClick={handleDownloadsFolderClick}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px',
                width: '90px',
                height: '110px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📁</div>
              <div style={{
                fontSize: '12px',
                color: '#ffff00',
                textShadow: '2px 2px 3px black',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 139, 0.5)',
                padding: '2px 6px',
                borderRadius: '3px'
              }}>Downloads</div>
            </div>

            {/* Music.mp3 */}
            <div 
              onClick={handleMusicClick}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px',
                width: '90px',
                height: '110px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎵</div>
              <div style={{
                fontSize: '12px',
                color: '#ffff00',
                textShadow: '2px 2px 3px black',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 139, 0.5)',
                padding: '2px 6px',
                borderRadius: '3px'
              }}>Music.mp3</div>
            </div>

            {/* Video */}
            <div 
              onClick={handleVideoClick}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px',
                width: '90px',
                height: '110px',
                textAlign: 'center',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px'
              }}>
                🎬
              </div>
              <div style={{
                fontSize: '12px',
                color: '#ffff00',
                textShadow: '2px 2px 3px black',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 139, 0.5)',
                padding: '2px 6px',
                borderRadius: '3px'
              }}>Video</div>
            </div>
          </div>

          {/* Column 2 - Vijay Overlay, Gallery, Trash */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            alignItems: 'flex-start'
          }}>
            {/* Vijay Overlay */}
            <div 
              onClick={handleCameraClick}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px',
                width: '90px',
                height: '110px',
                textAlign: 'center',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
              }}
            >
              <div style={{ 
                fontSize: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'scale(1)',
                transition: 'transform 0.1s'
              }}>📷</div>
              <div style={{
                fontSize: '12px',
                color: '#ffff00',
                textShadow: '2px 2px 3px black',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 139, 0.5)',
                padding: '2px 6px',
                borderRadius: '3px'
              }}>Vijay Cam</div>
            </div>

            {/* Gallery */}
            <div 
              onClick={() => {
                playClickSound()
                setShowGallery(!showGallery)
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px',
                width: '90px',
                height: '110px',
                textAlign: 'center',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
              }}
            >
              <div style={{
                fontSize: '48px',
                height: '56px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>🏞️</div>
              <div style={{
                fontSize: '12px',
                color: '#ffff00',
                textShadow: '2px 2px 3px black',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 139, 0.5)',
                padding: '2px 6px',
                borderRadius: '3px'
              }}>Gallery</div>
            </div>

            {/* Trash */}
            <div 
              id="trash-icon"
              onClick={handleTrashClick}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px',
                width: '90px',
                height: '110px',
                textAlign: 'center',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
              }}
            >
              <img 
                src={trashedImages.length > 0 ? fullBinImg : emptyBinImg}
                alt="Trash"
                style={{
                  width: '56px',
                  height: '56px',
                  objectFit: 'contain'
                }}
              />
              <div style={{
                fontSize: '12px',
                color: '#ffff00',
                textShadow: '2px 2px 3px black',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 139, 0.5)',
                padding: '2px 6px',
                borderRadius: '3px'
              }}>Trash</div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Capture Notification Toast */}
      {captureNotification && (
        <div 
          style={{
            position: 'fixed',
            top: `${captureNotificationPos.y}px`,
            right: 'auto',
            left: `${captureNotificationPos.x}px`,
            backgroundColor: '#000080',
            color: '#ffff00',
            padding: '12px 20px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 9999,
            border: '2px solid #ffff00',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            animation: 'slideIn 0.3s ease-in-out',
            cursor: dragState?.window === 'notification' ? 'grabbing' : 'grab',
            userSelect: 'none'
          }}
          onMouseDown={(e) => handleMouseDown(e, 'notification', captureNotificationPos)}
        >
          {captureNotificationMessage}
        </div>
      )}

      {/* Vijay Overlay Modal */}
      {showVijayOverlay && (
        <animated.div style={{
          ...fadeProps,
          position: 'fixed',
          top: `${vijayOverlayPos.y}px`,
          left: `${vijayOverlayPos.x}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px',
          gap: '15px',
          zIndex: 1000
        }}>
          <div className="main-container">
            <div 
              className="title"
              onMouseDown={(e) => handleMouseDown(e, 'vijayOverlay', vijayOverlayPos)}
              style={{ 
                cursor: dragState?.window === 'vijayOverlay' ? 'grabbing' : 'grab',
                borderBottom: dragState?.window === 'vijayOverlay' ? '2px solid #ffffff' : 'none'
              }}
            >
              <h1>Vijay Cam ⋆｡°✩</h1>
              <button 
                onClick={handleCloseVijayOverlay}
                style={{
                  marginLeft: 'auto',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  outline: 'none',
                  backgroundColor: '#d85c5c'
                }}
              >
                ✕
              </button>
            </div>

            <div className="container-inner webcam-main">
              {cameraError && (
                <div className="error-message">
                  ⚠️ {cameraError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div className="canvas-container">
                  <canvas
                    ref={canvasRef}
                    className="webcam-canvas"
                    style={{ 
                      display: 'block',
                      backgroundColor: isWebcamActive ? 'transparent' : '#000000'
                    }}
                  />
                  
                  {/* Timer countdown overlay */}
                  {countdownValue > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '120px',
                      fontWeight: 'bold',
                      color: 'white',
                      textShadow: '0 0 20px rgba(0, 0, 0, 0.8)',
                      zIndex: 100,
                      userSelect: 'none'
                    }}>
                      {countdownValue}
                    </div>
                  )}
                </div>

                {/* Filter Options Panel */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '10px',
                  backgroundColor: '#c0c0c0',
                  border: '1px solid',
                  borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                  borderRadius: '2px'
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: '#000080'
                  }}>
                    Filters:
                  </div>
                  <button
                    onClick={() => {
                      playClickSound()
                      setCurrentFilter('normal')
                    }}
                    disabled={!isWebcamActive}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: currentFilter === 'normal' ? '#000080' : isWebcamActive ? '#c0c0c0' : '#a0a0a0',
                      color: currentFilter === 'normal' ? 'white' : isWebcamActive ? 'black' : '#606060',
                      border: '1px solid',
                      borderColor: currentFilter === 'normal' ? '#000080' : isWebcamActive ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                      cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      outline: 'none',
                      opacity: isWebcamActive ? 1 : 0.5
                    }}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => {
                      playClickSound()
                      setCurrentFilter('blackAndWhite')
                    }}
                    disabled={!isWebcamActive}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: currentFilter === 'blackAndWhite' ? '#000080' : isWebcamActive ? '#c0c0c0' : '#a0a0a0',
                      color: currentFilter === 'blackAndWhite' ? 'white' : isWebcamActive ? 'black' : '#606060',
                      border: '1px solid',
                      borderColor: currentFilter === 'blackAndWhite' ? '#000080' : isWebcamActive ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                      cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      outline: 'none',
                      opacity: isWebcamActive ? 1 : 0.5
                    }}
                  >
                    B&W
                  </button>
                  <button
                    onClick={() => {
                      playClickSound()
                      setCurrentFilter('aesthetic')
                    }}
                    disabled={!isWebcamActive}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: currentFilter === 'aesthetic' ? '#8b4789' : isWebcamActive ? '#c0c0c0' : '#a0a0a0',
                      color: currentFilter === 'aesthetic' ? 'white' : isWebcamActive ? 'black' : '#606060',
                      border: '1px solid',
                      borderColor: currentFilter === 'aesthetic' ? '#8b4789' : isWebcamActive ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                      cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      outline: 'none',
                      opacity: isWebcamActive ? 1 : 0.5
                    }}
                  >
                    Tint
                  </button>

                  {/* Heart Filter Toggle Checkbox */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px solid #808080'
                  }}>
                    <input
                      type="checkbox"
                      id="heartToggle"
                      checked={useHeartFilter}
                      onChange={(e) => {
                        playClickSound()
                        setUseHeartFilter(e.target.checked)
                      }}
                      disabled={!isWebcamActive}
                      style={{
                        cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                        width: '14px',
                        height: '14px',
                        opacity: isWebcamActive ? 1 : 0.5
                      }}
                    />
                    <label
                      htmlFor="heartToggle"
                      style={{
                        fontSize: '11px',
                        cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                        userSelect: 'none',
                        opacity: isWebcamActive ? 1 : 0.5
                      }}
                    >
                      Hearts ♥
                    </label>
                  </div>

                  {/* Bow Filter Toggle Checkbox */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '5px',
                    paddingLeft: '0px'
                  }}>
                    <input
                      type="checkbox"
                      id="bowToggle"
                      checked={useBowFilter}
                      onChange={(e) => {
                        playClickSound()
                        setUseBowFilter(e.target.checked)
                      }}
                      disabled={!isWebcamActive}
                      style={{
                        cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                        width: '14px',
                        height: '14px',
                        opacity: isWebcamActive ? 1 : 0.5
                      }}
                    />
                    <label
                      htmlFor="bowToggle"
                      style={{
                        fontSize: '11px',
                        cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                        userSelect: 'none',
                        opacity: isWebcamActive ? 1 : 0.5
                      }}
                    >
                      Bow 𝜗𝜚
                    </label>
                  </div>

                  {/* Nose Piercing Toggle Checkbox */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '8px',
                    paddingLeft: '0px'
                  }}>
                    <input
                      type="checkbox"
                      id="eyeGemToggle"
                      checked={useEyeGem}
                      onChange={(e) => {
                        playClickSound()
                        setUseEyeGem(e.target.checked)
                      }}
                      disabled={!isWebcamActive}
                      style={{
                        cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                        width: '14px',
                        height: '14px',
                        opacity: isWebcamActive ? 1 : 0.5
                      }}
                    />
                    <label
                      htmlFor="eyeGemToggle"
                      style={{
                        fontSize: '11px',
                        cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                        userSelect: 'none',
                        opacity: isWebcamActive ? 1 : 0.5
                      }}
                    >
                       Eye Gem ✧
                    </label>
                  </div>

                  {/* Nose Stud Toggle Checkbox */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '8px',
                    paddingLeft: '0px'
                  }}>
                    <input
                      type="checkbox"
                      id="noseStudToggle"
                      checked={useNoseStud}
                      onChange={(e) => {
                        playClickSound()
                        setUseNoseStud(e.target.checked)
                      }}
                      disabled={!isWebcamActive}
                      style={{
                        cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                        width: '14px',
                        height: '14px',
                        opacity: isWebcamActive ? 1 : 0.5
                      }}
                    />
                    <label
                      htmlFor="noseStudToggle"
                      style={{
                        fontSize: '11px',
                        cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                        userSelect: 'none',
                        opacity: isWebcamActive ? 1 : 0.5
                      }}
                    >
                       Nose Stud
                    </label>
                  </div>

                  {/* 4 Grid Toggle Checkbox */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '8px'
                  }}>
                    <input
                      type="checkbox"
                      id="fourGridToggle"
                      checked={use4Grid}
                      onChange={(e) => {
                        playClickSound()
                        setUse4Grid(e.target.checked)
                      }}
                      disabled={!isWebcamActive}
                      style={{
                        cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                        width: '14px',
                        height: '14px',
                        opacity: isWebcamActive ? 1 : 0.5
                      }}
                    />
                    <label
                      htmlFor="fourGridToggle"
                      style={{
                        fontSize: '11px',
                        cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                        userSelect: 'none',
                        opacity: isWebcamActive ? 1 : 0.5
                      }}
                    >
                      4 Grid View
                    </label>
                  </div>

                  {/* Grain Filter Checkbox */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '8px'
                  }}>
                    <input
                      type="checkbox"
                      id="grainToggle"
                      checked={useGrain}
                      onChange={(e) => {
                        playClickSound()
                        setUseGrain(e.target.checked)
                      }}
                      disabled={!isWebcamActive}
                      style={{
                        cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                        width: '14px',
                        height: '14px',
                        opacity: isWebcamActive ? 1 : 0.5
                      }}
                    />
                    <label
                      htmlFor="grainToggle"
                      style={{
                        fontSize: '11px',
                        cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                        userSelect: 'none',
                        opacity: isWebcamActive ? 1 : 0.5
                      }}
                    >
                      Film Grain
                    </label>
                  </div>

                  {/* Border Selection */}
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '11px', marginBottom: '5px', opacity: isWebcamActive ? 1 : 0.5 }}>Borders:</div>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                      <button
                        onClick={() => {
                          const options = ['none', 'bow', 'cat', 'gem_biscuit', 'malligapoo', 'miffy', 'rajini', 'sari', 'thali', 'chai']
                          const currentIndex = options.indexOf(currentBorder)
                          const newIndex = (currentIndex - 1 + options.length) % options.length
                          setCurrentBorder(options[newIndex])
                          playClickSound()
                        }}
                        disabled={!isWebcamActive}
                        style={{
                          width: '20px',
                          height: '20px',
                          padding: '0',
                          fontSize: '10px',
                          cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                          backgroundColor: isWebcamActive ? '#c0c0c0' : '#a0a0a0',
                          border: '2px solid',
                          borderColor: isWebcamActive ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                          color: '#000080',
                          fontWeight: 'bold',
                          opacity: isWebcamActive ? 1 : 0.5,
                          outline: 'none'
                        }}
                      >
                        &lt;
                      </button>
                      <span style={{ fontSize: '11px', minWidth: '60px', textAlign: 'center' }}>
                        {currentBorder === 'none' ? 'None' :
                         currentBorder === 'bow' ? 'Bow' :
                         currentBorder === 'cat' ? 'Cat' :
                         currentBorder === 'gem_biscuit' ? 'Gem Biscuit' :
                         currentBorder === 'malligapoo' ? 'Malligapoo' :
                         currentBorder === 'miffy' ? 'Miffy' :
                         currentBorder === 'rajini' ? 'Rajini' :
                         currentBorder === 'sari' ? 'Sari' :
                         currentBorder === 'thali' ? 'Thali' : 'Chai'}
                      </span>
                      <button
                        onClick={() => {
                          const options = ['none', 'bow', 'cat', 'gem_biscuit', 'malligapoo', 'miffy', 'rajini', 'sari', 'thali', 'chai']
                          const currentIndex = options.indexOf(currentBorder)
                          const newIndex = (currentIndex + 1) % options.length
                          setCurrentBorder(options[newIndex])
                          playClickSound()
                        }}
                        disabled={!isWebcamActive}
                        style={{
                          width: '20px',
                          height: '20px',
                          padding: '0',
                          fontSize: '10px',
                          cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                          backgroundColor: isWebcamActive ? '#c0c0c0' : '#a0a0a0',
                          border: '2px solid',
                          borderColor: isWebcamActive ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                          color: '#000080',
                          fontWeight: 'bold',
                          opacity: isWebcamActive ? 1 : 0.5,
                          outline: 'none'
                        }}
                      >
                        &gt;
                      </button>
                    </div>
                  </div>

                  {/* Vijay Overlay Toggle */}
                  <div style={{ marginTop: '10px' }}>
                    <input
                      type="checkbox"
                      id="vijayToggle"
                      checked={showVijayImage}
                      onChange={(e) => {
                        setShowVijayImage(e.target.checked)
                        playClickSound()
                      }}
                      disabled={!isWebcamActive}
                      style={{
                        cursor: isWebcamActive ? 'pointer' : 'not-allowed',
                        width: '14px',
                        height: '14px',
                        opacity: isWebcamActive ? 1 : 0.5
                      }}
                    />
                    <label
                      htmlFor="vijayToggle"
                      style={{
                        fontSize: '11px',
                        cursor: 'pointer',
                        userSelect: 'none',
                        marginLeft: '5px'
                      }}
                    >
                      Vijay
                    </label>
                  </div>
                </div>
              </div>

              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{ display: 'none' }}
                onLoadedMetadata={() => {
                  console.log('Video metadata loaded')
                  if (isWebcamActive) {
                    drawFrame()
                  }}
                }
              />

              {/* Vijay Expression Instructions */}
              {showVijayImage && (
                <div style={{
                  backgroundColor: '#c0c0c0',
                  border: '1px solid',
                  borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                  padding: '10px',
                  marginTop: '-130px',
                  marginLeft: '-150px',
                  marginBottom: '10px',
                  fontSize: '11px',
                  fontFamily: 'Arial, sans-serif',
                  color: '#000000',
                  lineHeight: '1.4',
                  width: '600px',
                  position: 'relative',
                  boxSizing: 'border-box'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#000080' }}>
                    Changing Vijay Tips:
                  </div>
                  <div style={{ width: '100%' }}>• Try posing with your hand under your chin, give a thumbs up, or throw up a peace sign</div>
                  <div style={{ width: '100%' }}>• Blink to switch back to Vijay’s "Heart Hands" pose</div>
                  <div style={{ width: '100%', textAlign: 'center', fontStyle: 'italic', marginTop: '5px' }}>
                    Thalapathy is a busy man in politics now - sometimes he doesn't detect your gestures, so keep trying! ☆
                  </div>

                  {/* Disable hand tracking checkbox */}
                  <div style={{
                    marginTop: '15px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    padding: '6px 8px',
                    backgroundColor: '#c0c0c0',
                    border: '2px solid',
                    borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    width: 'fit-content'
                  }}>
                    <input
                      type="checkbox"
                      id="disableHandTrackingToggle"
                      checked={disableHandTracking}
                      onChange={(e) => {
                        playClickSound()
                        setDisableHandTracking(e.target.checked)
                      }}
                      style={{
                        cursor: 'pointer',
                        width: '13px',
                        height: '13px'
                      }}
                    />
                    <label
                      htmlFor="disableHandTrackingToggle"
                      style={{
                        fontSize: '10px',
                        cursor: 'pointer',
                        userSelect: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      Don't track hand movements
                    </label>
                  </div>
                  {/* Bow decoration */}
                  <img 
                    src={new URL('./assets/bow.png', import.meta.url).href} 
                    alt="bow" 
                    style={{
                      position: 'absolute',
                      right: '-20px',
                      top: '-20px',
                      width: '60px',
                      height: '60px',
                      transform: 'rotate(30deg)',
                      opacity: 0.8
                    }}
                  />
                </div>
              )}

              <div className="button-group">
                <button
                  onClick={startWebcam}
                  disabled={isWebcamActive}
                  className="btn btn-primary"
                  style={{
                    outline: 'none',
                    color: isWebcamActive ? '#888888' : '#000080',
                    fontWeight: 'bold',
                    opacity: isWebcamActive ? 0.5 : 1,
                    cursor: isWebcamActive ? 'not-allowed' : 'pointer',
                    backgroundColor: isWebcamActive ? '#d0d0d0' : '#c0c0c0',
                    border: '2px solid',
                    borderColor: isWebcamActive ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf'
                  }}
                >
                  ▶ Start
                </button>
                <button
                  onClick={() => {
                    playClickSound()
                    if (countdownValue > 0) {
                      // Cancel countdown if active
                      if (countdownIntervalRef.current) {
                        clearInterval(countdownIntervalRef.current)
                        countdownIntervalRef.current = null
                      }
                      setCountdownValue(0)
                    } else {
                      // Stop webcam if no countdown
                      stopWebcam()
                    }
                  }}
                  disabled={!isWebcamActive && countdownValue === 0}
                  className="btn btn-secondary"
                  style={{
                    outline: 'none',
                    color: !isWebcamActive && countdownValue === 0 ? '#888888' : '#000080',
                    fontWeight: 'bold',
                    opacity: !isWebcamActive && countdownValue === 0 ? 0.5 : 1,
                    cursor: !isWebcamActive && countdownValue === 0 ? 'not-allowed' : 'pointer',
                    backgroundColor: !isWebcamActive && countdownValue === 0 ? '#d0d0d0' : '#c0c0c0',
                    border: '2px solid',
                    borderColor: !isWebcamActive && countdownValue === 0 ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf'
                  }}
                >
                  ■ Stop
                </button>
                <button
                  onClick={handleCaptureWithTimer}
                  disabled={!isWebcamActive}
                  className="btn btn-capture"
                  style={{
                    outline: 'none',
                    color: !isWebcamActive ? '#888888' : '#000080',
                    fontWeight: 'bold',
                    opacity: !isWebcamActive ? 0.5 : 1,
                    cursor: !isWebcamActive ? 'not-allowed' : 'pointer',
                    backgroundColor: !isWebcamActive ? '#d0d0d0' : '#c0c0c0',
                    border: '2px solid',
                    borderColor: !isWebcamActive ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf'
                  }}
                >
                  ● Capture
                </button>
                
                {/* Timer dropdown button */}
                <div style={{ position: 'relative', marginLeft: '4px' }}>
                  <button
                    onClick={() => {
                      playClickSound()
                      setShowTimerDropdown(!showTimerDropdown)
                    }}
                    disabled={!isWebcamActive}
                    className="btn btn-timer"
                    style={{
                      outline: 'none',
                      color: !isWebcamActive ? '#888888' : '#000080',
                      fontWeight: 'bold',
                      opacity: !isWebcamActive ? 0.5 : 1,
                      cursor: !isWebcamActive ? 'not-allowed' : 'pointer',
                      backgroundColor: !isWebcamActive ? '#d0d0d0' : '#c0c0c0',
                      border: '2px solid',
                      borderColor: !isWebcamActive ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf',
                      minWidth: '60px'
                    }}
                  >
                    ⏱ {timerOption === 'none' ? 'Timer' : timerOption}
                  </button>
                  
                  {/* Dropdown menu */}
                  {showTimerDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: '0',
                      backgroundColor: '#c0c0c0',
                      border: '2px solid',
                      borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                      minWidth: '70px',
                      marginTop: '2px',
                      zIndex: 2000
                    }}>
                      {['none', '3s', '5s', '10s'].map((option) => (
                        <div
                          key={option}
                          onClick={() => {
                            playClickSound()
                            setTimerOption(option)
                            setShowTimerDropdown(false)
                          }}
                          style={{
                            padding: '4px 8px',
                            cursor: 'pointer',
                            backgroundColor: timerOption === option ? '#000080' : '#c0c0c0',
                            color: timerOption === option ? '#ffff00' : '#000080',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            userSelect: 'none',
                            ':hover': {
                              backgroundColor: '#000080',
                              color: '#ffff00'
                            }
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#000080'
                            e.target.style.color = '#ffff00'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = timerOption === option ? '#000080' : '#c0c0c0'
                            e.target.style.color = timerOption === option ? '#ffff00' : '#000080'
                          }}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    playClickSound()
                    setShowControls(!showControls)
                  }}
                  disabled={!showVijayImage}
                  className="btn btn-primary"
                  style={{ 
                    outline: 'none', 
                    color: !showVijayImage ? '#888888' : '#000080', 
                    fontWeight: 'bold',
                    opacity: !showVijayImage ? 0.5 : 1,
                    cursor: !showVijayImage ? 'not-allowed' : 'pointer',
                    backgroundColor: !showVijayImage ? '#d0d0d0' : '#c0c0c0'
                  }}
                >
                  ⊙ {showControls ? 'Hide' : 'Show'} Controls
                </button>
              </div>
            </div>

            <div className="statusbar">
              <div className="left">Thalapathy Cam</div>
              <div className="right">&nbsp;</div>
            </div>
          </div>
        </animated.div>
      )}

      {/* Controls Window - Separate Window */}
      {showControls && (
        <div className="main-container secondary window" style={{
          position: 'fixed',
          top: `${controlsWindowPos.y}px`,
          left: `${controlsWindowPos.x}px`,
          zIndex: 1002
        }}>
          <div 
            className="title"
            onMouseDown={(e) => handleMouseDown(e, 'controlsWindow', controlsWindowPos)}
            style={{ 
              cursor: dragState?.window === 'controlsWindow' ? 'grabbing' : 'grab',
              borderBottom: dragState?.window === 'controlsWindow' ? '2px solid #ffffff' : 'none'
            }}
          >
            <h1>⚙️ Controls</h1>
            <button 
              onClick={() => {
                playClickSound()
                setShowControls(false)
              }}
              style={{
                marginLeft: 'auto',
                padding: '2px 6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                outline: 'none',
                backgroundColor: '#d85c5c'
              }}
            >
              ✕
            </button>
          </div>



          <div className="container-inner controls-container">
            {!isWebcamActive && (
              <>
                <p>Welcome to Vijay Cam</p>
                <p>Click "Start" to open the web cam and try out filters, and then capture!</p>
              </>
            )}

            {isWebcamActive && (
              <>
                {showVijayImage && (
                  <>
                    <h3>Vijay Position & Size</h3>

                    <div className="control-group">
                      <label>
                        Move Horizontally: <span className="value">{offsetX}</span>
                      </label>
                      <div style={{ position: 'relative', height: '24px', display: 'flex', alignItems: 'center' }}>
                        <div style={{ position: 'absolute', width: '100%', height: '1px', backgroundColor: '#666', top: '50%' }}></div>
                        <input
                          type="range"
                          min="-150"
                          max="150"
                          value={offsetX}
                          onChange={(e) => setOffsetX(Number(e.target.value))}
                          className="slider"
                          style={{ position: 'relative', zIndex: 1, width: '100%' }}
                        />
                      </div>
                    </div>

                    <div className="control-group">
                      <label>
                        Move Vertically: <span className="value">{offsetY}</span>
                      </label>
                      <div style={{ position: 'relative', height: '24px', display: 'flex', alignItems: 'center' }}>
                        <div style={{ position: 'absolute', width: '100%', height: '1px', backgroundColor: '#666', top: '50%' }}></div>
                        <input
                          type="range"
                          min="-400"
                          max="150"
                          value={offsetY}
                          onChange={(e) => setOffsetY(Number(e.target.value))}
                          className="slider"
                          style={{ position: 'relative', zIndex: 1, width: '100%' }}
                        />
                      </div>
                    </div>

                    <div className="control-group">
                      <label>
                        Scale: <span className="value">{scale.toFixed(2)}x</span>
                      </label>
                      <div style={{ position: 'relative', height: '24px', display: 'flex', alignItems: 'center' }}>
                        <div style={{ position: 'absolute', width: '100%', height: '1px', backgroundColor: '#666', top: '50%' }}></div>
                        <input
                          type="range"
                          min="0.5"
                          max="3"
                          step="0.1"
                          value={scale}
                          onChange={(e) => setScale(Number(e.target.value))}
                          className="slider"
                          style={{ position: 'relative', zIndex: 1, width: '100%' }}
                        />
                      </div>
                    </div>

                    <div className="control-group">
                      <label>
                        Rotate: <span className="value">{rotation}°</span>
                      </label>
                      <div style={{ position: 'relative', height: '24px', display: 'flex', alignItems: 'center' }}>
                        <div style={{ position: 'absolute', width: '100%', height: '1px', backgroundColor: '#666', top: '50%' }}></div>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          value={rotation}
                          onChange={(e) => setRotation(Number(e.target.value))}
                          className="slider"
                          style={{ position: 'relative', zIndex: 1, width: '100%' }}
                        />
                      </div>
                    </div>

                    <p className="tips">💡 Adjust the controls to change Vijay's position to your liking, then capture!</p>
                  </>
                )}


              </>
            )}
          </div>

          <div className="statusbar">
            <div className="left">^_^</div>
            {isWebcamActive && (
              <button
                onClick={() => {
                  playClickSound()
                  setOffsetX(-22)
                  setOffsetY(-289)
                  setScale(1.6)
                  setRotation(0)
                  setBowOffsetX(0)
                  setBowOffsetY(-15)
                  setBowScale(0.2)
                  setBowRotation(35)
                }}
                style={{
                  marginLeft: 'auto',
                  padding: '2px 12px',
                  backgroundColor: '#c0c0c0',
                  color: 'black',
                  border: '1px solid',
                  borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '10px',
                  fontFamily: 'Arial, sans-serif',
                  flex: 1,
                  maxWidth: '150px',
                  outline: 'none'
                }}
              >
                Reset Position
              </button>
            )}
          </div>
        </div>
      )}

      {/* Downloads Folder Window */}
      {showDownloadsFolder && (
        <div id="downloads-window" style={{
          position: 'fixed',
          top: `${downloadsPos.y}px`,
          left: `${downloadsPos.x}px`,
          backgroundColor: '#c0c0c0',
          border: '2px solid',
          borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
          boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040, inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
          width: '600px',
          maxHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1001
        }}>
          {/* Title bar */}
          <div 
            style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: '#ffff00',
              padding: '2px 2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none',
              cursor: dragState?.window === 'downloads' ? 'grabbing' : 'grab',
              borderBottom: dragState?.window === 'downloads' ? '2px solid #ffffff' : 'none'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'downloads', downloadsPos)}
          >
            <h1 style={{ margin: '2px 4px', fontSize: '14px', fontWeight: 'bold' }}>Downloads ⋆｡°✩</h1>
            <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
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
              <button 
                onClick={handleCloseDownloads}
                style={{
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  outline: 'none',
                  backgroundColor: '#d85c5c',
                  color: '#ffffff'
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* File list */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '4px',
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'flex-start',
            gap: '10px'
          }}>
            {(() => {
              // Calculate items that fit horizontally (each item ~80px with gap and padding)
              const downloadWindowWidth = 600
              const itemWidth = 80 // 70px minWidth + 10px gap
              const containerPadding = 8 // 4px on each side
              const availableWidth = downloadWindowWidth - containerPadding
              const itemsPerRow = Math.max(1, Math.floor(availableWidth / itemWidth))
              
              const startIdx = downloadsPage * itemsPerRow
              const endIdx = startIdx + itemsPerRow
              const pageImages = capturedImages.slice(startIdx, endIdx)
              
              return pageImages.map((image) => (
                <div
                  key={image.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px',
                    minWidth: '70px',
                    textAlign: 'center',
                    borderRadius: '2px',
                    transition: 'background 0.1s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#000080'
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'black'
                  }}
                >
                  <div
                    onMouseDown={(e) => {
                      if (e.button === 0) {
                        setDraggedImageId(image.id)
                        setDragImageSource('downloads')
                        setDragImagePos({ x: e.clientX - 30, y: e.clientY - 30 })
                      }
                    }}
                    onClick={() => {
                      playClickSound()
                      setSelectedImage(image)
                    }}
                    style={{
                      cursor: 'grab',
                      position: 'relative',
                      userSelect: 'none'
                    }}
                  >
                    <img 
                      src={image.dataUrl} 
                      alt={`Capture ${image.id}`}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        border: '1px solid #808080'
                      }}
                    />
                  </div>
                  <div style={{
                    fontSize: '10px',
                    fontFamily: 'Arial, sans-serif',
                    wordBreak: 'break-all'
                  }}>
                    {image.name || `vijay_${image.id}`}
                  </div>
                </div>
              ))
            })()}
          </div>

          {/* Pagination controls */}
          <div style={{
            display: 'flex',
            height: '24px',
            borderTop: '1px solid #dfdfdf',
            backgroundColor: '#c0c0c0',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '4px',
            paddingRight: '4px',
            gap: '4px'
          }}>
            <button
              onClick={() => {
                playClickSound()
                setDownloadsPage(Math.max(0, downloadsPage - 1))
              }}
              disabled={downloadsPage === 0}
              style={{
                padding: '2px 6px',
                cursor: downloadsPage === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                backgroundColor: downloadsPage === 0 ? '#a0a0a0' : '#c0c0c0',
                border: '2px solid',
                borderColor: downloadsPage === 0 ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf',
                fontSize: '12px',
                outline: 'none',
                WebkitAppearance: 'none',
                boxShadow: 'none',
                userSelect: 'none'
              }}
            >
              ◄ Prev
            </button>
            <span style={{
              fontSize: '12px',
              whiteSpace: 'nowrap'
            }}>
              {capturedImages.length === 0 ? 'No images' : `Page ${downloadsPage + 1}/${Math.ceil(capturedImages.length / Math.max(1, Math.floor((600 - 8) / 80)))}`}
            </span>
            <button
              onClick={() => {
                playClickSound()
                setDownloadsPage(downloadsPage + 1)
              }}
              disabled={(downloadsPage + 1) * Math.max(1, Math.floor((600 - 8) / 80)) >= capturedImages.length}
              style={{
                padding: '2px 6px',
                cursor: (downloadsPage + 1) * Math.max(1, Math.floor((600 - 8) / 80)) >= capturedImages.length ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                backgroundColor: (downloadsPage + 1) * Math.max(1, Math.floor((600 - 8) / 80)) >= capturedImages.length ? '#a0a0a0' : '#c0c0c0',
                border: '2px solid',
                borderColor: (downloadsPage + 1) * Math.max(1, Math.floor((600 - 8) / 80)) >= capturedImages.length ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf',
                fontSize: '12px',
                outline: 'none',
                WebkitAppearance: 'none',
                boxShadow: 'none',
                userSelect: 'none'
              }}
            >
              Next ►
            </button>
          </div>
        </div>
      )}

      {/* Music Player Modal */}
      {showMusicPlayer && (
        <div style={{
          position: 'fixed',
          top: `${musicPlayerPos.y}px`,
          left: `${musicPlayerPos.x}px`,
          backgroundColor: '#c0c0c0',
          border: '2px solid',
          borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
          boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040, inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
          width: '410px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          transform: 'scale(0.7)',
          transformOrigin: 'top left'
        }}>
          {/* Title bar */}
          <div 
            style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: '#ffff00',
              padding: '2px 2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none',
              cursor: dragState?.window === 'musicPlayer' ? 'grabbing' : 'grab',
              borderBottom: dragState?.window === 'musicPlayer' ? '2px solid #ffffff' : 'none'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'musicPlayer', musicPlayerPos)}
          >
            <h1 style={{ margin: '2px 4px', fontSize: '14px', fontWeight: 'bold' }}>Music Player ⋆⭒˚｡⋆</h1>
            <button 
              onClick={handleCloseMusicPlayer}
              style={{
                marginLeft: 'auto',
                padding: '2px 6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                outline: 'none',
                backgroundColor: '#d85c5c'
              }}
            >
              ✕
            </button>
          </div>

          {/* Player content */}
          <div style={{
            padding: '10px',
            textAlign: 'center'
          }}>
            {/* Album cover display */}
            <div style={{
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <img 
                src={MUSIC_COVERS[currentSongIndex]}
                alt={`Album ${currentSongIndex + 1}`}
                style={{
                  width: '135px',
                  height: '135px',
                  border: '3px solid',
                  borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                  cursor: 'pointer',
                  boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #404040'
                }}
                onClick={() => {
                  playClickSound()
                  setShowMusicPlayer(false)
                }}
              />
            </div>

            <div style={{
              marginBottom: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#000080',
              minHeight: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}>
              {PLAYLIST[currentSongIndex].title}
            </div>

            {/* Play/Pause and Navigation arrows */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '8px',
              paddingLeft: '15px'
            }}>
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <button
                  onClick={handlePreviousSong}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '24px',
                    padding: '0',
                    outline: 'none',
                    color: '#000080'
                  }}
                >
                  ◀
                </button>
                <button
                  onClick={handlePlayPauseMusic}
                  style={{
                    width: '60px',
                    padding: '6px',
                    backgroundColor: '#c0c0c0',
                    color: 'black',
                    border: '1px solid',
                    borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '10px',
                    fontFamily: 'Arial, sans-serif',
                    outline: 'none'
                  }}
                >
                  {isMusciPlaying ? 'PAUSE' : 'PLAY'}
                </button>
                <button
                  onClick={handleNextSong}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '24px',
                    padding: '0',
                    outline: 'none',
                    color: '#000080'
                  }}
                >
                  ▶
                </button>
              </div>
              <button
                onClick={() => {
                  playClickSound()
                  setReplayCurrentSong(!replayCurrentSong)
                }}
                style={{
                  padding: '2px 4px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  border: '2px outset #dfdfdf',
                  background: replayCurrentSong ? '#ffff00' : '#000080',
                  color: replayCurrentSong ? '#000080' : '#ffffff',
                  fontFamily: '"MS Sans Serif", Arial, sans-serif',
                  outline: 'none',
                  textAlign: 'center',
                  transition: 'all 0.1s',
                  lineHeight: '1'
                }}
                title="Replay current song"
              >
                ↻
              </button>
            </div>

            {/* Sound Waves Animation */}
            <div key={`waves-${currentSongIndex}`} style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '20px',
              gap: '3px',
              marginBottom: '5px'
            }}>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '1.5px',
                    height: isMusciPlaying ? '15px' : '4px',
                    backgroundColor: '#000080',
                    borderRadius: '1px',
                    animation: isMusciPlaying ? `wave 1.5s ease-in-out ${i * 0.3}s infinite` : 'none',
                    transition: 'height 0.3s ease'
                  }}
                />
              ))}
              <style>{`
                @keyframes wave {
                  0%, 100% { height: 4px; }
                  50% { height: 15px; }
                }
              `}</style>
            </div>

            {/* Seekable Audio Player */}
            <div style={{
              marginTop: '3px',
              marginBottom: '5px'
            }}>
              <input
                ref={musicSliderRef}
                type="range"
                min="0"
                max="100"
                value={isDraggingSlider ? sliderPosition : (bgMusicRef.current ? (bgMusicRef.current.currentTime / bgMusicRef.current.duration * 100) || 0 : 0)}
                onMouseDown={() => setIsDraggingSlider(true)}
                onMouseUp={() => setIsDraggingSlider(false)}
                onKeyDown={(e) => {
                  if (e.code === 'ArrowRight') {
                    e.preventDefault()
                    handleNextSong()
                  }
                  if (e.code === 'ArrowLeft') {
                    e.preventDefault()
                    handlePreviousSong()
                  }
                }}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value)
                  setSliderPosition(newValue)
                  if (bgMusicRef.current) {
                    bgMusicRef.current.currentTime = (newValue / 100) * bgMusicRef.current.duration
                  }
                }}
                style={{
                  width: '100%',
                  height: '6px',
                  cursor: 'pointer',
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  background: '#dfdfdf',
                  borderRadius: '3px',
                  outline: 'none'
                }}
              />
              <style>{`
                input[type="range"]::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 14px;
                  height: 14px;
                  background: #000080;
                  cursor: pointer;
                  border-radius: 2px;
                  border: 1px solid #dfdfdf;
                }
                input[type="range"]::-moz-range-thumb {
                  width: 14px;
                  height: 14px;
                  background: #000080;
                  cursor: pointer;
                  border-radius: 2px;
                  border: 1px solid #dfdfdf;
                }
              `}</style>
            </div>
          </div>

          {/* Status bar */}
          <div style={{
            display: 'flex',
            height: '20px',
            borderTop: '1px solid #dfdfdf',
            backgroundColor: '#c0c0c0',
            fontSize: '10px',
            alignItems: 'center',
            paddingLeft: '2px'
          }}>
            {(() => {
              const currentTime = isDraggingSlider 
                ? (sliderPosition / 100) * (audioDuration || 150)
                : audioCurrentTime
              const minutes = Math.floor(currentTime / 60)
              const seconds = Math.floor(currentTime % 60)
              const durationMinutes = Math.floor((audioDuration || 150) / 60)
              const durationSeconds = Math.floor((audioDuration || 150) % 60)
              return (
                <span>
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')} / {String(durationMinutes).padStart(2, '0')}:{String(durationSeconds).padStart(2, '0')}
                </span>
              )
            })()}
          </div>
        </div>
      )}

      {/* Trash Window */}
      {showTrash && (
        <div id="trash-window" style={{
          position: 'fixed',
          top: `${trashPos.y}px`,
          left: `${trashPos.x}px`,
          backgroundColor: '#c0c0c0',
          border: '2px solid',
          borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
          boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040, inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
          width: '600px',
          maxHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000
        }}>
          {/* Title bar */}
          <div 
            style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: '#ffff00',
              padding: '2px 2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none',
              cursor: dragState?.window === 'trash' ? 'grabbing' : 'grab',
              borderBottom: dragState?.window === 'trash' ? '2px solid #ffffff' : 'none'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'trash', trashPos)}
          >
            <h1 style={{ margin: '2px 4px', fontSize: '14px', fontWeight: 'bold' }}>Trash ⋆｡°✩</h1>
            <div style={{ display: 'flex', gap: '4px', marginRight: '2px' }}>
              {trashedImages.length > 0 && (
                <button 
                  onClick={() => setConfirmClearTrash(true)}
                  style={{
                    padding: '2px 6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    backgroundColor: '#c0c0c0',
                    border: '2px solid',
                    borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                    fontSize: '12px'
                  }}
                >
                  Clear Trash
                </button>
              )}
              <button 
                onClick={handleCloseTrash}
                style={{
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  outline: 'none',
                  backgroundColor: '#d85c5c'
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* File list */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '4px',
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'flex-start',
            gap: '10px'
          }}>
            {trashedImages.length === 0 ? (
              <div style={{
                width: '100%',
                textAlign: 'center',
                padding: '40px 20px',
                color: '#666',
                fontSize: '14px'
              }}>
                Trash is empty
              </div>
            ) : (
              (() => {
                // Calculate items that fit horizontally (each item ~80px with gap and padding)
                const trashWindowWidth = 600
                const itemWidth = 80 // 70px minWidth + 10px gap
                const containerPadding = 8 // 4px on each side
                const availableWidth = trashWindowWidth - containerPadding
                const itemsPerRow = Math.max(1, Math.floor(availableWidth / itemWidth))
                
                const startIdx = trashPage * itemsPerRow
                const endIdx = startIdx + itemsPerRow
                const pageImages = trashedImages.slice(startIdx, endIdx)
                
                return pageImages.map((image) => ( 
                  <div
                    key={image.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px',
                      minWidth: '70px',
                      textAlign: 'center',
                      borderRadius: '2px',
                      transition: 'background 0.1s',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#000080'
                      e.currentTarget.style.color = 'white'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'black'
                    }}
                  >
                    <div
                      onMouseDown={(e) => {
                        if (e.button === 0) {
                          setDraggedImageId(image.id)
                          setDragImageSource('trash')
                          setDragImagePos({ x: e.clientX - 30, y: e.clientY - 30 })
                        }
                      }}
                      onClick={() => {
                        playClickSound()
                        setSelectedTrashImage(image)
                      }}
                      style={{
                        cursor: 'grab',
                        position: 'relative',
                        userSelect: 'none'
                      }}
                    >
                      <img 
                        src={image.dataUrl} 
                        alt={`Trash ${image.id}`}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          border: '1px solid #808080',
                          opacity: 0.7,
                          position: 'relative'
                        }}
                      />
                    </div>
                    <div style={{
                      fontSize: '10px',
                      fontFamily: 'Arial, sans-serif',
                      wordBreak: 'break-all'
                    }}>
                      {image.name || `trash_${image.id}`}
                    </div>
                  </div>
                ))
              })()
            )}
          </div>

          {/* Pagination controls */}
          <div style={{
            display: 'flex',
            height: '24px',
            borderTop: '1px solid #dfdfdf',
            backgroundColor: '#c0c0c0',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '4px',
            paddingRight: '4px',
            gap: '4px'
          }}>
            <button
              onClick={() => {
                playClickSound()
                setTrashPage(Math.max(0, trashPage - 1))
              }}
              disabled={trashPage === 0}
              style={{
                padding: '2px 6px',
                cursor: trashPage === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                backgroundColor: trashPage === 0 ? '#a0a0a0' : '#c0c0c0',
                border: '2px solid',
                borderColor: trashPage === 0 ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf',
                fontSize: '12px',
                outline: 'none',
                WebkitAppearance: 'none',
                boxShadow: 'none',
                userSelect: 'none'
              }}
            >
              ◄ Prev
            </button>
            <span style={{
              fontSize: '12px',
              whiteSpace: 'nowrap'
            }}>
              {trashedImages.length === 0 ? 'No images' : `Page ${trashPage + 1}/${Math.ceil(trashedImages.length / Math.max(1, Math.floor((600 - 8) / 80)))}`}
            </span>
            <button
              onClick={() => {
                playClickSound()
                setTrashPage(trashPage + 1)
              }}
              disabled={(trashPage + 1) * Math.max(1, Math.floor((600 - 8) / 80)) >= trashedImages.length}
              style={{
                padding: '2px 6px',
                cursor: (trashPage + 1) * Math.max(1, Math.floor((600 - 8) / 80)) >= trashedImages.length ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                backgroundColor: (trashPage + 1) * Math.max(1, Math.floor((600 - 8) / 80)) >= trashedImages.length ? '#a0a0a0' : '#c0c0c0',
                border: '2px solid',
                borderColor: (trashPage + 1) * Math.max(1, Math.floor((600 - 8) / 80)) >= trashedImages.length ? '#808080 #dfdfdf #dfdfdf #808080' : '#dfdfdf #808080 #808080 #dfdfdf',
                fontSize: '12px',
                outline: 'none',
                WebkitAppearance: 'none',
                boxShadow: 'none',
                userSelect: 'none'
              }}
            >
              Next ►
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {imageToDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1002,
          cursor: 'auto'
        }} onClick={(e) => e.stopPropagation()}>
          <div style={{
            backgroundColor: '#c0c0c0',
            border: '2px solid',
            borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
            boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040',
            display: 'flex',
            flexDirection: 'column',
            width: '300px',
            cursor: 'auto'
          }}>
            {/* Title bar */}
            <div style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: 'white',
              padding: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none'
            }}>
              <h2 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>⚠️ Confirm Delete</h2>
            </div>

            {/* Content */}
            <div style={{
              padding: '20px',
              textAlign: 'center'
            }}>
              <p style={{ marginBottom: '20px', fontSize: '14px' }}>
                Are you sure you want to delete this photo?
              </p>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>
                This action cannot be undone.
              </p>

              {/* Buttons */}
              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={confirmDeleteImage}
                  style={{
                    padding: '6px 20px',
                    backgroundColor: '#c00000',
                    color: 'white',
                    border: '1px solid #800000',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                >
                  Yes, Delete
                </button>
                <button
                  onClick={cancelDeleteImage}
                  style={{
                    padding: '6px 20px',
                    backgroundColor: '#c0c0c0',
                    color: 'black',
                    border: '1px solid',
                    borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Confirmation Modal */}
      {imageToDeletePermanently && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1004,
          cursor: 'auto'
        }} onClick={(e) => e.stopPropagation()}>
          <div style={{
            backgroundColor: '#c0c0c0',
            border: '2px solid',
            borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
            boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040',
            display: 'flex',
            flexDirection: 'column',
            width: '320px',
            cursor: 'auto'
          }}>
            {/* Title bar */}
            <div style={{
              background: 'linear-gradient(to right, #c00000, #ff0000)',
              color: 'white',
              padding: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none'
            }}>
              <h2 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>⚠️ Delete Forever?</h2>
            </div>

            {/* Content */}
            <div style={{
              padding: '20px',
              textAlign: 'center'
            }}>
              <p style={{ marginBottom: '20px', fontSize: '14px' }}>
                Permanently delete this photo from trash?
              </p>
              <p style={{ fontSize: '12px', color: '#c00000', marginBottom: '20px', fontWeight: 'bold' }}>
                This cannot be recovered!
              </p>

              {/* Buttons */}
              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={confirmPermanentDeleteImage}
                  style={{
                    padding: '6px 20px',
                    backgroundColor: '#c00000',
                    color: 'white',
                    border: '1px solid #800000',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                >
                  Delete Forever
                </button>
                <button
                  onClick={cancelPermanentDeleteImage}
                  style={{
                    padding: '6px 20px',
                    backgroundColor: '#c0c0c0',
                    color: 'black',
                    border: '1px solid',
                    borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                >
                  Keep
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear Trash Confirmation Modal */}
      {confirmClearTrash && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1004,
          cursor: 'auto'
        }} onClick={(e) => e.stopPropagation()}>
          <div style={{
            backgroundColor: '#c0c0c0',
            border: '2px solid',
            borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
            borderRadius: '4px',
            boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080, 1px 1px 0 #000000, -1px -1px 0 #dfdfdf',
            padding: '0',
            flexDirection: 'column',
            width: '350px',
            cursor: 'auto'
          }}>
            {/* Title bar */}
            <div style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: 'white',
              padding: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none'
            }}>
              <h2 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>⚠️ Clear All Trash</h2>
            </div>

            {/* Content */}
            <div style={{
              padding: '20px',
              textAlign: 'center'
            }}>
              <p style={{ marginBottom: '15px', fontSize: '14px' }}>
                Are you sure you want to permanently delete ALL items in trash?
              </p>
              <p style={{ fontSize: '12px', color: '#c00000', marginBottom: '20px', fontWeight: 'bold' }}>
                ⚠️ This action cannot be undone. {trashedImages.length} item{trashedImages.length !== 1 ? 's' : ''} will be deleted forever.
              </p>

              {/* Buttons */}
              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={clearAllTrash}
                  style={{
                    padding: '6px 20px',
                    backgroundColor: '#c00000',
                    color: 'white',
                    border: '1px solid #800000',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                >
                  Yes, Delete All
                </button>
                <button
                  onClick={cancelClearTrash}
                  style={{
                    padding: '6px 20px',
                    backgroundColor: '#c0c0c0',
                    color: 'black',
                    border: '1px solid',
                    borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1003,
          cursor: 'pointer'
        }} onClick={() => {
          playClickSound()
          setSelectedImage(null)
        }}>
          <div 
            ref={imageModalRef}
            style={{
            backgroundColor: '#c0c0c0',
            border: '2px solid',
            borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
            boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040',
            maxWidth: '95%',
            maxHeight: '95%',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'auto',
            width: '800px'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Title bar */}
            <div style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: 'white',
              padding: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none'
            }}>
              <h2 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>💋 {selectedImage.name || `Capture ${selectedImage.id}`}</h2>
              <button 
                onClick={() => {
                  playClickSound()
                  setSelectedImage(null)
                }}
                style={{
                  marginLeft: 'auto',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  outline: 'none',
                  backgroundColor: '#d85c5c'
                }}
              >
                ✕
              </button>
            </div>

            {/* Main content area */}
            <div style={{
              display: 'flex',
              flex: 1,
              overflow: 'hidden'
            }}>
              {/* Image viewer */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}>
                {/* Navigation arrows and image */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  gap: '20px',
                  padding: '10px',
                  position: 'relative'
                }}>
                  {(() => {
                    const currentIdx = capturedImages.findIndex(img => img.id === selectedImage.id)
                    const hasPrev = currentIdx > 0
                    
                    return (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          playClickSound()
                          if (hasPrev) setSelectedImage(capturedImages[currentIdx - 1])
                        }}
                        disabled={!hasPrev}
                        style={{
                          padding: '6px 10px',
                          cursor: hasPrev ? 'pointer' : 'not-allowed',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          color: hasPrev ? '#dfdfdf' : '#606060',
                          backgroundColor: hasPrev ? '#c0c0c0' : '#909090',
                          border: '2px solid',
                          borderColor: hasPrev ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                          position: 'absolute',
                          left: '5px',
                          opacity: hasPrev ? 1 : 0.5,
                          outline: 'none'
                        }}
                      >
                        ◄
                      </button>
                    )
                  })()}

                  <img 
                    src={selectedImage.dataUrl} 
                    alt="Full size capture"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />

                  {(() => {
                    const currentIdx = capturedImages.findIndex(img => img.id === selectedImage.id)
                    const hasNext = currentIdx < capturedImages.length - 1
                    
                    return (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          playClickSound()
                          if (hasNext) setSelectedImage(capturedImages[currentIdx + 1])
                        }}
                        disabled={!hasNext}
                        style={{
                          padding: '6px 10px',
                          cursor: hasNext ? 'pointer' : 'not-allowed',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          color: hasNext ? '#dfdfdf' : '#606060',
                          backgroundColor: hasNext ? '#c0c0c0' : '#909090',
                          border: '2px solid',
                          borderColor: hasNext ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                          position: 'absolute',
                          right: '5px',
                          opacity: hasNext ? 1 : 0.5,
                          outline: 'none'
                        }}
                      >
                        ►
                      </button>
                    )
                  })()}
                </div>

                {/* Bottom controls */}
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  padding: '6px 10px',
                  borderTop: '1px solid #dfdfdf',
                  backgroundColor: '#c0c0c0',
                  justifyContent: 'space-around',
                  alignItems: 'center'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      playClickSound()
                      setShowSaveOptions(true)
                    }}
                    style={{
                      padding: '6px 14px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      color: '#ffff00',
                      backgroundColor: '#1084d7',
                      border: '2px solid',
                      borderColor: '#1b9fff #0a4a99 #0a4a99 #1b9fff',
                      textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
                      minWidth: '100px',
                      textAlign: 'center',
                      outline: 'none',
                      WebkitAppearance: 'none',
                      boxShadow: 'none'
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      playClickSound()
                      moveImageToTrash(selectedImage.id)
                    }}
                    style={{
                      padding: '6px 14px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      color: '#ffff00',
                      backgroundColor: '#c00000',
                      border: '2px solid',
                      borderColor: '#ff4444 #800000 #800000 #ff4444',
                      textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
                      minWidth: '100px',
                      textAlign: 'center',
                      outline: 'none',
                      WebkitAppearance: 'none',
                      boxShadow: 'none'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* File info panel */}
              <div style={{
                width: '180px',
                borderLeft: '1px solid #dfdfdf',
                backgroundColor: '#c0c0c0',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                fontSize: '11px',
                fontFamily: 'MS Sans Serif, Arial, sans-serif',
                overflow: 'auto'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#000080' }}>File Properties</div>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Name:</strong>
                  <div style={{ wordBreak: 'break-word', color: '#333' }}>{selectedImage.name || `vijay_${selectedImage.id}`}</div>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Date:</strong>
                  <div style={{ color: '#333' }}>
                    {selectedImage.timestamp 
                      ? new Date(selectedImage.timestamp).toLocaleDateString('en-AU', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })
                      : 'Unknown'}
                  </div>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Type:</strong>
                  <div style={{ color: '#333' }}>PNG Image</div>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Size:</strong>
                  <div style={{ color: '#333' }}>
                    {(() => {
                      const sizeBytes = selectedImage.dataUrl.length
                      const sizeKB = (sizeBytes / 1024).toFixed(1)
                      return `${sizeKB} KB`
                    })()}
                  </div>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Index:</strong>
                  <div style={{ color: '#333' }}>
                    {capturedImages.findIndex(img => img.id === selectedImage.id) + 1} / {capturedImages.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trash Image Viewer Modal */}
      {selectedTrashImage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1003,
          cursor: 'pointer'
        }} onClick={() => {
          playClickSound()
          setSelectedTrashImage(null)
        }}>
          <div style={{
            backgroundColor: '#c0c0c0',
            border: '2px solid',
            borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
            boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040',
            maxWidth: '95%',
            maxHeight: '95%',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'auto',
            width: '800px'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Title bar */}
            <div style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: 'white',
              padding: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none'
            }}>
              <h2 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>💋 {selectedTrashImage.name || `Capture ${selectedTrashImage.id}`}</h2>
              <button 
                onClick={() => {
                  playClickSound()
                  setSelectedTrashImage(null)
                }}
                style={{
                  marginLeft: 'auto',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  outline: 'none',
                  backgroundColor: '#d85c5c'
                }}
              >
                ✕
              </button>
            </div>

            {/* Main content area */}
            <div style={{
              display: 'flex',
              flex: 1,
              overflow: 'hidden'
            }}>
              {/* Image viewer */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
              }}>
                {/* Navigation arrows and image */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  gap: '20px',
                  padding: '10px',
                  position: 'relative'
                }}>
                  {(() => {
                    const currentIdx = trashedImages.findIndex(img => img.id === selectedTrashImage.id)
                    const hasPrev = currentIdx > 0
                    
                    return (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          playClickSound()
                          if (hasPrev) setSelectedTrashImage(trashedImages[currentIdx - 1])
                        }}
                        disabled={!hasPrev}
                        style={{
                          padding: '6px 10px',
                          cursor: hasPrev ? 'pointer' : 'not-allowed',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          color: hasPrev ? '#dfdfdf' : '#606060',
                          backgroundColor: hasPrev ? '#c0c0c0' : '#909090',
                          border: '2px solid',
                          borderColor: hasPrev ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                          position: 'absolute',
                          left: '5px',
                          zIndex: 10,
                          opacity: hasPrev ? 1 : 0.5
                        }}
                      >
                        ◄
                      </button>
                    )
                  })()}

                  <img 
                    src={selectedTrashImage.dataUrl} 
                    alt="Full size trash capture"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />

                  {(() => {
                    const currentIdx = trashedImages.findIndex(img => img.id === selectedTrashImage.id)
                    const hasNext = currentIdx < trashedImages.length - 1
                    
                    return (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          playClickSound()
                          if (hasNext) setSelectedTrashImage(trashedImages[currentIdx + 1])
                        }}
                        disabled={!hasNext}
                        style={{
                          padding: '6px 10px',
                          cursor: hasNext ? 'pointer' : 'not-allowed',
                          fontWeight: 'bold',
                          fontSize: '16px',
                          color: hasNext ? '#dfdfdf' : '#606060',
                          backgroundColor: hasNext ? '#c0c0c0' : '#909090',
                          border: '2px solid',
                          borderColor: hasNext ? '#dfdfdf #808080 #808080 #dfdfdf' : '#808080 #dfdfdf #dfdfdf #808080',
                          position: 'absolute',
                          right: '5px',
                          opacity: hasNext ? 1 : 0.5
                        }}
                      >
                        ►
                      </button>
                    )
                  })()}
                </div>

                {/* Bottom controls */}
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  padding: '6px 10px',
                  borderTop: '1px solid #dfdfdf',
                  backgroundColor: '#c0c0c0',
                  justifyContent: 'space-around',
                  alignItems: 'center'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      restoreImageFromTrash(selectedTrashImage.id)
                    }}
                    style={{
                      padding: '6px 14px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      color: '#ffff00',
                      backgroundColor: '#1084d7',
                      border: '2px solid',
                      borderColor: '#1b9fff #0a4a99 #0a4a99 #1b9fff',
                      textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
                      minWidth: '100px',
                      textAlign: 'center',
                      outline: 'none',
                      WebkitAppearance: 'none',
                      boxShadow: 'none'
                    }}
                  >
                    Restore
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      playClickSound()
                      setImageToDeletePermanently(selectedTrashImage.id)
                    }}
                    style={{
                      padding: '6px 14px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      color: '#ffff00',
                      backgroundColor: '#c00000',
                      border: '2px solid',
                      borderColor: '#ff4444 #800000 #800000 #ff4444',
                      textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
                      minWidth: '100px',
                      textAlign: 'center',
                      outline: 'none',
                      WebkitAppearance: 'none',
                      boxShadow: 'none'
                    }}
                  >
                    Delete Forever
                  </button>
                </div>
              </div>

              {/* File info panel */}
              <div style={{
                width: '180px',
                borderLeft: '1px solid #dfdfdf',
                backgroundColor: '#c0c0c0',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                fontSize: '11px',
                fontFamily: 'MS Sans Serif, Arial, sans-serif',
                overflow: 'auto'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#000080' }}>File Properties</div>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Name:</strong>
                  <div style={{ wordBreak: 'break-word', color: '#333' }}>{selectedTrashImage.name || `vijay_${selectedTrashImage.id}`}</div>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Date:</strong>
                  <div style={{ color: '#333' }}>
                    {selectedTrashImage.timestamp 
                      ? new Date(selectedTrashImage.timestamp).toLocaleDateString('en-AU', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })
                      : 'Unknown'}
                  </div>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Type:</strong>
                  <div style={{ color: '#333' }}>PNG Image</div>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Size:</strong>
                  <div style={{ color: '#333' }}>
                    {(() => {
                      const sizeBytes = selectedTrashImage.dataUrl.length
                      const sizeKB = (sizeBytes / 1024).toFixed(1)
                      return `${sizeKB} KB`
                    })()}
                  </div>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <strong>Index:</strong>
                  <div style={{ color: '#333' }}>
                    {trashedImages.findIndex(img => img.id === selectedTrashImage.id) + 1} / {trashedImages.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Window */}
      {showVideo && (
        <div style={{
          position: 'fixed',
          top: `${videoPos.y}px`,
          left: `${videoPos.x}px`,
          backgroundColor: '#c0c0c0',
          border: '2px solid',
          borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
          boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040, inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
          width: '315px',
          height: '560px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000
        }}>
          {/* Title bar */}
          <div 
            style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: '#ffff00',
              padding: '2px 2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none',
              cursor: dragState?.window === 'video' ? 'grabbing' : 'grab',
              borderBottom: dragState?.window === 'video' ? '2px solid #ffffff' : 'none'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'video', videoPos)}
          >
            <h1 style={{ margin: '2px 4px', fontSize: '14px', fontWeight: 'bold' }}>Video ⋆｡°✩</h1>
            <button 
              onClick={handleCloseVideo}
              style={{
                marginLeft: 'auto',
                padding: '2px 6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                outline: 'none',
                backgroundColor: '#d85c5c'
              }}
            >
              ✕
            </button>
          </div>

          {/* Video player */}
          <div style={{
            flex: 1,
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000',
            overflow: 'hidden'
          }}>
            <video
              width="100%"
              height="100%"
              autoPlay
              controls
              loop
              style={{
                objectFit: 'contain',
                display: 'block'
              }}
            >
              <source src={videoFile} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Status bar */}
          <div style={{
            display: 'flex',
            height: '20px',
            borderTop: '1px solid #dfdfdf',
            backgroundColor: '#c0c0c0',
            fontSize: '10px',
            alignItems: 'center',
            paddingLeft: '2px'
          }}>
            <span>Friends ᥫ᭡.</span>
          </div>
        </div>
      )}

      {/* Gallery Window */}
      {showGallery && (
        <div style={{
          position: 'fixed',
          top: `${galleryPos.y}px`,
          left: `${galleryPos.x}px`,
          backgroundColor: '#c0c0c0',
          border: '2px solid',
          borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
          boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040, inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
          width: '300px',
          height: '375px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          transform: 'scale(0.9)',
          transformOrigin: 'top left'
        }}>
          {/* Title bar */}
          <div 
            style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: '#ffff00',
              padding: '2px 2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none',
              cursor: dragState?.window === 'gallery' ? 'grabbing' : 'grab',
              borderBottom: dragState?.window === 'gallery' ? '2px solid #ffffff' : 'none'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'gallery', galleryPos)}
          >
            <h1 style={{ margin: '2px 4px', fontSize: '14px', fontWeight: 'bold' }}>Gallery ⋆｡°✩</h1>
            <button 
              onClick={() => setShowGallery(false)}
              style={{
                marginLeft: 'auto',
                padding: '2px 6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                outline: 'none',
                backgroundColor: '#d85c5c'
              }}
            >
              ✕
            </button>
          </div>

          {/* Photo Display */}
          <div style={{
            flex: 1,
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000',
            overflow: 'hidden',
            flexDirection: 'column'
          }}>
            {!galleryImagesLoaded ? (
              <div style={{
                color: '#ffff00',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: 'Arial, sans-serif'
              }}>
                <div>images loading...</div>
                <div style={{ marginTop: '8px', fontSize: '16px' }}>⋆｡°✩</div>
                <div style={{ marginTop: '8px', fontSize: '12px' }}>pls wait</div>
              </div>
            ) : (
              <img 
                src={GALLERY_PHOTOS[currentPhotoIndex]}
                alt={`Photo ${currentPhotoIndex + 1}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            )}
          </div>

          {/* Status bar */}
          <div style={{
            display: 'flex',
            height: '20px',
            borderTop: '1px solid #dfdfdf',
            backgroundColor: '#c0c0c0',
            fontSize: '10px',
            alignItems: 'center',
            paddingLeft: '2px',
            justifyContent: 'space-between',
            paddingRight: '4px'
          }}>
            <span>Photo {currentPhotoIndex + 1} of {GALLERY_PHOTOS.length}</span>
          </div>
        </div>
      )}

      {/* Save Options Modal */}
      {showSaveOptions && selectedImage && (
        <div
          onClick={() => setShowSaveOptions(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#c0c0c0',
              border: '2px solid',
              borderColor: '#ffffff #808080 #808080 #ffffff',
              boxShadow: '1px 1px 0px #dfdfdf, 2px 2px 0px #808080',
              width: '350px',
              fontFamily: 'MS Sans Serif, Arial, sans-serif',
              fontSize: '11px'
            }}
          >
            {/* Title Bar */}
            <div
              style={{
                background: 'linear-gradient(to right, #000080, #1084d7)',
                color: '#ffffff',
                padding: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                userSelect: 'none'
              }}
            >
              <span style={{ fontWeight: 'bold', fontSize: '11px' }}>Save As</span>
              <button
                onClick={() => {
                  playClickSound()
                  setShowSaveOptions(false)
                }}
                style={{
                  backgroundColor: '#d85c5c',
                  border: 'none',
                  width: '16px',
                  height: '16px',
                  padding: '0',
                  cursor: 'pointer',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  outline: 'none',
                  color: '#ffffff'
                }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '20px' }}>
              <p style={{ margin: '0 0 20px 0', fontSize: '11px' }}>
                How would you like to save "{selectedImage.name || `vijay_${selectedImage.id}`}.png"?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Save Just Image */}
                <button
                  onClick={() => {
                    playClickSound()
                    setShowSaveOptions(false)
                    // Download original image
                    fetch(selectedImage.dataUrl)
                      .then(res => res.blob())
                      .then(blob => {
                        const url = URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = `${selectedImage.name || `vijay_${selectedImage.id}`}.png`
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                        URL.revokeObjectURL(url)
                      })
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#c0c0c0',
                    border: '2px solid',
                    borderColor: '#ffffff #808080 #808080 #ffffff',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    textAlign: 'left',
                    outline: 'none',
                    color: '#000080'
                  }}
                >
                  Save Just Image ⋆｡°✩
                </button>

                {/* Save with File Properties */}
                <button
                  onClick={async () => {
                    playClickSound()
                    setShowSaveOptions(false)
                    // Capture the image modal as screenshot
                    if (imageModalRef.current) {
                      const imageIndex = capturedImages.findIndex(img => img.id === selectedImage.id) + 1
                      const canvas = await html2canvas(imageModalRef.current, {
                        backgroundColor: null,
                        scale: 2,
                        useCORS: true,
                        allowTaint: true
                      })
                      canvas.toBlob(blob => {
                        const url = URL.createObjectURL(blob)
                        const link = document.createElement('a')
                        link.href = url
                        link.download = `hiba_cam_${imageIndex}_window.png`
                        document.body.appendChild(link)
                        link.click()
                        document.body.removeChild(link)
                        URL.revokeObjectURL(url)
                      })
                    }
                  }}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#c0c0c0',
                    border: '2px solid',
                    borderColor: '#ffffff #808080 #808080 #ffffff',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    textAlign: 'left',
                    outline: 'none',
                    color: '#000080'
                  }}
                >
                  Save Image with Microsoft window ⋆｡°✩
                </button>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    playClickSound()
                    setShowSaveOptions(false)
                  }}
                  style={{
                    padding: '4px 16px',
                    backgroundColor: '#c0c0c0',
                    border: '2px solid',
                    borderColor: '#ffffff #808080 #808080 #ffffff',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '11px',
                    outline: 'none',
                    minWidth: '75px'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dragging image overlay */}
      {draggedImageId && dragImageSource && (
        <div
          style={{
            position: 'fixed',
            top: `${dragImagePos.y}px`,
            left: `${dragImagePos.x}px`,
            pointerEvents: 'none',
            zIndex: 9999
          }}
        >
          <img
            src={
              dragImageSource === 'downloads'
                ? capturedImages.find((img) => img.id === draggedImageId)?.dataUrl
                : trashedImages.find((img) => img.id === draggedImageId)?.dataUrl
            }
            alt="dragging"
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'cover',
              border: '2px solid #000080',
              boxShadow: '0 0 10px rgba(0,0,0,0.5)',
              borderRadius: '2px',
              opacity: 0.9
            }}
          />
        </div>
      )}

      {/* Bottom Left Profile Picture */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 100
        }}
      >
        <button
          onClick={() => {
            if (clickAudioRef.current) {
              clickAudioRef.current.currentTime = 0
              clickAudioRef.current.play().catch(err => console.log('Could not play click sound:', err))
            }
            setShowProfileMenu(!showProfileMenu)
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
            borderRadius: '50%',
            overflow: 'hidden',
            width: '56px',
            height: '56px',
            outline: 'none'
          }}
        >
          <img
            src={profilePicture}
            alt="Profile"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #808080'
            }}
          />
        </button>

        {/* Profile Dropdown Menu */}
        {showProfileMenu && (
          <div
            style={{
              position: 'absolute',
              bottom: '64px',
              left: '0',
              backgroundColor: 'rgba(32, 32, 32, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              minWidth: '160px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
              zIndex: 10000,
              backdropFilter: 'blur(10px)'
            }}
          >
            <button
              onClick={() => {
                if (clickAudioRef.current) {
                  clickAudioRef.current.currentTime = 0
                  clickAudioRef.current.play().catch(err => console.log('Could not play click sound:', err))
                }
                setShowProfileMenu(false)
                setIsLoggedIn(false)
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                cursor: 'pointer',
                textAlign: 'left',
                outline: 'none'
              }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>

      {/* Storage Limit Modal */}
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

      {/* Save All Modal */}
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
          zIndex: 2000
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
              <div style={{ fontWeight: 'bold' }}>💾 Save All Images</div>
              <button
                onClick={() => setShowSaveAllModal(false)}
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
              <p>Save all images into a folder</p>
              <p style={{ fontSize: '10px', color: '#333' }}>Your images will be downloaded as a ZIP file containing all {capturedImages.length} image(s).</p>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '5px' }}>
              <button
                onClick={() => {
                  playClickSound()
                  setShowSaveAllModal(false)
                }}
                style={{
                  flex: 1,
                  padding: '6px 10px',
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
                onClick={handleSaveAllAsZip}
                disabled={isSavingZip || capturedImages.length === 0}
                style={{
                  flex: 1,
                  padding: '6px 10px',
                  cursor: isSavingZip || capturedImages.length === 0 ? 'not-allowed' : 'pointer',
                  backgroundColor: '#c0c0c0',
                  border: '2px solid',
                  borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  color: '#000080',
                  opacity: isSavingZip || capturedImages.length === 0 ? 0.6 : 1
                }}
              >
                {isSavingZip ? '⏳ Creating ZIP...' : '💾 Download ZIP'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio elements */}
      <audio ref={clickAudioRef} src={clickSound} />
      <audio ref={windowsOpeningAudioRef} src={windowsOpeningSound} />
    </div>
  )
}

export default App
