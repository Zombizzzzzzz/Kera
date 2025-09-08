"use client"

import { useEffect, useRef } from "react"
import { PostCard } from "@/components/post-card"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface AnimatedFeedProps {
  posts: any[]
  userId: string
}

export function AnimatedFeed({ posts, userId }: AnimatedFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".post-card")

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: card,
              start: "top 85%", // pop when card enters 85% of viewport
              toggleActions: "play none none reverse", // replay when scrolling back
            },
          }
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <PostCard post={post} currentUserId={userId} />
        </div>
      ))}
    </div>
  )
}
