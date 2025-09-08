"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, Send } from "lucide-react"

interface ChatInterfaceProps {
  currentUserId: string
  otherUserId: string
  otherProfile: any
}

export function ChatInterface({ currentUserId, otherUserId, otherProfile }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    loadMessages()
    markMessagesAsRead()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadMessages = async () => {
    setIsLoading(true)

    try {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${currentUserId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${currentUserId})`,
        )
        .order("created_at", { ascending: true })

      setMessages(data || [])
    } catch (error) {
      console.error("Error loading messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const markMessagesAsRead = async () => {
    try {
      await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("sender_id", otherUserId)
        .eq("receiver_id", currentUserId)
        .is("read_at", null)
    } catch (error) {
      console.error("Error marking messages as read:", error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    setIsSending(true)

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: currentUserId,
          receiver_id: otherUserId,
          content: newMessage.trim(),
        })
        .select()
        .single()

      if (error) throw error

      setMessages((prev) => [...prev, data])
      setNewMessage("")

      // Create notification for the receiver
      await supabase.from("notifications").insert({
        user_id: otherUserId,
        type: "message",
        title: "New Message",
        message: `You have a new message!`,
        related_user_id: currentUserId,
      })
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-banana/20 shadow-sm h-[600px] flex flex-col">
        {/* Chat Header */}
        <CardHeader className="border-b border-banana/20 p-4">
          <div className="flex items-center space-x-3">
            <Link href="/messages">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>

            <div className="w-10 h-10 bg-banana-gradient rounded-full flex items-center justify-center text-white font-semibold">
              {otherProfile.display_name?.charAt(0) || "U"}
            </div>

            <div>
              <h3 className="font-semibold text-cream-dark">{otherProfile.display_name}</h3>
              <p className="text-sm text-banana">@{otherProfile.username}</p>
            </div>
          </div>
        </CardHeader>

        {/* Messages Area */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-cream-dark">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-cream-dark">Start your conversation with {otherProfile.display_name}!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === currentUserId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender_id === currentUserId
                      ? "bg-banana-gradient text-white"
                      : "bg-white border border-banana/20 text-cream-dark"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender_id === currentUserId ? "text-white/70" : "text-cream-dark/70"
                    }`}
                  >
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Message Input */}
        <div className="border-t border-banana/20 p-4">
          <form onSubmit={sendMessage} className="flex space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 border-banana/30 focus:border-banana"
              disabled={isSending}
            />
            <Button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="bg-banana-gradient hover:bg-banana-600 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
