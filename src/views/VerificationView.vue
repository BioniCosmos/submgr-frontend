<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ky from '@/ky'
import { refreshAccount } from '@/type/account'
import type { HTTPError } from 'ky'
import { CircleAlert } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ id: string }>()
const id = computed(() => props.id)
const hasId = computed(() => id.value !== '')
const router = useRouter()

const showAlert = ref(false)
const expired = ref(false)

const sendVerificationLink = () =>
  ky.post('api/account/verification').then(() => (showAlert.value = true))

onMounted(() => {
  if (hasId.value) {
    ky.post(`api/account/verification/${id.value}`)
      .then(refreshAccount)
      .then(() => router.push('/'))
      .catch((error: HTTPError) => {
        if (error.response.status === 404) {
          expired.value = true
        }
      })
  }
})
</script>

<template>
  <div class="flex items-center justify-center h-dvh">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl">Verification</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert v-if="showAlert" class="mb-4">
          <CircleAlert class="size-4" />
          <AlertTitle>Sent Successfully</AlertTitle>
          <AlertDescription>Please check your inbox again.</AlertDescription>
        </Alert>
        <div v-if="hasId">
          <template v-if="!expired">Please wait a second…</template>
          <template v-else
            >The link has expired.
            <Button
              variant="link"
              class="p-0 text-base"
              @click="sendVerificationLink"
              >Send again</Button
            >.
          </template>
        </div>
        <template v-else>
          <div>Please check your email inbox.</div>
          <div>
            Not received?
            <Button
              variant="link"
              class="p-0 text-base"
              @click="sendVerificationLink"
              >Send again</Button
            >.
          </div>
        </template>
      </CardContent>
    </Card>
  </div>
</template>
