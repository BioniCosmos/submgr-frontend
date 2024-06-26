<script setup lang="ts">
import { AutoForm } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { z } from 'zod'

const schema = z.object({
  host: z.string().min(1),
  port: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>SMTP</CardTitle>
    </CardHeader>
    <CardContent>
      <AutoForm :schema="schema" class="space-y-4" />
    </CardContent>
    <CardFooter class="border-t px-6 py-4">
      <Button>Save</Button>
    </CardFooter>
  </Card>
</template>
