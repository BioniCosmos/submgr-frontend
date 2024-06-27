<script setup lang="ts">
import ConfigField from '@/components/ConfigField.vue'
import { AutoForm } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ky from '@/ky'
import type { GenericObject } from 'vee-validate'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'

const route = useRoute()
const router = useRouter()

const schema = z.object({
  name: z.string().min(1),
  inbound: z.string().min(1),
  outbound: z.string().min(1),
})

const insert = (event: GenericObject) =>
  ky
    .post('api/profile', { json: { ...event, nodeId: route.query.nodeId } })
    .then(() => router.push('/nodes'))
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Profile</CardTitle>
    </CardHeader>
    <CardContent>
      <AutoForm
        class="space-y-6"
        :schema="schema"
        :field-config="{
          inbound: { component: ConfigField },
          outbound: { component: ConfigField },
        }"
        @submit="insert"
        v-slot="{ submitting }"
      >
        <Button :disabled="submitting">Submit</Button>
      </AutoForm>
    </CardContent>
  </Card>
</template>
