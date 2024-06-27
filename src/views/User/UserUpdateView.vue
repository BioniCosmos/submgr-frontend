<script setup lang="ts">
import WarningDialog from '@/components/WarningDialog.vue'
import { AutoForm, type ConfigItem } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import ky from '@/ky'
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
const id = computed(() => props.id)

const isDesktop = useMediaQuery('(min-width: 768px)')

const drawerOpen = ref(false)
const closeDrawer = () => (drawerOpen.value = false)

const dialogOpen = ref(false)
function openDialog() {
  closeDrawer()
  dialogOpen.value = true
}

function viewSubscriptionLinks() {
  open(`/api/user/profiles?id=${id.value}`)
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

const profiles = ref(Array.of<Profile>())
onMounted(() => {
  ky('api/profiles')
    .json<Profile[]>()
    .then((value) => (profiles.value = value))
})

const { data: user, mutate } = useSWRV<User>(`api/user/${id.value}`, (url) =>
  ky(url).json(),
)
watch(user, (user) => {
  if (user !== undefined) {
    form.resetForm({
      values: {
        ...user,
        date: new Date(user.nextDate.epochMilliseconds),
      },
    })
  }
})

const deleteUser = () =>
  ky
    .delete(`api/user/${id.value}`)
    .then(() => (dialogOpen.value = false))
    .then(() => router.replace('/users'))

const extending = ref(false)
function extend() {
  if (user.value === undefined) {
    return
  }
  extending.value = true
  const { startDate, cycles } = user.value
  return ky
    .put('api/user', {
      json: {
        id,
        cycles: cycles + 1,
        nextDate: startDate.add({ months: cycles + 1 }),
      },
    })
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
      json: { id, profileName: name, action: checked ? 'add' : 'remove' },
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
        <Button size="sm" @click="viewSubscriptionLinks">
          Subscription links
        </Button>
        <Button size="sm" @click="extend" :disabled="extending">Extend</Button>
        <Button size="sm" variant="secondary" @click="openDialog">
          Remove the user
        </Button>
      </div>
      <Drawer v-else v-model:open="drawerOpen">
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
            <Button @click="viewSubscriptionLinks">Subscription link</Button>
            <Button @click="extend" :disabled="extending">Extend</Button>
            <Button variant="secondary" @click="openDialog">
              Remove the user
            </Button>
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
      >
      </AutoForm>
      <div class="mt-8 space-y-4">
        <h4 class="scroll-m-20 text-xl font-semibold tracking-tight mb-5">
          Profiles
        </h4>
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
      </div>
    </CardContent>
  </Card>
  <WarningDialog
    v-if="user !== undefined"
    :name="user.name"
    v-model="dialogOpen"
    @confirm="deleteUser"
  />
</template>
