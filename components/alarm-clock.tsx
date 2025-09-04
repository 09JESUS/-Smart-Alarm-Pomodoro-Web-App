"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash2, Play, Square, Volume2 } from "lucide-react"

interface Alarm {
  id: string
  time: string
  label: string
  isActive: boolean
  sound: string
}

interface AlarmClockProps {
  onBack: () => void
}

const ALARM_SOUNDS = [
  { value: "classic-alarm", label: "Classic Alarm", file: "/sounds/classic-alarm.mp3" },
  { value: "gentle-chime", label: "Gentle Chime", file: "/sounds/gentle-chime.mp3" },
  { value: "digital-beep", label: "Digital Beep", file: "/sounds/digital-beep.mp3" },
]

export function AlarmClock({ onBack }: AlarmClockProps) {
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [newAlarmTime, setNewAlarmTime] = useState("")
  const [newAlarmLabel, setNewAlarmLabel] = useState("")
  const [newAlarmSound, setNewAlarmSound] = useState("classic-alarm")
  const [activeAlarm, setActiveAlarm] = useState<string | null>(null)
  const [showSnoozeDialog, setShowSnoozeDialog] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const previewAudioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const currentTime = now.toTimeString().slice(0, 5)

      alarms.forEach((alarm) => {
        if (alarm.isActive && alarm.time === currentTime && !activeAlarm) {
          setActiveAlarm(alarm.id)
          setShowSnoozeDialog(true)
          if (audioRef.current) {
            const soundFile = ALARM_SOUNDS.find((s) => s.value === alarm.sound)?.file || ALARM_SOUNDS[0].file
            audioRef.current.src = soundFile
            audioRef.current.play().catch(console.error)
          }
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [alarms, activeAlarm])

  const addAlarm = () => {
    if (newAlarmTime && newAlarmLabel) {
      const newAlarm: Alarm = {
        id: Date.now().toString(),
        time: newAlarmTime,
        label: newAlarmLabel,
        isActive: true,
        sound: newAlarmSound,
      }
      setAlarms([...alarms, newAlarm])
      setNewAlarmTime("")
      setNewAlarmLabel("")
    }
  }

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter((alarm) => alarm.id !== id))
  }

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map((alarm) => (alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm)))
  }

  const previewSound = (soundValue: string) => {
    if (previewAudioRef.current) {
      const soundFile = ALARM_SOUNDS.find((s) => s.value === soundValue)?.file
      if (soundFile) {
        previewAudioRef.current.src = soundFile
        previewAudioRef.current.play().catch(console.error)
        // Stop preview after 2 seconds
        setTimeout(() => {
          if (previewAudioRef.current) {
            previewAudioRef.current.pause()
            previewAudioRef.current.currentTime = 0
          }
        }, 2000)
      }
    }
  }

  const snoozeAlarm = () => {
    setShowSnoozeDialog(false)
    setActiveAlarm(null)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    // Add 5 minutes to current time for snooze
    const now = new Date()
    now.setMinutes(now.getMinutes() + 5)
    const snoozeTime = now.toTimeString().slice(0, 5)

    if (activeAlarm) {
      const alarm = alarms.find((a) => a.id === activeAlarm)
      if (alarm) {
        const snoozeAlarm: Alarm = {
          ...alarm,
          id: Date.now().toString(),
          time: snoozeTime,
          label: `${alarm.label} (Snoozed)`,
        }
        setAlarms([...alarms, snoozeAlarm])
      }
    }
  }

  const stopAlarm = () => {
    setShowSnoozeDialog(false)
    setActiveAlarm(null)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Alarm Clock</h1>
        </div>

        {/* Add New Alarm */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Alarm
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" value={newAlarmTime} onChange={(e) => setNewAlarmTime(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  placeholder="Wake up, Meeting, etc."
                  value={newAlarmLabel}
                  onChange={(e) => setNewAlarmLabel(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="sound">Alarm Sound</Label>
                <div className="flex gap-2">
                  <Select value={newAlarmSound} onValueChange={setNewAlarmSound}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ALARM_SOUNDS.map((sound) => (
                        <SelectItem key={sound.value} value={sound.value}>
                          {sound.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" variant="outline" size="icon" onClick={() => previewSound(newAlarmSound)}>
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <Button onClick={addAlarm} className="w-full">
              Add Alarm
            </Button>
          </CardContent>
        </Card>

        {/* Alarms List */}
        <div className="space-y-4">
          {alarms.map((alarm) => (
            <Card key={alarm.id} className={`${alarm.isActive ? "border-primary" : "border-muted"}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-mono font-bold text-primary">{alarm.time}</div>
                    <div>
                      <div className="font-semibold">{alarm.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {alarm.isActive ? "Active" : "Inactive"} •{" "}
                        {ALARM_SOUNDS.find((s) => s.value === alarm.sound)?.label}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => previewSound(alarm.sound)}>
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => toggleAlarm(alarm.id)}>
                      {alarm.isActive ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteAlarm(alarm.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {alarms.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Volume2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No alarms set. Add your first alarm above.</p>
            </CardContent>
          </Card>
        )}

        {/* Snooze Dialog */}
        {showSnoozeDialog && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Alarm Ringing!</CardTitle>
                <p className="text-muted-foreground">{alarms.find((a) => a.id === activeAlarm)?.label}</p>
              </CardHeader>
              <CardContent className="flex gap-4">
                <Button onClick={snoozeAlarm} className="flex-1" variant="secondary">
                  Snooze (5 min)
                </Button>
                <Button onClick={stopAlarm} className="flex-1">
                  Stop
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <audio ref={audioRef} loop />
        <audio ref={previewAudioRef} />
      </div>
    </div>
  )
}
