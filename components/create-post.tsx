'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { ImageIcon, Send } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

export function CreatePost() {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      let imageUrl = null
      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop()
        const fileName = `${user.id}-${Date.now()}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, selectedImage)

        if (uploadError) {
          console.error('Upload error:', uploadError)
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('post-images')
            .getPublicUrl(fileName)
          imageUrl = publicUrl
        }
      }

      const { error } = await supabase
        .from('posts')
        .insert({
          content: content.trim(),
          user_id: user.id, // <CHANGE> Fixed column name from author_id to user_id
          image_url: imageUrl
        })

      if (error) throw error

      setContent('')
      setSelectedImage(null)
      setImagePreview(null)
      window.location.reload() // Refresh to show new post
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-banana-200 bg-cream-50">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="What's happening in the banana world? 🍌"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] border-banana-200 focus:border-banana-400 bg-white"
            maxLength={280}
          />
          
          {imagePreview && (
            <div className="relative">
              <img 
                src={imagePreview || "/placeholder.svg"} 
                alt="Preview" 
                className="max-h-48 rounded-lg object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => {
                  setSelectedImage(null)
                  setImagePreview(null)
                }}
              >
                Remove
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-banana-200 hover:bg-banana-50"
                  asChild
                >
                  <span className="cursor-pointer">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Photo
                  </span>
                </Button>
              </label>
              <span className="text-sm text-gray-500">
                {content.length}/280
              </span>
            </div>
            
            <Button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="bg-banana-400 hover:bg-banana-500 text-banana-900"
            >
              {isSubmitting ? (
                'Posting...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}