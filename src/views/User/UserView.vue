<script setup lang="ts">
import PaginationBar from '@/components/PaginationBar.vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fetcher } from '@/ky'
import type { Pagination } from '@/type/pagination'
import type { User } from '@/type/user'
import useSWRV from 'swrv'
import { ref } from 'vue'

const page = ref(1)
const { data: pagination } = useSWRV<Pagination<User>>(
  () => `api/users?page=${page.value}`,
  fetcher,
)

const isPaid = (user: User) =>
  Temporal.ZonedDateTime.compare(
    user.nextDate,
    Temporal.Now.zonedDateTimeISO(),
  ) !== -1
</script>

<template>
  <Card>
    <CardHeader class="flex-row items-center">
      <CardTitle>Users</CardTitle>
      <Button as-child size="sm" class="ml-auto">
        <RouterLink to="/user">Add</RouterLink>
      </Button>
    </CardHeader>
    <CardContent>
      <Table class="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead class="font-semibold">Name</TableHead>
            <TableHead class="font-semibold">Email</TableHead>
            <TableHead class="font-semibold">Level</TableHead>
            <TableHead class="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody v-if="pagination === undefined">
          <TableRow v-for="i in 5" :key="i">
            <TableCell>
              <Skeleton class="h-6" />
            </TableCell>
            <TableCell>
              <Skeleton class="h-6" />
            </TableCell>
            <TableCell>
              <Skeleton class="h-6" />
            </TableCell>
            <TableCell>
              <Skeleton class="h-6" />
            </TableCell>
          </TableRow>
        </TableBody>
        <TableBody v-else>
          <TableRow v-if="pagination.items.length === 0">
            <TableCell colspan="4" class="text-center text-muted-foreground">
              Nothing here
            </TableCell>
          </TableRow>
          <TableRow
            v-else
            v-for="user in pagination.items"
            :key="user.id"
            @click="$router.push(`/user/${user.id}`)"
          >
            <TableCell class="truncate">{{ user.name }}</TableCell>
            <TableCell class="truncate">{{ user.email }}</TableCell>
            <TableCell class="truncate">{{ user.level }}</TableCell>
            <TableCell class="font-semibold truncate">
              <div v-if="isPaid(user)">{{ user.profiles.length }} profiles</div>
              <div v-else class="text-destructive">expired</div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
    <CardFooter
      v-if="pagination !== undefined && pagination.items.length !== 0"
    >
      <PaginationBar :total="pagination.total" v-model="page" />
    </CardFooter>
  </Card>
</template>
