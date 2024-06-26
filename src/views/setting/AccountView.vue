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
      <CardTitle>Name</CardTitle>
      <CardDescription>Change your display name.</CardDescription>
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
  <Card>
    <CardHeader>
      <CardTitle>Password</CardTitle>
      <CardDescription>
        Switch to a new password. Note that all your devices will be signed out.
      </CardDescription>
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
  <Card>
    <CardHeader>
      <CardTitle>Email</CardTitle>
      <CardDescription>Rebind to another email address.</CardDescription>
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
