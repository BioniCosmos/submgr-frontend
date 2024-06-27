<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import ky from '@/ky'
import type { Node } from '@/type/node'
import type { Pagination } from '@/type/pagination'
import type { Profile } from '@/type/profile'
import type { User } from '@/type/user'
import { onMounted, ref } from 'vue'

const total = ref<{ node: number; profile: number; user: number }>()

onMounted(() => {
  Promise.all([
    ky('api/nodes').json<Pagination<Node>>(),
    ky('api/profiles').json<Profile[]>(),
    ky('api/users').json<Pagination<User>>(),
  ]).then(
    ([nodes, profiles, users]) =>
      (total.value = {
        node: nodes.total,
        profile: profiles.length,
        user: users.total,
      }),
  )
})
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
    <Card>
      <CardHeader
        class="flex flex-row items-center justify-between space-y-0 pb-2"
      >
        <CardTitle class="text-sm font-medium">Nodes</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold" v-if="total !== undefined">
          {{ total.node }}
        </div>
        <Skeleton class="h-8 w-4" v-else />
      </CardContent>
    </Card>
    <Card>
      <CardHeader
        class="flex flex-row items-center justify-between space-y-0 pb-2"
      >
        <CardTitle class="text-sm font-medium">Profiles</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold" v-if="total !== undefined">
          {{ total.profile }}
        </div>
        <Skeleton class="h-8 w-4" v-else />
      </CardContent>
    </Card>
    <Card>
      <CardHeader
        class="flex flex-row items-center justify-between space-y-0 pb-2"
      >
        <CardTitle class="text-sm font-medium">Users</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold" v-if="total !== undefined">
          {{ total.user }}
        </div>
        <Skeleton class="h-8 w-4" v-else />
      </CardContent>
    </Card>
  </div>
</template>
