<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Base URL</CardTitle>
      <CardDescription>The base URL of the site.</CardDescription>
    </CardHeader>
    <CardContent>
      <form class="flex flex-col gap-4">
        <Input />
      </form>
    </CardContent>
    <CardFooter class="border-t px-6 py-4">
      <Button>Save</Button>
    </CardFooter>
  </Card>
</template>
