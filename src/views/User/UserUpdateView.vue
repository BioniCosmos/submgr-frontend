<script setup lang="ts">
import WarningDialog from '@/components/WarningDialog.vue'
import { AutoForm, type ConfigItem } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import ky, { fetcher } from '@/ky'
import type { Profile } from '@/type/profile'
import type { User } from '@/type/user'
import { toTypedSchema } from '@vee-validate/zod'
import { useMediaQuery } from '@vueuse/core'
import { Menu } from 'lucide-vue-next'
import { VisuallyHidden } from 'radix-vue'
import useSWRV from 'swrv'
import { useForm } from 'vee-validate'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  customizeLabel,
  disableAutoComplete,
  init,
  schema,
  type Key,
} from './common'

const router = useRouter()
const props = defineProps<{ id: string }>()

const isDesktop = useMediaQuery('(min-width: 768px)')

const dialogOpen = ref(false)
function openDialog() {
  dialogOpen.value = true
}

const fieldConfig = computed(() => {
  const addProps = ([key, value]: [Key, ConfigItem]) => [
    key,
    { ...value, inputProps: { ...value.inputProps, readonly: true } },
  ]
  return Object.fromEntries(
    schema
      .keyof()
      .options.map(init)
      .map(customizeLabel)
      .map(disableAutoComplete)
      .map(addProps),
  )
})

const form = useForm({ validationSchema: toTypedSchema(schema) })

const profiles = ref<Profile[]>()
onMounted(() => {
  ky('api/profiles')
    .json<Profile[]>()
    .then((value) => (profiles.value = value))
})

const { data: user, mutate } = useSWRV<User>(`api/user/${props.id}`, fetcher)
watch(user, (user) => {
  if (user !== undefined) {
    form.resetForm({ values: user })
  }
})

const deleteUser = () =>
  ky
    .delete(`api/user/${props.id}`)
    .then(() => (dialogOpen.value = false))
    .then(() => router.replace('/users'))

const extending = ref(false)
function extend() {
  if (user.value === undefined) {
    return
  }
  extending.value = true
  return ky
    .put('api/user', { json: { id: props.id, cycles: user.value.cycles + 1 } })
    .then(() => mutate())
    .then(() => (extending.value = false))
}

const updating = ref(false)
// It seems that we are unable to use curry or bind here.
function update(name: string, checked: boolean) {
  if (user.value === undefined) {
    return
  }
  updating.value = true
  return ky
    .patch('api/user', {
      json: {
        id: props.id,
        profileName: name,
        action: checked ? 'add' : 'remove',
      },
    })
    .then(() => mutate())
    .then(() => (updating.value = false))
}

const isChecked = (profileName: string) =>
  user.value?.profiles.find(({ name }) => name === profileName) !== undefined
</script>

<template>
  <Card>
    <CardHeader class="flex-row items-center justify-between">
      <CardTitle>User</CardTitle>
      <div v-if="isDesktop" class="space-x-4">
        <Button size="sm" as-child>
          <a :href="`/api/user/profiles?id=${id}`" target="_blank">
            Subscription link
          </a>
        </Button>
        <Button size="sm" @click="extend" :disabled="extending">Extend</Button>
        <Button size="sm" variant="secondary" @click="openDialog">
          Remove the user
        </Button>
      </div>
      <Drawer v-else>
        <DrawerTrigger as-child>
          <Button variant="outline" size="icon" class="shrink-0">
            <Menu class="h-5 w-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <VisuallyHidden>
            <DrawerHeader>
              <DrawerTitle></DrawerTitle>
              <DrawerDescription></DrawerDescription>
            </DrawerHeader>
          </VisuallyHidden>
          <DrawerFooter>
            <DrawerClose as-child>
              <Button as-child>
                <a :href="`/api/user/profiles?id=${id}`" target="_blank">
                  Subscription link
                </a>
              </Button>
            </DrawerClose>
            <DrawerClose as-child>
              <Button @click="extend" :disabled="extending">Extend</Button>
            </DrawerClose>
            <DrawerClose as-child>
              <Button variant="secondary" @click="openDialog">
                Remove the user
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </CardHeader>
    <CardContent>
      <AutoForm
        class="space-y-6"
        :schema="schema"
        :field-config="fieldConfig"
        :form="form"
      />
      <div class="mt-8 space-y-4">
        <h4 class="scroll-m-20 text-xl font-semibold tracking-tight mb-5">
          Profiles
        </h4>
        <template v-if="profiles !== undefined">
          <template v-if="profiles.length !== 0">
            <div
              class="flex items-center space-x-2"
              v-for="profile in profiles"
              :key="profile.name"
            >
              <Switch
                :id="profile.name"
                :checked="isChecked(profile.name)"
                @update:checked="(checked) => update(profile.name, checked)"
                :disabled="updating"
              />
              <Label :for="profile.name">{{ profile.name }}</Label>
            </div>
          </template>
          <div v-else class="text-muted-foreground">Nothing here</div>
        </template>
        <div v-else class="flex items-center space-x-2" v-for="i in 5" :key="i">
          <Skeleton class="w-32 h-6" />
        </div>
      </div>
    </CardContent>
  </Card>
  <WarningDialog
    v-if="user !== undefined"
    v-model="dialogOpen"
    @confirm="deleteUser"
  >
    The
    <span class="font-semibold text-primary">{{ user.name }}</span>
    will be permanently deleted.
  </WarningDialog>
</template>
