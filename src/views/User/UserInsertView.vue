<script setup lang="ts">
import { AutoForm } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ky from '@/ky'
import type { Profile } from '@/type/profile'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, type GenericObject } from 'vee-validate'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { customizeLabel, disableAutoComplete, init, schema } from './common'

const router = useRouter()

const fieldConfig = computed(() =>
  Object.fromEntries(
    schema
      .keyof()
      .options.map(init)
      .map(customizeLabel)
      .map(disableAutoComplete),
  ),
)

const form = useForm({ validationSchema: toTypedSchema(schema) })

const profiles = ref(Array.of<Profile>())
onMounted(() => {
  ky('api/profiles')
    .json<Profile[]>()
    .then((value) => (profiles.value = value))
})

function generate() {
  form.setValues(
    {
      level: 0,
      uuid: crypto.randomUUID(),
      flow: 'xtls-rprx-vision',
      security: 'auto',
      date: new Date(
        Temporal.Now.zonedDateTimeISO().add({
          months: 1,
        }).epochMilliseconds,
      ),
    },
    false,
  )
}

function submit(event: GenericObject) {
  const { date, ...fields } = event as z.infer<typeof schema>
  const nextDate = dateToZonedDateTime(date)
  const startDate = nextDate.subtract({ months: 1 })
  return ky
    .post('api/user', {
      json: { ...fields, startDate, cycles: 1, nextDate },
    })
    .then(() => router.replace('/users'))
}

function dateToZonedDateTime(date: Date) {
  const now = Temporal.Now
  return date
    .toTemporalInstant()
    .toZonedDateTimeISO(now.timeZoneId())
    .withPlainTime(now.plainTimeISO())
}
</script>

<template>
  <Card>
    <CardHeader class="flex-row items-center justify-between">
      <CardTitle>User</CardTitle>
      <Button @click="generate">Generate</Button>
    </CardHeader>
    <CardContent>
      <AutoForm
        class="space-y-6"
        :schema="schema"
        :field-config="fieldConfig"
        :form="form"
        @submit="submit"
        v-slot="{ submitting }"
      >
        <Button :disabled="submitting">Submit</Button>
      </AutoForm>
    </CardContent>
  </Card>
</template>
