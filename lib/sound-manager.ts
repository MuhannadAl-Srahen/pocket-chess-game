export class SoundManager {
  private audioContext: AudioContext | null = null
  private sounds: { [key: string]: AudioBuffer } = {}
  private masterVolume = 0.3

  constructor() {
    if (typeof window !== "undefined") {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.initializeSounds()
    }
  }

  private async initializeSounds() {
    if (!this.audioContext) return

    // Create beautiful musical sound effects
    this.sounds.move = await this.createChord([440, 554.37, 659.25], 0.15, "sine") // A major chord
    this.sounds.capture = await this.createChord([523.25, 659.25, 783.99], 0.25, "sine") // C major chord
    this.sounds.check = await this.createMelody([880, 1108.73, 1318.51], [0.1, 0.1, 0.2], "sine") // Warning melody
    this.sounds.checkmate = await this.createVictoryFanfare()
    this.sounds.select = await this.createBell(1760, 0.08) // High bell tone
    this.sounds.error = await this.createErrorTone()
    this.sounds.hint = await this.createMagicalChime()
    this.sounds.success = await this.createSuccessArpeggio()
  }

  private async createChord(frequencies: number[], duration: number, type: OscillatorType): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error("AudioContext not available")

    const sampleRate = this.audioContext.sampleRate
    const buffer = this.audioContext.createBuffer(2, duration * sampleRate, sampleRate)
    const leftChannel = buffer.getChannelData(0)
    const rightChannel = buffer.getChannelData(1)

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate
      let leftValue = 0
      let rightValue = 0

      // Create chord by combining frequencies
      frequencies.forEach((freq, index) => {
        const oscillatorValue = Math.sin(2 * Math.PI * freq * t)
        const envelope = Math.exp(-t * 4) * Math.cos(t * 0.5) // Musical envelope with vibrato
        const panLeft = Math.cos((index / frequencies.length) * Math.PI * 0.5)
        const panRight = Math.sin((index / frequencies.length) * Math.PI * 0.5)

        leftValue += oscillatorValue * envelope * panLeft
        rightValue += oscillatorValue * envelope * panRight
      })

      leftChannel[i] = (leftValue * this.masterVolume) / frequencies.length
      rightChannel[i] = (rightValue * this.masterVolume) / frequencies.length
    }

    return buffer
  }

  private async createMelody(frequencies: number[], durations: number[], type: OscillatorType): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error("AudioContext not available")

    const sampleRate = this.audioContext.sampleRate
    const totalDuration = durations.reduce((sum, dur) => sum + dur, 0)
    const buffer = this.audioContext.createBuffer(2, totalDuration * sampleRate, sampleRate)
    const leftChannel = buffer.getChannelData(0)
    const rightChannel = buffer.getChannelData(1)

    let currentTime = 0
    frequencies.forEach((freq, noteIndex) => {
      const noteDuration = durations[noteIndex]
      const startSample = Math.floor(currentTime * sampleRate)
      const endSample = Math.floor((currentTime + noteDuration) * sampleRate)

      for (let i = startSample; i < endSample && i < buffer.length; i++) {
        const t = (i - startSample) / sampleRate
        const noteProgress = t / noteDuration

        // Beautiful envelope with attack, sustain, and release
        let envelope = 1
        if (noteProgress < 0.1) {
          envelope = noteProgress / 0.1 // Attack
        } else if (noteProgress > 0.7) {
          envelope = (1 - noteProgress) / 0.3 // Release
        }

        const oscillatorValue = Math.sin(2 * Math.PI * freq * t)
        const harmonics = 0.3 * Math.sin(2 * Math.PI * freq * 2 * t) + 0.1 * Math.sin(2 * Math.PI * freq * 3 * t)
        const finalValue = (oscillatorValue + harmonics) * envelope * this.masterVolume

        leftChannel[i] = finalValue
        rightChannel[i] = finalValue
      }

      currentTime += noteDuration
    })

    return buffer
  }

  private async createBell(frequency: number, duration: number): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error("AudioContext not available")

    const sampleRate = this.audioContext.sampleRate
    const buffer = this.audioContext.createBuffer(2, duration * sampleRate, sampleRate)
    const leftChannel = buffer.getChannelData(0)
    const rightChannel = buffer.getChannelData(1)

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate

      // Bell-like sound with multiple harmonics
      const fundamental = Math.sin(2 * Math.PI * frequency * t)
      const harmonic2 = 0.5 * Math.sin(2 * Math.PI * frequency * 2.76 * t)
      const harmonic3 = 0.25 * Math.sin(2 * Math.PI * frequency * 5.4 * t)
      const harmonic4 = 0.125 * Math.sin(2 * Math.PI * frequency * 8.93 * t)

      const envelope = Math.exp(-t * 8) // Quick decay like a bell
      const bellSound = (fundamental + harmonic2 + harmonic3 + harmonic4) * envelope * this.masterVolume

      leftChannel[i] = bellSound
      rightChannel[i] = bellSound
    }

    return buffer
  }

  private async createVictoryFanfare(): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error("AudioContext not available")

    // Victory fanfare: C - E - G - C (higher octave)
    const notes = [523.25, 659.25, 783.99, 1046.5]
    const durations = [0.2, 0.2, 0.2, 0.4]

    return this.createMelody(notes, durations, "sine")
  }

  private async createErrorTone(): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error("AudioContext not available")

    const sampleRate = this.audioContext.sampleRate
    const duration = 0.3
    const buffer = this.audioContext.createBuffer(2, duration * sampleRate, sampleRate)
    const leftChannel = buffer.getChannelData(0)
    const rightChannel = buffer.getChannelData(1)

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate

      // Descending minor chord for error
      const freq1 = 220 * (1 - t * 0.3) // Descending tone
      const freq2 = 261.63 * (1 - t * 0.3)

      const osc1 = Math.sin(2 * Math.PI * freq1 * t)
      const osc2 = Math.sin(2 * Math.PI * freq2 * t)

      const envelope = Math.exp(-t * 3)
      const errorSound = (osc1 + osc2) * envelope * this.masterVolume * 0.5

      leftChannel[i] = errorSound
      rightChannel[i] = errorSound
    }

    return buffer
  }

  private async createMagicalChime(): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error("AudioContext not available")

    // Magical ascending arpeggio for hints
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51] // C major pentatonic
    const durations = [0.1, 0.1, 0.1, 0.1, 0.2]

    return this.createMelody(notes, durations, "sine")
  }

  private async createSuccessArpeggio(): Promise<AudioBuffer> {
    if (!this.audioContext) throw new Error("AudioContext not available")

    // Success arpeggio: C - E - G - C - E - G - C
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093]
    const durations = [0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.15]

    return this.createMelody(notes, durations, "sine")
  }

  private playSound(soundName: string, volume = 1) {
    if (!this.audioContext || !this.sounds[soundName]) return

    const source = this.audioContext.createBufferSource()
    const gainNode = this.audioContext.createGain()

    source.buffer = this.sounds[soundName]
    gainNode.gain.value = volume

    source.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    source.start()
  }

  playMove() {
    this.playSound("move", 0.8)
  }

  playCapture() {
    this.playSound("capture", 0.9)
  }

  playCheck() {
    this.playSound("check", 1.0)
  }

  playCheckmate() {
    this.playSound("checkmate", 1.0)
  }

  playSelect() {
    this.playSound("select", 0.6)
  }

  playError() {
    this.playSound("error", 0.7)
  }

  playHint() {
    this.playSound("hint", 0.8)
  }

  playSuccess() {
    this.playSound("success", 0.9)
  }

  setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume))
  }
}
