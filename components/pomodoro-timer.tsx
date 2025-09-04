"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Play, Pause, Square, Settings, Lock, Volume2, VolumeX } from "lucide-react"

interface PomodoroTimerProps {
  onBack: () => void
}

type TimerState = "idle" | "focus" | "break" | "paused"

export function PomodoroTimer({ onBack }: PomodoroTimerProps) {
  const [focusMinutes, setFocusMinutes] = useState(25)
  const [breakMinutes, setBreakMinutes] = useState(5)
  const [currentMinutes, setCurrentMinutes] = useState(25)
  const [currentSeconds, setCurrentSeconds] = useState(0)
  const [timerState, setTimerState] = useState<TimerState>("idle")
  const [isLocked, setIsLocked] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (timerState === "focus" || timerState === "break") {
      intervalRef.current = setInterval(() => {
        setCurrentSeconds((prev) => {
          if (prev === 0) {
            setCurrentMinutes((prevMin) => {
              if (prevMin === 0) {
                if (soundEnabled && audioRef.current) {
                  audioRef.current.src = "/sounds/notification.mp3"
                  audioRef.current.play().catch(console.error)
                }

                // Timer finished
                if (timerState === "focus") {
                  setCompletedSessions((prev) => prev + 1)
                  setTimerState("break")
                  setCurrentMinutes(breakMinutes)
                  setCurrentSeconds(0)
                  setIsLocked(false)
                } else {
                  setTimerState("idle")
                  setCurrentMinutes(focusMinutes)
                  setCurrentSeconds(0)
                }
                return prevMin
              }
              return prevMin - 1
            })
            return 59
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timerState, focusMinutes, breakMinutes, soundEnabled])

  const startFocusSession = () => {
    setCurrentMinutes(focusMinutes)
    setCurrentSeconds(0)
    setTimerState("focus")
    setIsLocked(true)
  }

  const pauseTimer = () => {
    setTimerState("paused")
  }

  const resumeTimer = () => {
    if (currentMinutes > 0 || currentSeconds > 0) {
      setTimerState(timerState === "paused" ? "focus" : timerState)
    }
  }

  const stopTimer = () => {
    setTimerState("idle")
    setCurrentMinutes(focusMinutes)
    setCurrentSeconds(0)
    setIsLocked(false)
  }

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const getProgressPercentage = () => {
    const totalSeconds = timerState === "focus" ? focusMinutes * 60 : breakMinutes * 60
    const remainingSeconds = currentMinutes * 60 + currentSeconds
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100
  }

  if (isLocked && timerState === "focus") {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4 text-center">
          <CardHeader>
            <Lock className="h-16 w-16 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl">Focus Mode</CardTitle>
            <p className="text-muted-foreground">Stay focused! Screen is locked during your session.</p>
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-mono font-bold text-primary mb-6">
              {formatTime(currentMinutes, currentSeconds)}
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-6">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-1000"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mb-4">Session {completedSessions + 1} • Focus Time</p>
            <Button onClick={() => setIsLocked(false)} variant="secondary" size="sm">
              Unlock (Not Recommended)
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Pomodoro Timer</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Timer Display */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {timerState === "focus" ? "Focus Session" : timerState === "break" ? "Break Time" : "Ready to Start"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-8xl font-mono font-bold text-primary mb-8">
                {formatTime(currentMinutes, currentSeconds)}
              </div>

              {(timerState === "focus" || timerState === "break") && (
                <div className="w-full bg-muted rounded-full h-4 mb-8">
                  <div
                    className="bg-primary h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
              )}

              <div className="flex gap-4 justify-center mb-6">
                {timerState === "idle" && (
                  <Button onClick={startFocusSession} size="lg" className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Start Focus Session
                  </Button>
                )}

                {(timerState === "focus" || timerState === "break") && (
                  <Button onClick={pauseTimer} size="lg" variant="secondary" className="flex items-center gap-2">
                    <Pause className="h-5 w-5" />
                    Pause
                  </Button>
                )}

                {timerState === "paused" && (
                  <Button onClick={resumeTimer} size="lg" className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Resume
                  </Button>
                )}

                {timerState !== "idle" && (
                  <Button onClick={stopTimer} size="lg" variant="destructive" className="flex items-center gap-2">
                    <Square className="h-5 w-5" />
                    Stop
                  </Button>
                )}
              </div>

              <div className="text-sm text-muted-foreground">Completed Sessions: {completedSessions}</div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Timer Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="focus-time">Focus Duration (minutes)</Label>
                <Input
                  id="focus-time"
                  type="number"
                  min="1"
                  max="60"
                  value={focusMinutes}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value)
                    setFocusMinutes(value)
                    if (timerState === "idle") {
                      setCurrentMinutes(value)
                    }
                  }}
                  disabled={timerState !== "idle"}
                />
              </div>

              <div>
                <Label htmlFor="break-time">Break Duration (minutes)</Label>
                <Input
                  id="break-time"
                  type="number"
                  min="1"
                  max="30"
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(Number.parseInt(e.target.value))}
                  disabled={timerState !== "idle"}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="sound-toggle">Notification Sounds</Label>
                <Button id="sound-toggle" variant="ghost" size="icon" onClick={() => setSoundEnabled(!soundEnabled)}>
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">How it works:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Focus for {focusMinutes} minutes</li>
                  <li>• Take a {breakMinutes} minute break</li>
                  <li>• Screen locks during focus time</li>
                  <li>• Audio notifications when sessions end</li>
                  <li>• Repeat to build productivity habits</li>
                </ul>
              </div>

              <div className="p-4 bg-card border rounded-lg">
                <h3 className="font-semibold mb-2">Session Stats:</h3>
                <div className="text-sm space-y-1">
                  <div>Total Sessions: {completedSessions}</div>
                  <div>Focus Time: {completedSessions * focusMinutes} minutes</div>
                  <div>
                    Current State:{" "}
                    {timerState === "idle"
                      ? "Ready"
                      : timerState === "focus"
                        ? "Focusing"
                        : timerState === "break"
                          ? "On Break"
                          : "Paused"}
                  </div>
                  <div>Sounds: {soundEnabled ? "Enabled" : "Disabled"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <audio ref={audioRef} />
      </div>
    </div>
  )
}
