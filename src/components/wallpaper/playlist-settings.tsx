import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useWallpaperManager } from '@/providers/wallpaper-manager'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '../ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const FormSchema = z.object({
  time: z.number().min(5, {
    message: 'Time must almost of 5 seconds',
  }),
})

export const PlaylistSettings = () => {
  const { config, togglePlaylist, changePlaylistTime } = useWallpaperManager()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      time: config?.playlist_time ?? 60,
    },
  })

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Playlist settings</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center gap-2 p-2">
        <section className="rounded-md border-border p-2">
          <div className="flex items-center space-x-2">
            <Switch id="playlist_enable" checked={config?.playlist_enable} onCheckedChange={togglePlaylist} />
            <Label htmlFor="airplane-mode">Enable playlist</Label>
          </div>
        </section>
        <section className="rounded-md border-border p-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(({ time }) => changePlaylistTime(time))} className="w-2/3 space-y-6">
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={!config?.playlist_enable}
                        placeholder="Wallpaper time time"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Wallpaper duration in seconds</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={!config?.playlist_enable}>
                Save
              </Button>
            </form>
          </Form>
        </section>
      </div>
    </DialogContent>
  )
}
