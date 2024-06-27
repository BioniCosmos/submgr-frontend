<script setup lang="ts">
import { AutoForm } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import ky from '@/ky'
import { useAccount, type Account } from '@/type/account'
import type { DefaultResponse } from '@/type/default-response'
import { toTypedSchema } from '@vee-validate/zod'
import type { HTTPError } from 'ky'
import { useForm, type GenericObject } from 'vee-validate'
import { useRouter } from 'vue-router'
import { z } from 'zod'

const router = useRouter()

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
})

const form = useForm({ validationSchema: toTypedSchema(schema) })

const submit = (event: GenericObject) => {
  const account = useAccount()
  return ky
    .post('api/account/sign-up', { json: event })
    .json<Account>()
    .then((body) => {
      account.value = body
    })
    .then(() => router.push('/verification'))
    .catch(async (error: HTTPError) => {
      if (error.response.status === 409) {
        const body: DefaultResponse = await error.response.json()
        form.setFieldError('email', body.message)
      }
    })
}
</script>

<template>
  <div class="flex items-center justify-center h-dvh">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AutoForm
          class="space-y-4"
          :schema="schema"
          :form="form"
          @submit="submit"
          v-slot="{ submitting }"
        >
          <Button class="w-full" :disabled="submitting">
            Create an account
          </Button>
        </AutoForm>
        <div class="mt-4 text-center text-sm">
          Already have an account?
          <RouterLink to="/sign-in" class="underline">Sign in</RouterLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
