"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Timer, Settings, Info } from "lucide-react"
import { AlarmClock } from "@/components/alarm-clock"
import { PomodoroTimer } from "@/components/pomodoro-timer"

type AppMode = "menu" | "alarm" | "pomodoro"

export default function SmartAlarmApp() {
  const [currentMode, setCurrentMode] = useState<AppMode>("menu")

  const renderContent = () => {
    switch (currentMode) {
      case "alarm":
        return <AlarmClock onBack={() => setCurrentMode("menu")} />
      case "pomodoro":
        return <PomodoroTimer onBack={() => setCurrentMode("menu")} />
      default:
        return (
          <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 py-8">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">Smart Alarm & Pomodoro</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                  A sleek productivity tool combining alarm functionality with the Pomodoro technique to help you manage
                  time effectively and stay focused.
                </p>
              </div>

              {/* Main Menu Cards */}
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
                <Card
                  className="group hover:scale-105 transition-transform duration-200 cursor-pointer border-2 hover:border-primary"
                  onClick={() => setCurrentMode("alarm")}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                      <Clock className="h-12 w-12 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">Alarm Clock</CardTitle>
                    <CardDescription className="text-base">
                      Schedule alarms with customizable labels and sounds
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                      <li>• Multiple alarm support</li>
                      <li>• Custom labels and sounds</li>
                      <li>• Snooze and stop controls</li>
                      <li>• Alarm preview functionality</li>
                    </ul>
                    <Button className="w-full" size="lg">
                      Open Alarm Clock
                    </Button>
                  </CardContent>
                </Card>

                <Card
                  className="group hover:scale-105 transition-transform duration-200 cursor-pointer border-2 hover:border-primary"
                  onClick={() => setCurrentMode("pomodoro")}
                >
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 p-4 bg-accent/10 rounded-full w-fit">
                      <Timer className="h-12 w-12 text-accent" />
                    </div>
                    <CardTitle className="text-2xl">Pomodoro Timer</CardTitle>
                    <CardDescription className="text-base">
                      Stay focused using the proven Pomodoro technique
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <ul className="text-sm text-muted-foreground space-y-2 mb-6">
                      <li>• Custom focus/break intervals</li>
                      <li>• Lock screen during focus</li>
                      <li>• Progress tracking</li>
                      <li>• Distraction-free sessions</li>
                    </ul>
                    <Button className="w-full" size="lg" variant="secondary">
                      Start Pomodoro
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Features Section */}
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-8">Key Features</h2>
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="p-6 rounded-lg bg-card border">
                    <Settings className="h-8 w-8 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Customizable</h3>
                    <p className="text-sm text-muted-foreground">
                      Personalize your alarms and timer settings to match your workflow
                    </p>
                  </div>
                  <div className="p-6 rounded-lg bg-card border">
                    <Clock className="h-8 w-8 text-accent mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Responsive Design</h3>
                    <p className="text-sm text-muted-foreground">Works seamlessly on desktop and mobile browsers</p>
                  </div>
                  <div className="p-6 rounded-lg bg-card border">
                    <Info className="h-8 w-8 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Framework</h3>
                    <p className="text-sm text-muted-foreground">
                      Built with modern web technologies for optimal performance
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="bg-card border-t mt-auto">
              <div className="container mx-auto px-4 py-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Smart Alarm & Pomodoro</h3>
                    <p className="text-sm text-muted-foreground">
                      Boost your productivity with our comprehensive time management solution.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Features</h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>Alarm Clock</li>
                      <li>Pomodoro Timer</li>
                      <li>Lock Screen</li>
                      <li>Custom Sounds</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">About</h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>Responsive Design</li>
                      <li>Dark Mode</li>
                      <li>No Installation Required</li>
                      <li>Cross-Platform</li>
                    </ul>
                  </div>
                </div>
                <div className="border-t mt-8 pt-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    © 2024 Smart Alarm & Pomodoro. Designed and built with security in mind by Forget.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        )
    }
  }

  return <div className="dark">{renderContent()}</div>
}
