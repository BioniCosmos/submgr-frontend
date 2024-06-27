<script setup lang="ts">
import PaginationBar from '@/components/PaginationBar.vue'
import WarningDialog from '@/components/WarningDialog.vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import ky, { fetcher } from '@/ky'
import type { Node } from '@/type/node'
import type { Pagination } from '@/type/pagination'
import { ChevronsUpDown } from 'lucide-vue-next'
import useSWRV from 'swrv'
import { ref } from 'vue'

const page = ref(1)
const { data: pagination, mutate } = useSWRV<Pagination<Node>>(
  () => `api/nodes?page=${page.value}`,
  fetcher,
)
const open = ref(false)
const profileName = ref('')

function openDialog(name: string) {
  profileName.value = name
  open.value = true
}

const deleteProfile = () =>
  ky
    .delete(`api/profile/${profileName.value}`)
    .then(() => mutate())
    .then(() => (open.value = false))
</script>

<template>
  <Card>
    <CardHeader class="flex flex-row items-center">
      <CardTitle>Nodes</CardTitle>
      <Button as-child size="sm" class="ml-auto">
        <RouterLink to="/node">Add</RouterLink>
      </Button>
    </CardHeader>
    <CardContent>
      <Table class="table-fixed max-md:w-[607px]">
        <TableHeader>
          <TableRow>
            <TableHead class="font-semibold">Name</TableHead>
            <TableHead class="font-semibold">API Address</TableHead>
            <TableHead class="font-semibold w-[286px]">Profiles</TableHead>
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
          </TableRow>
        </TableBody>
        <TableBody v-else>
          <TableRow v-if="pagination.items.length === 0">
            <TableCell colspan="3" class="text-center text-muted-foreground">
              Nothing here
            </TableCell>
          </TableRow>
          <TableRow
            v-else
            v-for="node in pagination.items"
            :key="node.id"
            @click="$router.push(`/node/${node.id}`)"
          >
            <TableCell class="truncate">{{ node.name }}</TableCell>
            <TableCell class="truncate">{{ node.apiAddress }}</TableCell>
            <TableCell @click.stop>
              <Collapsible class="w-[250px] space-y-2">
                <div class="flex items-center justify-between space-x-4">
                  <h4 class="text-sm font-semibold">
                    {{ node.profileNames.length }} profiles
                  </h4>
                  <CollapsibleTrigger
                    as-child
                    v-if="node.profileNames.length !== 0"
                  >
                    <Button variant="ghost" size="sm" class="w-9 p-0">
                      <ChevronsUpDown class="h-4 w-4" />
                      <span class="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent class="space-y-2 mx-2">
                  <button
                    class="rounded-md border px-4 py-3 text-sm w-full hover:bg-accent hover:text-accent-foreground"
                    v-for="profileName in node.profileNames"
                    :key="profileName"
                    @click="openDialog(profileName)"
                  >
                    {{ profileName }}
                  </button>
                </CollapsibleContent>
              </Collapsible>
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
  <WarningDialog v-model="open" :name="profileName" @confirm="deleteProfile" />
</template>
