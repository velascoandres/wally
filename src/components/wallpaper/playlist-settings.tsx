import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { type PlaylistSettingsOptions, useWallpaperManager } from '@/providers/wallpaper-manager'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useModalStore } from '@/store/modal'

const FormSchema: z.ZodType<PlaylistSettingsOptions> = z.object({
  playlistTime: z.coerce.number().min(5, {
    message: 'Time must almost of 5 seconds',
  }),
  playlistEnable: z.boolean(),
})

export const PlaylistSettings = () => {
  const { config, changePlaylistSettings } = useWallpaperManager()
  const { closeModal } = useModalStore()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      playlistTime: config?.playlistTime ?? 60,
      playlistEnable: config?.playlistEnable ?? false,
    },
  })

  const playlistEnable = form.watch('playlistEnable')

  const handleSubmit = async (settings: PlaylistSettingsOptions) => {
    await changePlaylistSettings(settings)
    closeModal()
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Playlist settings</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-center gap-2">
        <section className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-6">
              <FormField
                control={form.control}
                name="playlistEnable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Enable playlist mode</FormLabel>
                      <FormDescription className="text-pretty text-xs">
                        The wallpaper will change according the configured time
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="playlistTime"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Duration</FormLabel>
                      <FormDescription className="text-pretty text-xs">Wallpaper duration in seconds</FormDescription>
                    </div>
                    <FormControl>
                      <Input
                        className="basis-1/4"
                        type="number"
                        disabled={!playlistEnable}
                        placeholder="Wallpaper time time"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save</Button>
            </form>
          </Form>
        </section>
      </div>
    </DialogContent>
  )
}
